const db = require("../db/connection");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const iteration = 10000;
const hashlen = 64;

const findByCredentials = async (login, password) => {
  return await db
    .promise()
    .query({
      sql: `select * from users where login = ?`,
      values: [db.escape(login)]
    })
    .then(rows => {
      let result = JSON.parse(
        JSON.stringify(rows[0])
          .replace(/"'/g, '"')
          .replace(/'"/g, '"')
      );

      let { passhash } = hashPassword(password, result[0].salt);

      if (passhash === result[0].passhash) {
        let token = generateToken(result[0].id);
        db.promise()
          .query({
            sql: `insert into tokens (user_id, token) values (?, ?)`,
            values: [result[0].id, token]
          })
          .catch(error => {
            console.log(error);
          });

        return {
          login: result[0].login,
          token: token,
          successful: true
        };
      } else {
        return {
          login: result[0].login,
          successful: false,
          error: `Wrong password!`
        };
      }
    })
    .catch(error => {
      console.log(error);
      return {
        login: login,
        successful: false,
        error: `Username "${login}" can't find`
      };
    });
};

const registration = async (login, password) => {
  let { passhash, salt } = hashPassword(password);
  return await db
    .promise()
    .query({
      // prettier-ignore
      sql: `insert into users (login, passhash, salt) values (?, ?, ?)`,
      values: [db.escape(login), db.escape(passhash), db.escape(salt)]
    })
    .then(() => {
      return {
        login: login,
        successful: true
      };
    })
    .catch(error => {
      console.log(error);
      return {
        login: login,
        successful: false,
        error: `Username ${login} already exist`
      };
    });
};

const hashPassword = (
  password,
  salt = crypto.randomBytes(16).toString("hex")
) => {
  let passhash = crypto
    .pbkdf2Sync(password, salt, iteration, hashlen, "sha512")
    .toString("hex");
  return { passhash, salt };
};

const generateToken = id => {
  return (toket = jwt.sign(
    {
      id: id
    },
    process.env.JWT_KEY,
    {
      expiresIn: "30 days"
    }
  ));
};

module.exports = {
  findByCredentials,
  registration
};
