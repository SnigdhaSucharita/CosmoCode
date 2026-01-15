const jwt = require("jsonwebtoken");

function requireAuthApi(req, res, next) {
  const token = req.cookies?.access;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    req.user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

module.exports = { requireAuthApi };
