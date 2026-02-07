const { User } = require("../models");
const { verifyAccessToken } = require("../utils/jwt.utils");

async function extractUser(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const payload = verifyAccessToken(token);
    const user = await User.findByPk(payload.userId, {
      attributes: { exclude: ["passwordHash"] },
    });
    req.user = user;
  } catch (err) {
    req.user = null;
  }

  next();
}

module.exports = { extractUser };
