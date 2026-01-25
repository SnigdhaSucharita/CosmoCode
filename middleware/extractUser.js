const jwt = require("jsonwebtoken");

function extractUser(req, res, next) {
  const token = req.cookies?.access;

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    req.user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    req.user = null;
  }

  next();
}

module.exports = extractUser;

