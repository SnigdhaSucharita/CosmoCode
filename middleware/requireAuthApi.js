const jwt = require("jsonwebtoken");
const { User } = require("../models");

async function requireAuthApi(req, res, next) {
  try {
    const token = req.cookies?.accessToken;
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(payload.userId, {
      attributes: { exclude: ["passwordHash"] },
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = { requireAuthApi };
