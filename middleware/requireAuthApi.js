const { User } = require("../models");
const { verifyAccessToken } = require("../utils/jwt.utils");

async function requireAuthApi(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyAccessToken(token);

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
