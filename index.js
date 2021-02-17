var express = require("express");
var app = express();
var fs = require("fs");
var path = require("path");
var cors = require("cors");
const fetch = require("node-fetch");
var schedule = require("node-schedule");
var bodyParser = require("body-parser");
const { response } = require("express");
const AWS = require("aws-sdk");

var whitelist = [
  "https://gregdorward@github.io/predictor",
  "http://localhost:3000",
];

var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(
  cors({
    origin: "https://gregdorward.github.io",
  })
);

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

// const port = process.env.PORT || 5000;

const apiKey = process.env.API_KEY;

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
});

app.get("/", function (req, res) {
  res.send("<h1>Hello World!</h1>");
});

app.get("/todaysFixtures", cors(corsOptions), (req, res) => {
  fs.readFile("today.json", function (err, data) {
    if (err) res.sendStatus(404);
    const fixtures = JSON.parse(data);
    res.send({ fixtures });
  });
});

app.get("/tomorrowsFixtures", cors(corsOptions), (req, res) => {
  fs.readFile("tomorrow.json", function (err, data) {
    if (err) res.sendStatus(404);
    const fixtures = JSON.parse(data);
    res.send({ fixtures });
  });
});

app.get("/yesterdaysFixtures", cors(corsOptions), (req, res) => {
  fs.readFile("yesterday.json", function (err, data) {
    if (err) res.sendStatus(404);
    const fixtures = JSON.parse(data);
    res.send({ fixtures });
  });
});

app.post("/postPredictions5todaysFixtures", cors(corsOptions), (req, res) => {
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
  cors(corsOptions),
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

app.post("/postPredictions6todaysFixtures", cors(corsOptions), (req, res) => {
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
  cors(corsOptions),
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

app.post("/postPredictions10todaysFixtures", cors(corsOptions), (req, res) => {
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

app.post(
  "/postPredictions10tomorrowsFixtures",
  cors(corsOptions),
  (req, res) => {
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
  }
);

app.post("/allFormyesterdaysFixtures", cors(corsOptions), (req, res) => {
  fs.writeFile(
    `allFormyesterdaysFixtures.json`,
    JSON.stringify(req.body),
    function (err) {
      if (err) {
        res.sendStatus(500);
        return console.log(err);
      } else {
        uploadFile(
          "allFormyesterdaysFixtures.json",
          "allFormyesterdaysFixtures.json"
        );
        res.sendStatus(200);
      }
    }
  );
});

app.post("/allFormtodaysFixtures", cors(corsOptions), (req, res) => {
  fs.writeFile(
    `allFormtodaysFixtures.json`,
    JSON.stringify(req.body),
    function (err) {
      if (err) {
        res.sendStatus(500);
        return console.log(err);
      } else {
        uploadFile("allFormtodaysFixtures.json", "allFormtodaysFixtures.json");
        res.sendStatus(200);
      }
    }
  );
});

app.post("/allFormtomorrowsFixtures", cors(corsOptions), (req, res) => {
  fs.writeFile(
    `allFormtomorrowsFixtures.json`,
    JSON.stringify(req.body),
    function (err) {
      if (err) {
        res.sendStatus(500);
        return console.log(err);
      } else {
        uploadFile(
          "allFormtomorrowsFixtures.json",
          "allFormtomorrowsFixtures.json"
        );
        res.sendStatus(200);
      }
    }
  );
});

app.get("/formyesterdaysFixtures", cors(corsOptions), async (req, res) => {
  const filePath = "allFormyesterdaysFixtures.json";
  const params = {
    Bucket: "predictorfiles",
    Key: filePath,
  };
  console.log("Function called");
  s3.getObject(params, (err, data) => {
    console.log("Getting S3 object");

    if (err) console.error(err);
    fs.writeFileSync(filePath, data.Body.toString());
    console.log(`${filePath} has been created!`);

    fs.access(filePath, fs.constants.F_OK | fs.constants.W_OK, (err) => {
      console.log("fs.access");

      if (err) {
        console.error(
          `${filePath} ${
            err.code === "ENOENT" ? "does not exist" : "is read-only"
          }`
        );
        res.sendStatus(404);
      } else {
        fs.readFile(filePath, function (err, data) {
          if (err) res.sendStatus(500);
          const form = JSON.parse(data);
          res.send({ form });
        });
      }
    });
  });
});

app.get("/formtodaysFixtures", cors(corsOptions), async (req, res) => {
  const filePath = "allFormtodaysFixtures.json";
  const params = {
    Bucket: "predictorfiles",
    Key: filePath,
  };
  s3.getObject(params, (err, data) => {
    if (err) console.error(err);
    fs.writeFileSync(filePath, data.Body.toString());
    console.log(`${filePath} has been created!`);

    fs.access(filePath, fs.constants.F_OK | fs.constants.W_OK, (err) => {
      if (err) {
        console.error(
          `${filePath} ${
            err.code === "ENOENT" ? "does not exist" : "is read-only"
          }`
        );
        res.sendStatus(404);
      } else {
        fs.readFile(filePath, function (err, data) {
          if (err) res.sendStatus(500);
          const form = JSON.parse(data);
          res.send({ form });
        });
      }
    });
  });
});

app.get("/formtomorrowFixtures", cors(corsOptions), async (req, res) => {
  const filePath = "allFormytomorrowsFixtures.json";
  const params = {
    Bucket: "predictorfiles",
    Key: filePath,
  };
  s3.getObject(params, (err, data) => {
    if (err) console.error(err);
    fs.writeFileSync(filePath, data.Body.toString());
    console.log(`${filePath} has been created!`);

    fs.access(filePath, fs.constants.F_OK | fs.constants.W_OK, (err) => {
      if (err) {
        console.error(
          `${filePath} ${
            err.code === "ENOENT" ? "does not exist" : "is read-only"
          }`
        );
        res.sendStatus(404);
      } else {
        fs.readFile(filePath, function (err, data) {
          if (err) res.sendStatus(500);
          const form = JSON.parse(data);
          res.send({ form });
        });
      }
    });
  });
});

app.get("/yesterdaysFixturesPredictions5", cors(corsOptions), (req, res) => {
  fs.access(
    "fixedPredictions5yesterday.json",
    fs.constants.F_OK | fs.constants.W_OK,
    (err) => {
      if (err) {
        console.error(
          `${"fixedPredictions5yesterday.json"} ${
            err.code === "ENOENT" ? "does not exist" : "is read-only"
          }`
        );
        res.sendStatus(404);
      } else {
        fs.readFile("fixedPredictions5yesterday.json", function (err, data) {
          if (err) res.sendStatus(500);
          const fixtures = JSON.parse(data);
          res.send({ fixtures });
        });
      }
    }
  );
});

app.get("/yesterdaysFixturesPredictions6", cors(corsOptions), (req, res) => {
  fs.access(
    "fixedPredictions6yesterday.json",
    fs.constants.F_OK | fs.constants.W_OK,
    (err) => {
      if (err) {
        console.error(
          `${"fixedPredictions6yesterday.json"} ${
            err.code === "ENOENT" ? "does not exist" : "is read-only"
          }`
        );
        res.sendStatus(404);
      } else {
        fs.readFile(
          "fixedPredictions6yesterday.json",
          cors(corsOptions),
          function (err, data) {
            if (err) res.sendStatus(500);
            const fixtures = JSON.parse(data);
            res.send({ fixtures });
          }
        );
      }
    }
  );
});

app.get("/yesterdaysFixturesPredictions10", cors(corsOptions), (req, res) => {
  fs.access(
    "fixedPredictions10yesterday.json",
    fs.constants.F_OK | fs.constants.W_OK,
    (err) => {
      if (err) {
        console.error(
          `${"fixedPredictions10yesterday.json"} ${
            err.code === "ENOENT" ? "does not exist" : "is read-only"
          }`
        );
        res.sendStatus(404);
      } else {
        fs.readFile(
          "fixedPredictions10yesterday.json",
          cors(corsOptions),
          function (err, data) {
            if (err) res.sendStatus(500);
            const fixtures = JSON.parse(data);
            res.send({ fixtures });
          }
        );
      }
    }
  );
});

app.get("/todaysFixturesPredictions5", cors(corsOptions), (req, res) => {
  fs.access(
    "fixedPredictions5today.json",
    fs.constants.F_OK | fs.constants.W_OK,
    (err) => {
      if (err) {
        console.error(
          `${"fixedPredictions5today.json"} ${
            err.code === "ENOENT" ? "does not exist" : "is read-only"
          }`
        );
        res.sendStatus(404);
      } else {
        fs.readFile("fixedPredictions5today.json", function (err, data) {
          if (err) res.sendStatus(500);
          const fixtures = JSON.parse(data);
          res.send({ fixtures });
        });
      }
    }
  );
});

app.get("/todaysFixturesPredictions6", cors(corsOptions), (req, res) => {
  fs.access(
    "fixedPredictions6today.json",
    fs.constants.F_OK | fs.constants.W_OK,
    (err) => {
      if (err) {
        console.error(
          `${"fixedPredictions6today.json"} ${
            err.code === "ENOENT" ? "does not exist" : "is read-only"
          }`
        );
        res.sendStatus(404);
      } else {
        fs.readFile("fixedPredictions6today.json", function (err, data) {
          if (err) res.sendStatus(500);
          const fixtures = JSON.parse(data);
          res.send({ fixtures });
        });
      }
    }
  );
});

app.get("/todaysFixturesPredictions10", cors(corsOptions), (req, res) => {
  fs.access(
    "fixedPredictions10today.json",
    fs.constants.F_OK | fs.constants.W_OK,
    (err) => {
      if (err) {
        console.error(
          `${"fixedPredictions10today.json"} ${
            err.code === "ENOENT" ? "does not exist" : "is read-only"
          }`
        );
        res.sendStatus(404);
      } else {
        fs.readFile("fixedPredictions10today.json", function (err, data) {
          if (err) res.sendStatus(500);
          const fixtures = JSON.parse(data);
          res.send({ fixtures });
        });
      }
    }
  );
});

app.get("/tomorrowsFixturesPredictions5", cors(corsOptions), (req, res) => {
  fs.access(
    "fixedPredictions5tomorrow.json",
    fs.constants.F_OK | fs.constants.W_OK,
    (err) => {
      if (err) {
        console.error(
          `${"fixedPredictions5tomorrow.json"} ${
            err.code === "ENOENT" ? "does not exist" : "is read-only"
          }`
        );
        res.sendStatus(404);
      } else {
        fs.readFile("fixedPredictions5tomorrow.json", function (err, data) {
          if (err) res.sendStatus(500);
          const fixtures = JSON.parse(data);
          res.send({ fixtures });
        });
      }
    }
  );
});

app.get("/tomorrowsFixturesPredictions6", cors(corsOptions), (req, res) => {
  fs.access(
    "fixedPredictions6tomorrow.json",
    fs.constants.F_OK | fs.constants.W_OK,
    (err) => {
      if (err) {
        console.error(
          `${"fixedPredictions6tomorrow.json"} ${
            err.code === "ENOENT" ? "does not exist" : "is read-only"
          }`
        );
        res.sendStatus(404);
      } else {
        fs.readFile("fixedPredictions6tomorrow.json", function (err, data) {
          if (err) res.sendStatus(500);
          const fixtures = JSON.parse(data);
          res.send({ fixtures });
        });
      }
    }
  );
});

app.get("/tomorrowsFixturesPredictions10", cors(corsOptions), (req, res) => {
  fs.access(
    "fixedPredictions10tomorrow.json",
    fs.constants.F_OK | fs.constants.W_OK,
    (err) => {
      if (err) {
        console.error(
          `${"fixedPredictions10tomorrow.json"} ${
            err.code === "ENOENT" ? "does not exist" : "is read-only"
          }`
        );
        res.sendStatus(404);
      } else {
        fs.readFile("fixedPredictions10tomorrow.json", function (err, data) {
          if (err) res.sendStatus(500);
          const fixtures = JSON.parse(data);
          res.send({ fixtures });
        });
      }
    }
  );
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
