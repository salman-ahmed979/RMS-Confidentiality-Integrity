const bcrypt = require("bcrypt");
const db = require("../model/model");
const { userSignup } = require("../DAL/accessLayer");
const { createToken } = require("../middleware/JWT");
const cookieParser = require("cookie-parser");

const signUp = async (req, res) => {
  const { userName, password, email } = req.body;
  if (userName === "" || password === "" || email === "") {
    return res
      .status(404)
      .json({ message: "Invalid Parameter", status: "failed" });
  }

  const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
  const hashPassword = await bcrypt.hash(password, salt);

  userSignup(userName, hashPassword, email, res);
};

const logIn = (req, res) => {
  const { userName, password } = req.body;
  if (userName === "" || password === "") {
    res.json({ message: "Invalid Parameter" });
  }
  db.query(
    "SELECT * FROM users WHERE username = ?",
    [userName],
    (err, result) => {
      if (err)
        return res.status(404).json({ message: "Failed", status: "failed" });
      if (result === 0)
        return res.status(400).json({ message: "Failed", status: "failed" });
      else {
        const userPassword = result[0].upassword;
        const hashResult = bcrypt.compare(password, userPassword);
        if (!hashResult)
          return res
            .status(400)
            .json({ message: "Password Match Failed", status: "failed" });
        else {
          const accessToken = createToken(userName);
          res.cookie("authToken", accessToken, {
            maxAge: 1800000, //30 min
            httpOnly: true,
            secure: false,
          });
          return res
            .status(200)
            .json({ message: "Successful Login", status: "success" });
        }
      }
    }
  );
};

module.exports = { signUp, logIn };
