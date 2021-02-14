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

const apiKey = process.env.API_KEY;

console.log(process.env.NODE_ENV);

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

if (process.env.NODE_ENV === "production") {
  app.use(
    cors({
      origin: "https://gregdorward.github.io",
    })
  );
} else {
  app.use(
    cors({
      origin: "http://localhost:3000",
    })
  );
}

app.use(express.static(path.join(__dirname, "public")));
app.use("/static", express.static(path.join(__dirname, "public")));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

app.listen(process.env.PORT || 5000, function () {
  console.log(
    "Express server listening on port %d in %s mode",
    this.address().port,
    app.settings.env
  );
  console.log(apiKey);
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
  fs.writeFile(
    `fixedPredictions5today.json`,
    JSON.stringify(req.body),
    function (err) {
      if (err) return console.log(err);
    }
  );
  res.sendStatus(200);
});

app.post("/postPredictions5tomorrowsFixtures", (req, res) => {
  fs.writeFile(
    `fixedPredictions5tomorrow.json`,
    JSON.stringify(req.body),
    function (err) {
      if (err) return console.log(err);
    }
  );
  res.sendStatus(200);
});

app.post("/postPredictions6todaysFixtures", (req, res) => {
  fs.writeFile(
    `fixedPredictions6today.json`,
    JSON.stringify(req.body),
    function (err) {
      if (err) return console.log(err);
    }
  );
  res.sendStatus(200);
});

app.post("/postPredictions6tomorrowsFixtures", (req, res) => {
  fs.writeFile(
    `fixedPredictions6tomorrow.json`,
    JSON.stringify(req.body),
    function (err) {
      if (err) return console.log(err);
    }
  );
  res.sendStatus(200);
});

app.post("/postPredictions10todaysFixtures", (req, res) => {
  fs.writeFile(
    `fixedPredictions10today.json`,
    JSON.stringify(req.body),
    function (err) {
      if (err) return console.log(err);
    }
  );
  res.sendStatus(200);
});

app.post("/postPredictions10tomorrowsFixtures", (req, res) => {
  fs.writeFile(
    `fixedPredictions10tomorrow.json`,
    JSON.stringify(req.body),
    function (err) {
      if (err) return console.log(err);
    }
  );
  res.sendStatus(200);
});

app.post("/allForm", (req, res) => {
  fs.writeFile(`allForm.json`, JSON.stringify(req.body), function (err) {
    if (err) return console.log(err);
  });
  res.sendStatus(200);
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
        console.log(`file ${string} written`);

        if (err) return console.log(err);
      })
    )
    .catch((err) => console.log(err));
}

// const rule = new schedule.RecurrenceRule();
// rule.hour = 00;
// rule.minute = 01;

// const job = schedule.scheduleJob(rule, async function () {
//   await getFixtureList(today, "today");
//   await getFixtureList(tomorrow, "tomorrow");
//   console.log("automatically fetched today's games");
//   console.log("automatically fetched tomorrow's games");
// });

const renameTodays5Predictions = schedule.scheduleJob(
  "00 39 22 * * *",
  async function () {
    fs.rename(
      "fixedPredictions5today.json",
      "fixedPredictions5yesterday.json",
      (err) => {
        if (err) throw err;
        console.log("Rename 1 complete!");
      }
    );
  }
);

const renameTodays6Predictions = schedule.scheduleJob(
  "20 39 22 * * *",
  async function () {
    fs.rename(
      "fixedPredictions6today.json",
      "fixedPredictions6yesterday.json",
      (err) => {
        if (err) throw err;
        console.log("Rename 2 complete!");
      }
    );
  }
);

const renameTodays10Predictions = schedule.scheduleJob(
  "30 39 22 * * *",
  async function () {
    fs.rename(
      "fixedPredictions10today.json",
      "fixedPredictions10yesterday.json",
      (err) => {
        if (err) throw err;
        console.log("Rename 3 complete!");
      }
    );
  }
);

const renameTomorrows5Predictions = schedule.scheduleJob(
  "40 05 23 * * *",
  async function () {
    fs.open("fixedPredictions5tomorrow.json", "r", (err, fd) => {
      if (err) {
        if (err.code === "ENOENT") {
          console.error("myfile does not exist");
          return;
        }

        throw err;
      }

      console.log(fd);
    });
  }
);

const renameTomorrows5Predictions = schedule.scheduleJob(
  "40 39 22 * * *",
  async function () {
    fs.rename(
      "fixedPredictions5tomorrow.json",
      "fixedPredictions5today.json",
      (err) => {
        if (err) throw err;
        console.log("Rename 4 complete!");
      }
    );
  }
);

const renameTomorrows6Predictions = schedule.scheduleJob(
  "50 39 22 * * *",
  async function () {
    fs.rename(
      "fixedPredictions6tomorrow.json",
      "fixedPredictions6today.json",
      (err) => {
        if (err) throw err;
        console.log("Rename 5 complete!");
      }
    );
  }
);

const renameTomorrows10Predictions = schedule.scheduleJob(
  "00 40 22 * * *",
  async function () {
    fs.rename(
      "fixedPredictions10tomorrow.json",
      "fixedPredictions10today.json",
      (err) => {
        if (err) throw err;
        console.log("Rename 6 complete!");
      }
    );
  }
);

const writeTomorrowsPredictions = schedule.scheduleJob(
  "10 40 22 * * *",
  async function () {
    fs.writeFile(
      "fixedPredictions5tomorrow.json",
      '{"predictions":[]}',
      function (err) {
        console.log(`file fixedPredictions5tomorrow.json written`);
      }
    );
    fs.writeFile(
      "fixedPredictions6tomorrow.json",
      '{"predictions":[]}',
      function (err) {
        console.log(`file fixedPredictions6tomorrow.json written`);
      }
    );
    fs.writeFile(
      "fixedPredictions10tomorrow.json",
      '{"predictions":[]}',
      function (err) {
        console.log(`file fixedPredictions10tomorrow.json written`);
      }
    );
  }
);
