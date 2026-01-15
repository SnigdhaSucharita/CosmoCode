const jwt = require("jsonwebtoken");

function requireAuthPage(req, res, next) {
  const token = req.cookies?.access;
  if (!token) return res.redirect("/login");

  try {
    req.user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    next();
  } catch {
    return res.redirect("/login");
  }
}

module.exports = { requireAuthPage };
