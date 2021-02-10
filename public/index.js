var express = require("express");
var app = express();
const port = process.env.PORT || 5000;
var fs = require("fs");
var path = require("path");
var cors = require("cors");
const fetch = require("node-fetch");
var schedule = require("node-schedule");
var bodyParser = require("body-parser");
const { response } = require("express");
// require("dotenv").config();

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

const yesterday = `https://api.footystats.org/todays-matches?key=${process.env.REACT_APP_API_KEY}&date=${yesterdayYear}-${yesterdayDay}-${yesterdayMonth}`;
const today = `https://api.footystats.org/todays-matches?key=${process.env.REACT_APP_API_KEY}&date=${year}-${day}-${month}`;
const tomorrow = `https://api.footystats.org/todays-matches?key=${process.env.REACT_APP_API_KEY}&date=${tomorrowYear}-${tomorrowDay}-${tomorrowMonth}`;

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/static", express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public", "css")));
app.use(bodyParser.json());

app.listen(process.env.PORT || 5000);
// console.log(`listening on port ${port}`);



app.get("/todaysFixtures", (req, res) => {
  fs.readFile("today.json", function (err, data) {
    if (err) return console.log(err);
    const fixtures = JSON.parse(data);
    res.send({ fixtures });
  });
})

app.get("/tomorrowsFixtures", (req, res) => {
    fs.readFile("tomorrow.json", function (err, data) {
      if (err) return console.log(err);
      const fixtures = JSON.parse(data);
      res.send({ fixtures });
    });
  })


app.get("yesterdaysFixtures", (req, res) => {
    fs.readFile("yesterday.json", function (err, data) {
        if(err) return console.log(err);
        const fixtures = JSON.parse(data);
        res.semd({fixtures})
    })
})


async function getFixtureList(day, string) {
    await fetch(`https://safe-caverns-99679.herokuapp.com/${day}`, {
      headers: {
        "Content-Type": "application/json",
        Origin: "https://gregdorward.github.io",
        Host: "safe-caverns-99679.herokuapp.com",
      },
    })
      .then((res) => res.json())
      .then((res) => fs.writeFile(`${string}.json`, JSON.stringify(res.data), function (err) {
          if (err) return console.log(err);
        }))
      .catch(err => console.log(err))
  }


const rule = new schedule.RecurrenceRule();
rule.hour = [new schedule.Range(00, 12)]
rule.minute = 00;

const job = schedule.scheduleJob(rule, async function(){
    await getFixtureList(today, "today");
    await getFixtureList(tomorrow, "tomorrow");
    console.log("automatically fetched today's games");
    console.log("automatically fetched tomorrow's games");
  });


const job2 = schedule.scheduleJob("59 23 * * *", async function () {
    fs.rename('today.json', 'yesterday.json', (err) => {
        if (err) throw err;
        console.log('Rename complete!');
      });
});






