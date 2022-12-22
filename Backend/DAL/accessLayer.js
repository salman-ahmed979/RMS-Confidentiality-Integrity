const db = require("../model/model");
const crypto = require("crypto");
const userSignup = (userName, password, email, res) => {
  db.query(
    "SELECT username FROM users WHERE username = ?",
    [userName],
    (err, result) => {
      if (err)
        return res.status(404).json({ message: "signup Failed", status: "failed" });

      if (result.length > 0)
        return res
          .status(400)
          .json({ message: "User Already Exist", status: "failed" });
      else {
        db.query(
          "INSERT INTO users(username, upassword, email) VALUES(?,?,?)",
          [userName, password, email],
          (err, result) => {
            if (err) {
              return res
                .status(400)
                .json({ message: "signup Failed", status: "failed" });
            } else {
              return res
                .status(201)
                .json({ message: "Signup Successful", status: "success" });
            }
          }
        );
      }
    }
  );
};

const userLogin = (userName, password) => {
  db.query(
    "SELECT * FROM users WHERE username = ?",
    [userName],
    (err, result) => {
      if (err) return;
      if (result === 0) return "";
      else return result[0].upassword;
    }
  );
};

module.exports = { userSignup, userLogin };
