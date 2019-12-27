const db = require("./connection");

const createDb = () => {
  db.query(
    `create database if not exists ${process.env.DB_NAME}`,
    (err, results) => {
      console.log(err);
      console.log(results);
    }
  );
};
const createTables = () => {
  const tables = [];
  const users = `create table if not exists users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  login VARCHAR(64),
  password VARCHAR(255))`;
  tables.push(users);

  const completegames = `create table if not exists complete_games (
  id INT AUTO_INCREMENT PRIMARY KEY, 
  user_id INT,
  difficulty TINYINT,
  moves TINYINT,
  elapsed_time TIME,
  FOREIGN KEY(user_id) REFERENCES users (id))`;
  tables.push(completegames);

  const currentgames = `create table if not exists current_games (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  difficulty TINYINT,
  moves TINYINT,
  elapsed_time TIME,
  FOREIGN KEY(user_id) REFERENCES users (id))`;
  tables.push(currentgames);

  const records = `create table if not exists records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  difficulty TINYINT,
  moves TINYINT,
  elapsed_time TIME,
  FOREIGN KEY(user_id) REFERENCES users (id))`;
  tables.push(records);

  tables.forEach(table => {
    db.query(table, (err, results) => {
      if (err) console.error(err);
      else {
        console.log(results);
      }
    });
  });
};

const seed = () => {
  db.connect(err => {
    if (err) console.error(err);
    else {
      createDb();
      db.query(`use ${process.env.DB_NAME}`);
      createTables();
    }
  });
};

module.exports = seed;
