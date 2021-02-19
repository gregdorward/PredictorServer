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

console.log(process.env.NODE_ENV);

// if (process.env.NODE_ENV === "production") {
//   app.use(
//     cors({
//       origin: "https://gregdorward.github.io",
//     })
//   );
// } else {
//   app.use(
//     cors({
//       origin: "http://localhost:3000",
//     })
//   );
// }
// app.options('*', cors()) // include before other routes

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

// const port = process.env.PORT || 5000;

const apiKey = process.env.API_KEY;

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

app.post("/postPredictions5todaysFixtures", (req, res) => {
  fs.writeFile(
    `fixedPredictions5today.json`,
    JSON.stringify(req.body),
    function (err) {
      if (err) {
        res.sendStatus(500);
        return console.log(err);
      } else {
        uploadFile(
          "fixedPredictions5today.json",
          "fixedPredictions5today.json"
        );
        res.sendStatus(200);
      }
    }
  );
});

app.post(
  "/postPredictions5tomorrowsFixtures",

  (req, res) => {
    fs.writeFile(
      `fixedPredictions5tomorrow.json`,
      JSON.stringify(req.body),
      function (err) {
        if (err) {
          res.sendStatus(500);
          return console.log(err);
        } else {
          uploadFile(
            "fixedPredictions5tomorrow.json",
            "fixedPredictions5tomorrow.json"
          );
          res.sendStatus(200);
        }
      }
    );
  }
);

app.post("/postPredictions6todaysFixtures", (req, res) => {
  fs.writeFile(
    `fixedPredictions6today.json`,
    JSON.stringify(req.body),
    function (err) {
      if (err) {
        res.sendStatus(500);
        return console.log(err);
      } else {
        uploadFile(
          "fixedPredictions6today.json",
          "fixedPredictions6today.json"
        );
        res.sendStatus(200);
      }
    }
  );
});

app.post(
  "/postPredictions6tomorrowsFixtures",

  (req, res) => {
    fs.writeFile(
      `fixedPredictions6tomorrow.json`,
      JSON.stringify(req.body),
      function (err) {
        if (err) {
          res.sendStatus(500);
          return console.log(err);
        } else {
          uploadFile(
            "fixedPredictions6tomorrow.json",
            "fixedPredictions6tomorrow.json"
          );
          res.sendStatus(200);
        }
      }
    );
  }
);

app.post("/postPredictions10todaysFixtures", (req, res) => {
  fs.writeFile(
    `fixedPredictions10today.json`,
    JSON.stringify(req.body),
    function (err) {
      if (err) {
        res.sendStatus(500);
        return console.log(err);
      } else {
        uploadFile(
          "fixedPredictions10today.json",
          "fixedPredictions10today.json"
        );
        res.sendStatus(200);
      }
    }
  );
});

app.post("/postPredictions10tomorrowsFixtures", (req, res) => {
  fs.writeFile(
    `fixedPredictions10tomorrow.json`,
    JSON.stringify(req.body),
    function (err) {
      if (err) {
        res.sendStatus(500);
        return console.log(err);
      } else {
        uploadFile(
          "fixedPredictions10tomorrow.json",
          "fixedPredictions10tomorrow.json"
        );
        res.sendStatus(200);
      }
    }
  );
});

app.post("/allFormyesterdaysFixtures", (req, res, next) => {
  console.log("post request called");
  let fileName = `allForm${yesterdayDay}${yesterdayMonth}${yesterdayYear}.json`;

  fs.writeFile(fileName, JSON.stringify(req.body), function (err) {
    if (err) {
      res.sendStatus(500);
      next(err);
    } else {
      uploadFile(fileName, fileName);
      res.sendStatus(200);
    }
  });
});

app.post("/allFormtodaysFixtures", (req, res, next) => {
  console.log("post request called");
  let fileName = `allForm${day}${month}${year}.json`;

  fs.writeFile(fileName, JSON.stringify(req.body), function (err) {
    if (err) {
      res.sendStatus(500);
      next(err);
    } else {
      uploadFile(fileName, fileName);
      res.sendStatus(200);
    }
  });
});

app.post("/allFormtomorrowsFixtures", (req, res, next) => {
  console.log("post request called");
  let fileName = `allForm${tomorrowDay}${tomorrowMonth}${tomorrowYear}.json`;

  fs.writeFile(fileName, JSON.stringify(req.body), function (err) {
    if (err) {
      res.sendStatus(500);
      next(err);
    } else {
      uploadFile(fileName, fileName);
      res.sendStatus(200);
    }
  });
});

app.get("/formyesterdaysFixtures", async (req, res, next) => {
  let filePath = `allForm${yesterdayDay}${yesterdayMonth}${yesterdayYear}.json`;
  let params = {
    Bucket: "predictorfiles",
    Key: filePath,
  };

  // if todays' form is requested, get it from s3
  s3.getObject(params, (err, data) => {
    if (err) {
      console.error(err);
      fs.access(filePath, fs.constants.F_OK | fs.constants.W_OK, (err) => {
        if (err) {
          res.sendStatus(404);
          next(err);
        } else {
          console.log(
            "returning yesterdays form from local storage - not found in s3"
          );
          // if it does exist in the local file system, fetch it from there and return it to the client
          fs.readFile(filePath, function (err, data) {
            if (err) {
              res.sendStatus(500);
              next(err);
            } else {
              const form = JSON.parse(data);
              res.send(form);
            }
          });
        }
      });
    } else {
      console.log("sending s3 data for todays form");
      let objectData = data.Body.toString("utf-8");
      res.send(objectData);
    }
  });
});

app.get("/formtodaysFixtures", async (req, res, next) => {
  let filePath = `allForm${day}${month}${year}.json`;
  let params = {
    Bucket: "predictorfiles",
    Key: filePath,
  };

  // if todays' form is requested, get it from s3
  s3.getObject(params, (err, data) => {
    if (err) {
      console.error(err);
      fs.access(filePath, fs.constants.F_OK | fs.constants.W_OK, (err) => {
        if (err) {
          res.sendStatus(404);
          next(err);
        } else {
          console.log(
            "returning todays form from local storage - not found in s3"
          );
          // if it does exist in the local file system, fetch it from there and return it to the client
          fs.readFile(filePath, function (err, data) {
            if (err) {
              res.sendStatus(500);
              next(err);
            } else {
              const form = JSON.parse(data);
              res.send(form);
            }
          });
        }
      });
    } else {
      console.log("sending s3 data for todays form");
      let objectData = data.Body.toString("utf-8");
      res.send(objectData);
    }
  });
});

app.get("/formtomorrowsFixtures", async (req, res, next) => {
  let filePath = `allForm${tomorrowDay}${tomorrowMonth}${tomorrowYear}.json`;
  let params = {
    Bucket: "predictorfiles",
    Key: filePath,
  };

  // if todays' form is requested, get it from s3
  s3.getObject(params, (err, data) => {
    if (err) {
      console.error(err);
      fs.access(filePath, fs.constants.F_OK | fs.constants.W_OK, (err) => {
        if (err) {
          res.sendStatus(404);
          next(err);
        } else {
          console.log(
            "returning tomorrows form from local storage - not found in s3"
          );
          // if it does exist in the local file system, fetch it from there and return it to the client
          fs.readFile(filePath, function (err, data) {
            if (err) {
              res.sendStatus(500);
              next(err);
            } else {
              const form = JSON.parse(data);
              res.send(form);
            }
          });
        }
      });
    } else {
      console.log("sending s3 data for todays form");
      let objectData = data.Body.toString("utf-8");
      res.send(objectData);
    }
  });
});

app.get("/yesterdaysFixturesPredictions5", (req, res) => {
  let filePath = "fixedPredictions5yesterday.json";
  let params = {
    Bucket: "predictorfiles",
    Key: "fixedPredictions5yesterday.json",
  };
  // if todays' form is requested, get it from s3
  s3.getObject(params, (err, data) => {
    if (err) {
      console.error(err);
      fs.access(filePath, fs.constants.F_OK | fs.constants.W_OK, (err) => {
        if (err) {
          console.error(
            `${filePath} ${
              err.code === "ENOENT" ? "does not exist" : "is read-only"
            }`
          );
          res.sendStatus(404);
        } else {
          console.log(
            "returning yesterdays predictions 5 from local storage - not found in s3"
          );
          // if it does exist in the local file system, fetch it from there and return it to the client
          fs.readFile(filePath, function (err, data) {
            if (err) {
              console.error(err);
              res.sendStatus(404);
            } else {
              const predictions = JSON.parse(data);
              res.send(predictions);
            }
          });
        }
      });
    } else {
      console.log("sending s3 data for yesterdays predictions 5");
      let objectData = data.Body.toString("utf-8");
      res.send(objectData);
    }
  });
});

app.get("/yesterdaysFixturesPredictions6", (req, res) => {
  let filePath = "fixedPredictions6yesterday.json";
  let params = {
    Bucket: "predictorfiles",
    Key: "fixedPredictions6yesterday.json",
  };
  // if todays' form is requested, get it from s3
  s3.getObject(params, (err, data) => {
    if (err) {
      console.error(err);
      fs.access(filePath, fs.constants.F_OK | fs.constants.W_OK, (err) => {
        if (err) {
          console.error(
            `${filePath} ${
              err.code === "ENOENT" ? "does not exist" : "is read-only"
            }`
          );
          res.sendStatus(404);
        } else {
          console.log(
            "returning yesterdays predictions 6 from local storage - not found in s3"
          );
          // if it does exist in the local file system, fetch it from there and return it to the client
          fs.readFile(filePath, function (err, data) {
            if (err) {
              console.error(err);
              res.sendStatus(404);
            } else {
              const predictions = JSON.parse(data);
              res.send(predictions);
            }
          });
        }
      });
    } else {
      console.log("sending s3 data for yesterdays predictions 6");
      let objectData = data.Body.toString("utf-8");
      res.send(objectData);
    }
  });
});

app.get("/yesterdaysFixturesPredictions10", (req, res) => {
  let filePath = "fixedPredictions10yesterday.json";
  let params = {
    Bucket: "predictorfiles",
    Key: "fixedPredictions10yesterday.json",
  };
  // if todays' form is requested, get it from s3
  s3.getObject(params, (err, data) => {
    if (err) {
      console.error(err);
      fs.access(filePath, fs.constants.F_OK | fs.constants.W_OK, (err) => {
        if (err) {
          console.error(
            `${filePath} ${
              err.code === "ENOENT" ? "does not exist" : "is read-only"
            }`
          );
          res.sendStatus(404);
        } else {
          console.log(
            "returning yesterdays predictions 10 from local storage - not found in s3"
          );
          // if it does exist in the local file system, fetch it from there and return it to the client
          fs.readFile(filePath, function (err, data) {
            if (err) {
              console.error(err);
              res.sendStatus(404);
            } else {
              const predictions = JSON.parse(data);
              res.send(predictions);
            }
          });
        }
      });
    } else {
      console.log("sending s3 data for yesterdays predictions 10");
      let objectData = data.Body.toString("utf-8");
      res.send(objectData);
    }
  });
});

app.get("/todaysFixturesPredictions5", (req, res) => {
  let filePath = "fixedPredictions5today.json";
  let params = {
    Bucket: "predictorfiles",
    Key: "fixedPredictions5today.json",
  };
  // if todays' form is requested, get it from s3
  s3.getObject(params, (err, data) => {
    if (err) {
      console.error(err);
      fs.access(filePath, fs.constants.F_OK | fs.constants.W_OK, (err) => {
        if (err) {
          console.error(
            `${filePath} ${
              err.code === "ENOENT" ? "does not exist" : "is read-only"
            }`
          );
          res.sendStatus(404);
        } else {
          console.log(
            "returning todays predictions 5 from local storage - not found in s3"
          );
          // if it does exist in the local file system, fetch it from there and return it to the client
          fs.readFile(filePath, function (err, data) {
            if (err) {
              console.error(err);
              res.sendStatus(404);
            } else {
              const predictions = JSON.parse(data);
              res.send(predictions);
            }
          });
        }
      });
    } else {
      console.log("sending s3 data for todays predictions 5");
      let objectData = data.Body.toString("utf-8");
      res.send(objectData);
    }
  });
});

app.get("/todaysFixturesPredictions6", (req, res) => {
  let filePath = "fixedPredictions6today.json";
  let params = {
    Bucket: "predictorfiles",
    Key: "fixedPredictions6today.json",
  };
  // if todays' form is requested, get it from s3
  s3.getObject(params, (err, data) => {
    if (err) {
      console.error(err);
      fs.access(filePath, fs.constants.F_OK | fs.constants.W_OK, (err) => {
        if (err) {
          console.error(
            `${filePath} ${
              err.code === "ENOENT" ? "does not exist" : "is read-only"
            }`
          );
          res.sendStatus(404);
        } else {
          console.log(
            "returning todays predictions 6 from local storage - not found in s3"
          );
          // if it does exist in the local file system, fetch it from there and return it to the client
          fs.readFile(filePath, function (err, data) {
            if (err) {
              console.error(err);
              res.sendStatus(404);
            } else {
              const predictions = JSON.parse(data);
              res.send(predictions);
            }
          });
        }
      });
    } else {
      console.log("sending s3 data for todays predictions 6");
      let objectData = data.Body.toString("utf-8");
      res.send(objectData);
    }
  });
});

app.get("/todaysFixturesPredictions10", (req, res) => {
  let filePath = "fixedPredictions10today.json";
  let params = {
    Bucket: "predictorfiles",
    Key: "fixedPredictions10today.json",
  };
  // if todays' form is requested, get it from s3
  s3.getObject(params, (err, data) => {
    if (err) {
      console.error(err);
      fs.access(filePath, fs.constants.F_OK | fs.constants.W_OK, (err) => {
        if (err) {
          console.error(
            `${filePath} ${
              err.code === "ENOENT" ? "does not exist" : "is read-only"
            }`
          );
          res.sendStatus(404);
        } else {
          console.log(
            "returning todays predictions 10 from local storage - not found in s3"
          );
          // if it does exist in the local file system, fetch it from there and return it to the client
          fs.readFile(filePath, function (err, data) {
            if (err) {
              console.error(err);
              res.sendStatus(404);
            } else {
              const predictions = JSON.parse(data);
              res.send(predictions);
            }
          });
        }
      });
    } else {
      console.log("sending s3 data for todays predictions 10");
      let objectData = data.Body.toString("utf-8");
      res.send(objectData);
    }
  });
});

app.get("/tomorrowsFixturesPredictions5", (req, res) => {
  let filePath = "fixedPredictions5tomorrow.json";
  let params = {
    Bucket: "predictorfiles",
    Key: "fixedPredictions5tomorrowjson",
  };
  // if todays' form is requested, get it from s3
  s3.getObject(params, (err, data) => {
    if (err) {
      console.error(err);
      fs.access(filePath, fs.constants.F_OK | fs.constants.W_OK, (err) => {
        if (err) {
          console.error(
            `${filePath} ${
              err.code === "ENOENT" ? "does not exist" : "is read-only"
            }`
          );
          res.sendStatus(404);
        } else {
          console.log(
            "returning tomorrows predictions 5 from local storage - not found in s3"
          );
          // if it does exist in the local file system, fetch it from there and return it to the client
          fs.readFile(filePath, function (err, data) {
            if (err) {
              console.error(err);
              res.sendStatus(404);
            } else {
              const predictions = JSON.parse(data);
              res.send(predictions);
            }
          });
        }
      });
    } else {
      console.log("sending s3 data for tomorrows predictions 5");
      let objectData = data.Body.toString("utf-8");
      res.send(objectData);
    }
  });
});

app.get("/tomorrowsFixturesPredictions6", (req, res) => {
  let filePath = "fixedPredictions6tomorrow.json";
  let params = {
    Bucket: "predictorfiles",
    Key: "fixedPredictions6tomorrowjson",
  };
  // if todays' form is requested, get it from s3
  s3.getObject(params, (err, data) => {
    if (err) {
      console.error(err);
      fs.access(filePath, fs.constants.F_OK | fs.constants.W_OK, (err) => {
        if (err) {
          console.error(
            `${filePath} ${
              err.code === "ENOENT" ? "does not exist" : "is read-only"
            }`
          );
          res.sendStatus(404);
        } else {
          console.log(
            "returning tomorrows predictions 6 from local storage - not found in s3"
          );
          // if it does exist in the local file system, fetch it from there and return it to the client
          fs.readFile(filePath, function (err, data) {
            if (err) {
              console.error(err);
              res.sendStatus(404);
            } else {
              const predictions = JSON.parse(data);
              res.send(predictions);
            }
          });
        }
      });
    } else {
      console.log("sending s3 data for tomorrows predictions 6");
      let objectData = data.Body.toString("utf-8");
      res.send(objectData);
    }
  });
});

app.get("/tomorrowsFixturesPredictions10", (req, res) => {
  let filePath = "fixedPredictions10tomorrow.json";
  let params = {
    Bucket: "predictorfiles",
    Key: "fixedPredictions10tomorrowjson",
  };
  // if todays' form is requested, get it from s3
  s3.getObject(params, (err, data) => {
    if (err) {
      console.error(err);
      fs.access(filePath, fs.constants.F_OK | fs.constants.W_OK, (err) => {
        if (err) {
          console.error(
            `${filePath} ${
              err.code === "ENOENT" ? "does not exist" : "is read-only"
            }`
          );
          res.sendStatus(404);
        } else {
          console.log(
            "returning tomorrows predictions 10 from local storage - not found in s3"
          );
          // if it does exist in the local file system, fetch it from there and return it to the client
          fs.readFile(filePath, function (err, data) {
            if (err) {
              console.error(err);
              res.sendStatus(404);
            } else {
              const predictions = JSON.parse(data);
              res.send(predictions);
            }
          });
        }
      });
    } else {
      console.log("sending s3 data for tomorrows predictions 10");
      let objectData = data.Body.toString("utf-8");
      res.send(objectData);
    }
  });
});

// async function getFixtureList(day, string) {
//   await fetch(`https://safe-caverns-99679.herokuapp.com/${day}`
//     .then((res) => res.json())
//     .then((res) =>
//       fs.writeFile(`${string}.json`, JSON.stringify(res.data), function (err) {
//         console.log(`file ${string} written`);

//         if (err) return console.log(err);
//       })
//     )
//     .catch((err) => console.log(err));
// }

const deleteYesterdaysForm = schedule.scheduleJob(
  "45 59 23 * * *",
  async function () {
    var OLD_KEY = "allFormyesterdaysFixtures.json";
    var BUCKET_NAME = "predictorfiles";

    // Delete the old object
    s3.deleteObject({
      Bucket: BUCKET_NAME,
      Key: OLD_KEY,
    })
      .promise()

      // Error handling is left up to reader
      .catch((e) => console.error(e));
  }
);

const renameTodaysForm = schedule.scheduleJob(
  "00 00 00 * * *",
  async function () {
    var OLD_KEY = "allFormtodaysFixtures.json";
    var NEW_KEY = "allFormyesterdaysFixtures.json";
    var BUCKET_NAME = "predictorfiles";

    // Copy the object to a new location
    s3.copyObject({
      Bucket: BUCKET_NAME,
      CopySource: `${BUCKET_NAME}/${OLD_KEY}`,
      Key: NEW_KEY,
    })
      .promise()
      .then(() =>
        // Delete the old object
        s3
          .deleteObject({
            Bucket: BUCKET_NAME,
            Key: OLD_KEY,
          })
          .promise()
      )
      // Error handling is left up to reader
      .catch((e) => console.error(e));
  }
);

const renameTomorrowsForm = schedule.scheduleJob(
  "10 00 00 * * *",
  async function () {
    var OLD_KEY = "allFormtomorrowsFixtures.json";
    var NEW_KEY = "allFormtodaysFixtures.json";
    var BUCKET_NAME = "predictorfiles";

    // Copy the object to a new location
    s3.copyObject({
      Bucket: BUCKET_NAME,
      CopySource: `${BUCKET_NAME}/${OLD_KEY}`,
      Key: NEW_KEY,
    })
      .promise()
      .then(() =>
        // Delete the old object
        s3
          .deleteObject({
            Bucket: BUCKET_NAME,
            Key: OLD_KEY,
          })
          .promise()
      )
      // Error handling is left up to reader
      .catch((e) => console.error(e));
  }
);

const deleteYesterdays5Predictions = schedule.scheduleJob(
  "20 00 00 * * *",
  async function () {
    var OLD_KEY = "fixedPredictions5yesterday.json";
    var BUCKET_NAME = "predictorfiles";
    // Delete the old object
    s3.deleteObject({
      Bucket: BUCKET_NAME,
      Key: OLD_KEY,
    })
      .promise()
      // Error handling is left up to reader
      .catch((e) => console.error(e));
  }
);

const deleteYesterdays6Predictions = schedule.scheduleJob(
  "30 00 00 * * *",
  async function () {
    var OLD_KEY = "fixedPredictions6yesterday.json";
    var BUCKET_NAME = "predictorfiles";
    // Delete the old object
    s3.deleteObject({
      Bucket: BUCKET_NAME,
      Key: OLD_KEY,
    })
      .promise()
      // Error handling is left up to reader
      .catch((e) => console.error(e));
  }
);

const deleteYesterdays10Predictions = schedule.scheduleJob(
  "40 00 00 * * *",
  async function () {
    var OLD_KEY = "fixedPredictions10yesterday.json";
    var BUCKET_NAME = "predictorfiles";
    // Delete the old object
    s3.deleteObject({
      Bucket: BUCKET_NAME,
      Key: OLD_KEY,
    })
      .promise()
      // Error handling is left up to reader
      .catch((e) => console.error(e));
  }
);

const renameTodays5Predictions = schedule.scheduleJob(
  "50 00 00 * * *",
  async function () {
    var OLD_KEY = "fixedPredictions5today.json";
    var NEW_KEY = "fixedPredictions5yesterday.json";
    var BUCKET_NAME = "predictorfiles";

    // Copy the object to a new location
    s3.copyObject({
      Bucket: BUCKET_NAME,
      CopySource: `${BUCKET_NAME}/${OLD_KEY}`,
      Key: NEW_KEY,
    })
      .promise()
      .then(() =>
        // Delete the old object
        s3
          .deleteObject({
            Bucket: BUCKET_NAME,
            Key: OLD_KEY,
          })
          .promise()
      )
      // Error handling is left up to reader
      .catch((e) => console.error(e));
  }
);

const renameTodays6Predictions = schedule.scheduleJob(
  "00 01 00 * * *",
  async function () {
    var OLD_KEY = "fixedPredictions6today.json";
    var NEW_KEY = "fixedPredictions6yesterday.json";
    var BUCKET_NAME = "predictorfiles";

    // Copy the object to a new location
    s3.copyObject({
      Bucket: BUCKET_NAME,
      CopySource: `${BUCKET_NAME}/${OLD_KEY}`,
      Key: NEW_KEY,
    })
      .promise()
      .then(() =>
        // Delete the old object
        s3
          .deleteObject({
            Bucket: BUCKET_NAME,
            Key: OLD_KEY,
          })
          .promise()
      )
      // Error handling is left up to reader
      .catch((e) => console.error(e));
  }
);

const renameTodays10Predictions = schedule.scheduleJob(
  "10 01 00 * * *",
  async function () {
    var OLD_KEY = "fixedPredictions10today.json";
    var NEW_KEY = "fixedPredictions10yesterday.json";
    var BUCKET_NAME = "predictorfiles";

    // Copy the object to a new location
    s3.copyObject({
      Bucket: BUCKET_NAME,
      CopySource: `${BUCKET_NAME}/${OLD_KEY}`,
      Key: NEW_KEY,
    })
      .promise()
      .then(() =>
        // Delete the old object
        s3
          .deleteObject({
            Bucket: BUCKET_NAME,
            Key: OLD_KEY,
          })
          .promise()
      )
      // Error handling is left up to reader
      .catch((e) => console.error(e));
  }
);

const renameTomorrows5Predictions = schedule.scheduleJob(
  "20 01 00 * * *",
  async function () {
    var OLD_KEY = "fixedPredictions5tomorrow.json";
    var NEW_KEY = "fixedPredictions5today.json";
    var BUCKET_NAME = "predictorfiles";

    // Copy the object to a new location
    s3.copyObject({
      Bucket: BUCKET_NAME,
      CopySource: `${BUCKET_NAME}/${OLD_KEY}`,
      Key: NEW_KEY,
    })
      .promise()
      .then(() =>
        // Delete the old object
        s3
          .deleteObject({
            Bucket: BUCKET_NAME,
            Key: OLD_KEY,
          })
          .promise()
      )
      // Error handling is left up to reader
      .catch((e) => console.error(e));
  }
);

const renameTomorrows6Predictions = schedule.scheduleJob(
  "30 01 00 * * *",
  async function () {
    var OLD_KEY = "fixedPredictions6tomorrow.json";
    var NEW_KEY = "fixedPredictions6today.json";
    var BUCKET_NAME = "predictorfiles";

    // Copy the object to a new location
    s3.copyObject({
      Bucket: BUCKET_NAME,
      CopySource: `${BUCKET_NAME}/${OLD_KEY}`,
      Key: NEW_KEY,
    })
      .promise()
      .then(() =>
        // Delete the old object
        s3
          .deleteObject({
            Bucket: BUCKET_NAME,
            Key: OLD_KEY,
          })
          .promise()
      )
      // Error handling is left up to reader
      .catch((e) => console.error(e));
  }
);

const renameTomorrows10Predictions = schedule.scheduleJob(
  "40 01 00 * * *",
  async function () {
    var OLD_KEY = "fixedPredictions10tomorrow.json";
    var NEW_KEY = "fixedPredictions10today.json";
    var BUCKET_NAME = "predictorfiles";

    // Copy the object to a new location
    s3.copyObject({
      Bucket: BUCKET_NAME,
      CopySource: `${BUCKET_NAME}/${OLD_KEY}`,
      Key: NEW_KEY,
    })
      .promise()
      .then(() =>
        // Delete the old object
        s3
          .deleteObject({
            Bucket: BUCKET_NAME,
            Key: OLD_KEY,
          })
          .promise()
      )
      // Error handling is left up to reader
      .catch((e) => console.error(e));
  }
);
