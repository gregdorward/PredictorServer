var express = require("express");
var app = express();
var fs = require("fs");
var path = require("path");
var cors = require("cors");
const fetch = require("node-fetch");
var schedule = require("node-schedule");
var bodyParser = require("body-parser");
const { response } = require("express");
// const port = process.env.PORT || 5000;


const apiKey = process.env.API_KEY


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

const yesterday = `https://api.footystats.org/todays-matches?key=${apiKey}&date=${yesterdayYear}-${yesterdayDay}-${yesterdayMonth}`;
const today = `https://api.footystats.org/todays-matches?key=${apiKey}&date=${year}-${day}-${month}`;
const tomorrow = `https://api.footystats.org/todays-matches?key=${apiKey}&date=${tomorrowYear}-${tomorrowDay}-${tomorrowMonth}`;

app.use(
  cors({
    origin: "https://gregdorward.github.io/Predictor"
    })
);
app.use(express.static(path.join(__dirname, "public")));
app.use("/static", express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

app.listen(process.env.PORT || 5000, function () {
  console.log(
    "Express server listening on port %d in %s mode",
    this.address().port,
    app.settings.env
  );
  console.log(apiKey)
});

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
  var now = new Date();
  var hour = now.getHours();
  if (hour <= 17) {
    fs.writeFile(
      `fixedPredictions5today.json`,
      JSON.stringify(req.body),
      function (err) {
        if (err) return console.log(err);
      }
    );
    res.sendStatus(200)
  } else {
    res.sendStatus(400)
  }
});

app.post("/postPredictions5tomorrowsFixtures", (req, res) => {
  var now = new Date();
  var hour = now.getHours();
  if (hour <= 17) {
    fs.writeFile(
      `fixedPredictions5tomorrow.json`,
      JSON.stringify(req.body),
      function (err) {
        if (err) return console.log(err);
      }
    );
    res.sendStatus(200)
  } else {
    res.sendStatus(400)
  }
});

app.post("/postPredictions6todaysFixtures", (req, res) => {
  var now = new Date();
  var hour = now.getHours();
  if (hour <= 17) {
    fs.writeFile(
      `fixedPredictions6today.json`,
      JSON.stringify(req.body),
      function (err) {
        if (err) return console.log(err);
      }
    );
    res.sendStatus(200)
  } else {
    res.sendStatus(400)
  }
});

app.post("/postPredictions6tomorrowsFixtures", (req, res) => {
  var now = new Date();
  var hour = now.getHours();
  if (hour <= 17) {
    fs.writeFile(
      `fixedPredictions6tomorrow.json`,
      JSON.stringify(req.body),
      function (err) {
        if (err) return console.log(err);
      }
    );
    res.sendStatus(200)
  } else {
    res.sendStatus(400)
  }
});

app.post("/postPredictions10todaysFixtures", (req, res) => {
  var now = new Date();
  var hour = now.getHours();
  if (hour <= 17) {
    fs.writeFile(
      `fixedPredictions10today.json`,
      JSON.stringify(req.body),
      function (err) {
        if (err) return console.log(err);
      }
    );
    res.sendStatus(200)
  } else {
    res.sendStatus(400)
  }
});

app.post("/postPredictions10tomorrowsFixtures", (req, res) => {
  var now = new Date();
  var hour = now.getHours();
  if (hour <= 17) {
    fs.writeFile(
      `fixedPredictions10tomorrow.json`,
      JSON.stringify(req.body),
      function (err) {
        if (err) return console.log(err);
      }
    );
    res.sendStatus(200)
  } else {
    res.sendStatus(400)
  }
});

app.get("/yesterdaysFixturesPredictions5", (req, res) => {
  fs.readFile("fixedPredictions5yesterday.json", function (err, data) {
    if (err) res.sendStatus(404);
    const fixtures = JSON.parse(data);
    res.send({ fixtures });
  });
});

app.get("/yesterdaysFixturesPredictions6", (req, res) => {
  fs.readFile("fixedPredictions6yesterday.json", function (err, data) {
    if (err) res.sendStatus(404);
    const fixtures = JSON.parse(data);
    res.send({ fixtures });
  });
});

app.get("/yesterdaysFixturesPredictions10", (req, res) => {
  fs.readFile("fixedPredictions10yesterday.json", function (err, data) {
    if (err) res.sendStatus(404);
    const fixtures = JSON.parse(data);
    res.send({ fixtures });
  });
});


app.get("/todaysFixturesPredictions5", (req, res) => {
  fs.readFile("fixedPredictions5today.json", function (err, data) {
    if (err) res.sendStatus(404);
    const fixtures = JSON.parse(data);
    res.send({ fixtures });
  });
});

app.get("/todaysFixturesPredictions6", (req, res) => {
  fs.readFile("fixedPredictions6today.json", function (err, data) {
    if (err) res.sendStatus(404);
    const fixtures = JSON.parse(data);
    res.send({ fixtures });
  });
});

app.get("/todaysFixturesPredictions10", (req, res) => {
  fs.readFile("fixedPredictions10today.json", function (err, data) {
    if (err) res.sendStatus(404);
    const fixtures = JSON.parse(data);
    res.send({ fixtures });
  });
});


app.get("/tomorrowsFixturesPredictions5", (req, res) => {
  fs.readFile("fixedPredictions5tomorrow.json", function (err, data) {
    if (err) res.sendStatus(404);
    const fixtures = JSON.parse(data);
    res.send({ fixtures });
  });
});

app.get("/tomorrowsFixturesPredictions6", (req, res) => {
  fs.readFile("fixedPredictions6tomorrow.json", function (err, data) {
    if (err) res.sendStatus(404);
    const fixtures = JSON.parse(data);
    res.send({ fixtures });
  });
});

app.get("/tomorrowsFixturesPredictions10", (req, res) => {
  fs.readFile("fixedPredictions10tomorrow.json", function (err, data) {
    if (err) res.sendStatus(404);
    const fixtures = JSON.parse(data);
    res.send({ fixtures });
  });
});

async function getFixtureList(day, string) {
  await fetch(`https://safe-caverns-99679.herokuapp.com/${day}`, {
    headers: {
      "Content-Type": "application/json",
      Origin: "https://gregdorward.github.io",
      Host: "safe-caverns-99679.herokuapp.com",
    },
  })
    .then((res) => res.json())
    .then((res) =>
      fs.writeFile(`${string}.json`, JSON.stringify(res.data), function (err) {
        console.log(`file ${string} written`)

        if (err) return console.log(err);
      })
    )
    .catch((err) => console.log(err));
}

const rule = new schedule.RecurrenceRule();
rule.hour = [new schedule.Range(00, 12)];
rule.minute = 00;

const job = schedule.scheduleJob(rule, async function () {
  await getFixtureList(today, "today");
  await getFixtureList(tomorrow, "tomorrow");
  console.log("automatically fetched today's games");
  console.log("automatically fetched tomorrow's games");
});



const job2 = schedule.scheduleJob("59 23 * * *", async function () {
  fs.rename("today.json", "yesterday.json", (err) => {
    if (err) throw err;
    console.log("Rename 1 complete!");
  });

  fs.rename("tomorrow.json", "today.json", (err) => {
    if (err) throw err;
    console.log("Rename 2 complete!");
  });

  fs.rename("fixedPredictions5today", "fixedPredictions5yesterday.json", (err) => {
    if (err) throw err;
    console.log("Rename 3 complete!");
  });

  fs.rename("fixedPredictions6today", "fixedPredictions6yesterday.json", (err) => {
    if (err) throw err;
    console.log("Rename 4 complete!");
  });

  fs.rename("fixedPredictions10today", "fixedPredictions10yesterday.json", (err) => {
    if (err) throw err;
    console.log("Rename 5 complete!");
  });

  fs.rename("fixedPredictions5tomorrow", "fixedPredictions5today.json", (err) => {
    if (err) throw err;
    console.log("Rename 6 complete!");
  });

  fs.rename("fixedPredictions6tomorrow", "fixedPredictions6today.json", (err) => {
    if (err) throw err;
    console.log("Rename 7 complete!");
  });

  fs.rename("fixedPredictions10tomorrow", "fixedPredictions10today.json", (err) => {
    if (err) throw err;
    console.log("Rename 8 complete!");
  });

});
