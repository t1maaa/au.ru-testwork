const express = require("express");
const path = require('path');
const router = express.Router();

router.get("/game/new", (req, res) => {
  console.log("start new game");
  res.sendFile(path.join(__dirname + "/../public/html/game.html"));
});

router.post("/game/answer", (req, res) => {
  console.log("answer has been sended to here");
});

module.exports = router;
