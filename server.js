var mongoose = require("mongoose");
const { Schema } = mongoose;
require("dotenv").config();
const express = require("express");
var bodyParser = require("body-parser");
const cors = require("cors");
const dns = require("dns");
const app = express();
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use("/public", express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const urlSchema = new Schema({
  url: String,
});

const Url = mongoose.model("Url", urlSchema);

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

const options = {
  // Setting family as 6 i.e. IPv6
  family: 6,
  hints: dns.ADDRCONFIG | dns.V4MAPPED,
};

const findUrlByUrlName = (urlName, done) => {
  Url.find({ url: urlName }, (err, data) => {
    if (err) {
      return done(err);
    }
    return done(null, data);
  });
};

const findUrlByShortUrlId = (shortUrlId, done) => {
  Url.find({ _id: shortUrlId }, (err, data) => {
    if (err) {
      return done(err);
    }
    return done(null, data);
  });
};

app.post("/api/shorturl", function (req, res) {
  dns.lookup(req.body.url, options, (err, address, family) => {
    if (err) {
      res.json({ error: "invalid url" });
    } else {
      findUrlByUrlName(req.body.url.toLowerCase(), function (err, data) {
        if (data && data.length > 0) {
          res.json({ original_url: data[0].url, short_url: data[0]._id });
        } else {
          var newUrl = new Url({
            url: req.body.url.toLowerCase(),
          });

          newUrl.save((err, theData) => {
            if (err) {
              res.json({ error: "invalid url" });
              return null;
            } else {
              res.json({ original_url: theData.url, short_url: theData._id });
            }
          });
        }
      });
    }
  });
});

app.get("/api/shorturl/:shortUrlId", function (req, res) {
  if (!req.params.shortUrlId) {
    res.json({ error: "invalid url" });
  } else {
    findUrlByShortUrlId(req.params.shortUrlId, function (err, data) {
      if (err) {
        res.json({ error: "invalid url" });
      } else {
        res
          .writeHead(301, {
            Location: data.url,
          })
          .end();
      }
    });
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
