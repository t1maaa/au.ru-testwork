const jwt = require("jsonwebtoken");
const db = require("../db/connection");

const auth = async (req, res, next) => {
  let token = req.header("Authorization").replace("Bearer ", "");
  let data = jwt.verify(token, process.env.JWT_KEY);

  if (data.exp.toString() > Date.now().toString().slice(0, data.exp.length)) {
    let result = await db
      .promise()
      .query({
        sql: `select U.login, T.token from tokens T, users U where token = ? and T.user_id = U.id`,
        values: [token]
      })
      .then(rows => {
        let result = JSON.parse(
          JSON.stringify(rows[0])
            .replace(/"'/g, '"')
            .replace(/'"/g, '"')
        );
        res.locals.login = result[0].login;
        next();
      })
      .catch(error => {
        console.log(error);
        res.send({
          successful: false,
          error: "The token doesn't belong to any of our users."
        });
      });
  } else {
    res.send({
      successful: false,
      error: "Token is expired. Login again."
    });
  }
};

module.exports = auth;
