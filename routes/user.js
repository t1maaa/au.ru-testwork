const express = require("express");
const auth = require("./../utils/auth");
const authenticate = require("./../middleware/authenticate");
const router = express.Router();
//const bodyParser = require("body-parser");

router.post("/user/new", async (req, res) => {
  let result = await auth.registration(req.body.login, req.body.password);
  res.send(result);
});

router.post("/user/login", async (req, res) => {
  let result = await auth.findByCredentials(req.body.login, req.body.password);
  res.send(result);
});

router.get("/user", [authenticate], async (req, res) => {
  res.send(`${res.locals.login}'s profile`);
});

module.exports = router;
