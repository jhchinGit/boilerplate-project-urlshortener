require("dotenv").config();
const express = require("express");
var bodyParser = require("body-parser");
const cors = require("cors");
// const lookup = require("dns-lookup");
const dns = require("dns");
const app = express();
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use("/public", express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({ extended: false }));

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

app.post("/api/shorturl", function (req, res) {
  dns.lookup(req.body.url, options, (err, address, family) =>
    console.log("address: %j family: IPv%s", address, family)
  );
  res.json({ url: req.body.url });

  // lookup('www.yandex.ru', function (err, address, family) {
  //   // Action goes here!
  // });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
