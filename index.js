require("dotenv").config();
const express = require("express");
const db = require("./connection");
const app = express();

app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);

  db.connect(err => {
    if (err) {
      return console.error("DB FAIL:" + err.message);
    } else {
      console.log("DB OK");
    }
  });
});
