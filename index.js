var express = require("express");
var app = express();
var cors = require("cors");
var fs = require("fs");
var path = require("path");
const fetch = require("node-fetch");
var schedule = require("node-schedule");
var bodyParser = require("body-parser");
const AWS = require("aws-sdk");

var app = express();
app.use(cors());

app.use(express.static(path.join(__dirname, "public")));
app.use("/static", express.static(path.join(__dirname, "public")));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

const [day, month, year] = new Date().toLocaleDateString("en-US").split("/");
let tomorrowsDate = new Date();
tomorrowsDate.setDate(new Date().getDate() + 1);
let [
  tomorrowDay,
  tomorrowMonth,
  tomorrowYear,
] = tomorrowsDate.toLocaleDateString("en-US").split("/");

let yesterdaysDate = new Date();
yesterdaysDate.setDate(new Date().getDate() - 1);
let [
  yesterdayDay,
  yesterdayMonth,
  yesterdayYear,
] = yesterdaysDate.toLocaleDateString("en-US").split("/");

var d = new Date();

// set to Monday of this week
d.setDate(d.getDate() - (d.getDay() + 6) % 7);

// set to Saturday just gone
d.setDate(d.getDate() - 2);

let [
  saturdayDay,
  saturdayMonth,
  saturdayYear,
] = d.toLocaleDateString("en-US").split("/");

// const port = process.env.PORT || 5000;

const apiKey = process.env.API_KEY;

const saturday = `https://api.footystats.org/todays-matches?key=${apiKey}&date=${saturdayYear}-${saturdayDay}-${saturdayMonth}`;
const yesterday = `https://api.footystats.org/todays-matches?key=${apiKey}&date=${yesterdayYear}-${yesterdayDay}-${yesterdayMonth}`;
const today = `https://api.footystats.org/todays-matches?key=${apiKey}&date=${year}-${day}-${month}`;
const tomorrow = `https://api.footystats.org/todays-matches?key=${apiKey}&date=${tomorrowYear}-${tomorrowDay}-${tomorrowMonth}`;

app.listen(process.env.PORT || 5000, function () {
  console.log(
    "Express server listening on port %d in %s mode",
    this.address().port,
    app.settings.env
  );
});

const s3 = new AWS.S3({
  accessKeyId: process.env.ID,
  secretAccessKey: process.env.SECRET,
});

const uploadFile = (file, name) => {
  // Read content from the file
  const fileContent = fs.readFileSync(file);

  // Setting up S3 upload parameters
  const params = {
    Bucket: "predictorfiles",
    Key: name, // File name you want to save as in S3
    Body: fileContent,
  };

  // Uploading files to the bucket
  s3.upload(params, function (err, data) {
    if (err) {
      throw err;
    }
    console.log(`File uploaded successfully. ${data.Location}`);
  });
};

app.get("/", function (req, res) {
  res.send("<h1>Hello World!</h1>");
});

async function getTeamStats(identifier){
  let match = await fetch(
    `https://api.football-data-api.com/match?key=${apiKey}&match_id=${identifier}`
  );
  let responseBody = match.json()
  return responseBody
}

app.get("/match/:id", async (req, res) => {
  let id = req.params
  let match = await getTeamStats(id.id)
  res.send(match);
})



app.get("/todaysFixtures", (req, res) => {
  fs.readFile("today.json", function (err, data) {
    if (err) res.sendStatus(404);
    const fixtures = JSON.parse(data);
    res.send({ fixtures });
  });
});

app.get("/tomorrowsFixtures", (req, res) => {
  fs.readFile("tomorrow.json", function (err, data) {
    if (err) res.sendStatus(404);
    const fixtures = JSON.parse(data);
    res.send({ fixtures });
  });
});

app.get("/yesterdaysFixtures", (req, res) => {
  fs.readFile("yesterday.json", function (err, data) {
    if (err) res.sendStatus(404);
    const fixtures = JSON.parse(data);
    res.send({ fixtures });
  });
});


app.get(`/leagueData`, (req, res, next) => {
  let fileName = `leagueData${day}${month}${year}.json`;
  let params = {
    Bucket: "predictorfiles",
    Key: fileName,
  };
  // if todays' form is requested, get it from s3

  s3.getObject(params, (err, data) => {
    if (err) {
      console.error(err);
      res.sendStatus(404);
      next(err);
    } else {
      console.log("sending s3 data for all league data");
      let objectData = data.Body.toString("utf-8");
      const leagueData = JSON.parse(objectData);
      console.log("leagueData from s3");
      res.send(leagueData);
    }
  });
});




app.post(`/leagues/:date`, (req, res) => {
  let date = req.params
  let fileName = `leagues${date.date}.json`;
  let params = {
    Bucket: "predictorfiles",
    Key: fileName,
  };

  s3.headObject(params, function (err, data) {
    if (err) {
      console.error(err);
      fs.writeFile(
        fileName,
        JSON.stringify(req.body),
        function (err) {
          if (err) {
            res.sendStatus(500);
            return console.log(err);
          } else {
            uploadFile(
              fileName,
              fileName
            );
            res.sendStatus(200);
          }
        }
      );
    } else {
      console.log("league table exists in s3, writing to local storage");
      fs.writeFile(
        fileName,
        JSON.stringify(req.body),
        function (err) {
          if (err) {
            res.sendStatus(500);
            return console.log(err);
          } else {
            res.sendStatus(200);
          }
        }
      );
    }
  });
});

async function getLeague(id){
  let league = await fetch(
    `https://api.footystats.org/league-tables?key=${apiKey}&season_id=${id}`
  );
  let responseBody = league.json()
  return responseBody
}

app.get(`/tables/:leagueId/:date`, (req, res, next) => {
  let parameters = req.params
  let fileName = `${day}${month}${year}${parameters.leagueId}.json`;
  let params = {
    Bucket: "predictorfiles",
    Key: fileName,
  };
  // if todays' form is requested, get it from s3

  s3.getObject(params, async (err, data) => {
    if (err) {
      let league = await getLeague(parameters.leagueId)
      res.send(league);
      // next(err);
    } else {
      console.log("sending s3 data for league tables");
      let objectData = data.Body.toString("utf-8");
      const leagues = JSON.parse(objectData);
      console.log("leagueData from s3");
      res.send(leagues);
    }
  });
});


app.get(`/leagues/:date`, (req, res, next) => {
  let date = req.params
  console.log(`DATE ${date.date}`)
  let fileName = `leagues${date.date}.json`;
  let params = {
    Bucket: "predictorfiles",
    Key: fileName,
  };
  // if todays' form is requested, get it from s3

  s3.getObject(params, (err, data) => {
    if (err) {
      console.error(err);
      res.sendStatus(404);
      next(err);
    } else {
      console.log("sending s3 data for league tables");
      let objectData = data.Body.toString("utf-8");
      const leagues = JSON.parse(objectData);
      console.log("leagueData from s3");
      res.send(leagues);
    }
  });
});

async function getLeagueList(){
  let list = await fetch(`https://api.footystats.org/league-list?key=${apiKey}&chosen_leagues_only=true`)
  let responseBody = list.json()
  return responseBody
}

app.get(`/leagueList`, (req, res, next) => {
  let fileName = `leagueList.json`;
  let params = {
    Bucket: "predictorfiles",
    Key: fileName,
  };
  // if todays' form is requested, get it from s3

  s3.getObject(params, async (err, data) => {
    if (err) {
      let leagueList = await getLeagueList()
      res.send(leagueList);
      // next(err);
    } else {
      let objectData = data.Body.toString("utf-8");
      const leagues = JSON.parse(objectData);
      res.send(leagues);
    }
  });
});


async function getMatches(date){
  let matches = await fetch(`https://api.footystats.org/todays-matches?key=${apiKey}&date=${date}`)
  let responseBody = matches.json()
  return responseBody
}

app.get(`/matches/:date`, async (req, res, next) => {
  let date = req.params
  let fileName = `matches${date.date}.json`;
  let params = {
    Bucket: "predictorfiles",
    Key: fileName,
  };
  s3.getObject(params, async (err, data) => {
    if (err) {
      let matchList = await getMatches(date.date)
      res.send(matchList);
    } else {
      let objectData = data.Body.toString("utf-8");
      const games = JSON.parse(objectData);
      res.send(games);
    }
  });
});



async function getForm(team){
  let matches = await fetch(`https://api.footystats.org/lastx?key=${apiKey}&team_id=${team}`)
  let responseBody = matches.json()
  return responseBody
}
app.get(`/form/:team`, async(req, res, next) => {

  let team = req.params
  let fileName = `form${team.team}.json`;
  let params = {
    Bucket: "predictorfiles",
    Key: fileName,
  };
  let form = await getForm(team.team)
  res.send(form);
});


app.post(`/leagueData`, (req, res) => {
  let fileName = `leagueData${day}${month}${year}.json`;
  let params = {
    Bucket: "predictorfiles",
    Key: fileName,
  };

  s3.headObject(params, function (err, data) {
    if (err) {
      console.error(err);
      fs.writeFile(
        `leagueData${day}${month}${year}.json`,
        JSON.stringify(req.body),
        function (err) {
          if (err) {
            res.sendStatus(500);
            console.error(err);
          } else {
            uploadFile(
              `leagueData${day}${month}${year}.json`,
              `leagueData${day}${month}${year}.json`
            );
            res.sendStatus(200);
          }
        }
      );
    } else {
      console.log("league data exists in s3, writing to local storage");
      fs.writeFile(
        `leagueData${day}${month}${year}.json`,
        JSON.stringify(req.body),
        function (err) {
          if (err) {
            res.sendStatus(500);
            return console.log(err);
          } else {
            res.sendStatus(200);
          }
        }
      );
    }
  });
});


app.post("/allFormlastSaturday", (req, res, next) => {
  console.log("post request called");
  let fileName = `allForm${saturdayDay}${saturdayMonth}${saturdayYear}.json`;
  let params = {
    Bucket: "predictorfiles",
    Key: fileName,
  };

  fs.access(fileName, fs.constants.F_OK | fs.constants.W_OK, (err) => {
    if (err) {
      fs.writeFile(fileName, JSON.stringify(req.body), function (err) {
        if (err) {
          res.sendStatus(500);
          next(err);
        } else {
          s3.headObject(params, function (err, data) {
            if (err) {
              uploadFile(fileName, fileName);
              res.sendStatus(200);
            } else {
              res.sendStatus(400);
            }
          });
        }
      });
    } else {
      console.log("file already exists in local storage");
      res.sendStatus(200);
    }
  });
});


app.post("/allFormyesterdaysFixtures", (req, res, next) => {
  console.log("post request called");
  let fileName = `allForm${yesterdayDay}${yesterdayMonth}${yesterdayYear}.json`;
  let params = {
    Bucket: "predictorfiles",
    Key: fileName,
  };

  fs.access(fileName, fs.constants.F_OK | fs.constants.W_OK, (err) => {
    if (err) {
      fs.writeFile(fileName, JSON.stringify(req.body), function (err) {
        if (err) {
          res.sendStatus(500);
          next(err);
        } else {
          s3.headObject(params, function (err, data) {
            if (err) {
              uploadFile(fileName, fileName);
              res.sendStatus(200);
            } else {
              res.sendStatus(400);
            }
          });
        }
      });
    } else {
      console.log("file already exists in local storage");
      res.sendStatus(200);
    }
  });
});

app.post("/allFormtodaysFixtures", (req, res, next) => {
  console.log("post request called");
  let fileName = `allForm${day}${month}${year}.json`;
  let params = {
    Bucket: "predictorfiles",
    Key: fileName,
  };

  fs.access(fileName, fs.constants.F_OK | fs.constants.W_OK, (err) => {
    if (err) {
      console.error(err);
      fs.writeFile(fileName, JSON.stringify(req.body), function (err) {
        if (err) {
          res.sendStatus(500);
          next(err);
        } else {
          s3.headObject(params, function (err, data) {
            if (err) {
              uploadFile(fileName, fileName);
              res.sendStatus(200);
            } else {
              res.sendStatus(400);
            }
          });
        }
      });
    } else {
      console.log("file already exists in local storage");
      res.sendStatus(200);
    }
  });
});

app.post("/allFormtomorrowsFixtures", (req, res, next) => {
  console.log("post request called");
  let fileName = `allForm${tomorrowDay}${tomorrowMonth}${tomorrowYear}.json`;
  let params = {
    Bucket: "predictorfiles",
    Key: fileName,
  };

  fs.access(fileName, fs.constants.F_OK | fs.constants.W_OK, (err) => {
    if (err) {
      console.error(err);
      fs.writeFile(fileName, JSON.stringify(req.body), function (err) {
        if (err) {
          res.sendStatus(500);
          next(err);
        } else {
          s3.headObject(params, function (err, data) {
            if (err) {
              uploadFile(fileName, fileName);
              res.sendStatus(200);
            } else {
              res.sendStatus(400);
            }
          });
        }
      });
    } else {
      console.log("file already exists in local storage");
      res.sendStatus(200);
    }
  });
});


app.get("/formlastSaturday", async (req, res, next) => {
  let fileName = `allForm${saturdayDay}${saturdayMonth}${saturdayYear}.json`;
  let params = {
    Bucket: "predictorfiles",
    Key: fileName,
  };

  // if saturdays' form is requested, get it from s3
  fs.access(fileName, fs.constants.F_OK | fs.constants.W_OK, (err) => {
    if (err) {
      console.error(err);
      console.log("file not stored locally");

      s3.headObject(params, function (err, data) {
        console.log("checking to see if file is in s3");
        if (err) {
          console.log("file not found in s3");
          console.error(err);
          res.sendStatus(500);
        } else {
          s3.getObject(params, (err, data) => {
            if (err) {
              console.error(err);
              res.sendStatus(404);
              next(err);
            } else {
              console.log("sending s3 data for all form");
              let objectData = data.Body.toString("utf-8");
              const form = JSON.parse(objectData);
              res.status(201).send(form);
            }
          });
        }
      });
    } else {
      fs.readFile(fileName, function (err, data) {
        console.log(`reading and returning ${fileName}`);
        if (err) {
          console.error(err);
          res.sendStatus(500);
        } else {
          const form = JSON.parse(data);
          res.send(form);
        }
      });
      console.log("returning data from local storage");
    }
  });
});


app.get("/formyesterdaysFixtures", async (req, res, next) => {
  let fileName = `allForm${yesterdayDay}${yesterdayMonth}${yesterdayYear}.json`;
  let params = {
    Bucket: "predictorfiles",
    Key: fileName,
  };

  // if yesterdays' form is requested, get it from s3
  fs.access(fileName, fs.constants.F_OK | fs.constants.W_OK, (err) => {
    if (err) {
      console.error(err);
      console.log("file not stored locally");

      s3.headObject(params, function (err, data) {
        console.log("checking to see if file is in s3");
        if (err) {
          console.log("file not found in s3");
          console.error(err);
          res.sendStatus(500);
        } else {
          s3.getObject(params, (err, data) => {
            if (err) {
              console.error(err);
              res.sendStatus(404);
              next(err);
            } else {
              console.log("sending s3 data for all form");
              let objectData = data.Body.toString("utf-8");
              const form = JSON.parse(objectData);
              res.status(201).send(form);
            }
          });
        }
      });
    } else {
      fs.readFile(fileName, function (err, data) {
        console.log(`reading and returning ${fileName}`);
        if (err) {
          console.error(err);
          res.sendStatus(500);
        } else {
          const form = JSON.parse(data);
          res.send(form);
        }
      });
      console.log("returning data from local storage");
    }
  });
});

app.get("/formtodaysFixtures", async (req, res, next) => {
  let fileName = `allForm${day}${month}${year}.json`;
  let params = {
    Bucket: "predictorfiles",
    Key: fileName,
  };
  console.log("Attempting to get all form")
  // if todays' form is requested, get it from s3
  fs.access(fileName, fs.constants.F_OK | fs.constants.W_OK, (err) => {
    if (err) {
      console.error(err);
      s3.headObject(params, function (err, data) {
        if (err) {
          console.error(err);
          res.sendStatus(500);
        } else {
          s3.getObject(params, (err, data) => {
            if (err) {
              console.error(err);
              res.sendStatus(404);
              next(err);
            } else {
              console.log("sending s3 data for all form");
              let objectData = data.Body.toString("utf-8");
              const form = JSON.parse(objectData);
              res.status(201).send(form);
              // res.send(form);
            }
          });
        }
      });
    } else {
      fs.readFile(fileName, function (err, data) {
        if (err) {
          console.error(err);
          res.sendStatus(500);
        } else {
          const form = JSON.parse(data);
          res.send(form);
        }
      });
      console.log("returning data from local storage");
    }
  });
});

app.get("/formtomorrowsFixtures", async (req, res, next) => {
  let fileName = `allForm${tomorrowDay}${tomorrowMonth}${tomorrowYear}.json`;
  var d = new Date();
  var n = d.getHours();  let params = {
    Bucket: "predictorfiles",
    Key: fileName,
  };
  console.log(fileName)
  fs.access(fileName, fs.constants.F_OK | fs.constants.W_OK, (err) => {
    console.log(err)
    if (err || n < 2) {
      console.log(n)
      console.error(err);

      s3.headObject(params, function (err, data) {

        if (err) {
          console.error(err);
          res.sendStatus(500);
        } else {
          s3.getObject(params, (err, data) => {

            if (err) {

              console.error(err);
              res.sendStatus(404);
              next(err);
            } else {
              console.log("sending s3 data for all form");
              let objectData = data.Body.toString("utf-8");
              const form = JSON.parse(objectData);
              res.status(201).send(form);
              // res.send(form);
            }
          });
        }
      });
    } else {
      fs.readFile(fileName, function (err, data) {

        if (err) {
          console.error(err);
          res.sendStatus(500);
        } else {
          const form = JSON.parse(data);
          res.send(form);
        }
      });
      console.log("returning form data from local storage");
    }
  });
});
