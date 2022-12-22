const validRole = (req, res, next) => {
  if (req.userName !== "admin") {
    res.status(200).json({ message: "Access Restricted", status: "failed" });
    return;
  }
  next();
};
module.exports = { validRole };
