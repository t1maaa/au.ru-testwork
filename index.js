require("dotenv").config();
const express = require("express");
const db = require("./db/connection");
const app = express();
const seed = require("./db/seed");

app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
  seed();
});

