const jwt = require("jsonwebtoken");

function extractUser(req, res, next) {
  const token = req.cookies?.access;
  if (token) {
    req.user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  }
  next();
}

module.exports = { extractUser };
