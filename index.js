require("dotenv").config();
const express = require("express");
const path = require("path");
const db = require("./db/connection");
const app = express();
const seed = require("./db/seed");
const userRoutes = require("./routes/user");
const gameRoutes = require("./routes/game");

app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
  seed();
});
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "/public")));

app.use("/", userRoutes);
app.use("/", gameRoutes);

app.use("/", (req, res) => {
  res.sendFile(__dirname + "/public/html/index.html");
});

app.use("*", (req, res) => {
  res.sendStatus(404);
});
