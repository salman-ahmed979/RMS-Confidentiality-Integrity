const jwt = require("jsonwebtoken");

const createToken = (credential) => {
  return jwt.sign(credential, process.env.SECRETKEY);
};

const validateToken = (req, res, next) => {
  console.log("in here");
  let accessToken = req.cookies.authToken;
  console.log(accessToken);
  if (!accessToken) {
    console.log("No cookies");
    return res
      .status(200)
      .json({ message: "Authentication Denied", status: "failed" });
  }
  try {
    const validToken = jwt.verify(accessToken, process.env.SECRETKEY);
    if (validToken) {
      console.log(validToken);
      req.userName = validToken;
      console.log(req.userName);
      return next();
    }
  } catch (err) {
    return res
      .status(400)
      .json({ message: "Authentication Failed", status: "failed" });
  }
};

module.exports = { createToken, validateToken };
