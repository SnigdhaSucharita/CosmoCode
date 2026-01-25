const { Session: sessionModel, User: userModel } = require("../models");
const { signAccessToken, signRefreshToken } = require("../utils/jwt.utils");
const { setRefreshTokenCookie } = require("../utils/cookie.utils");
const { hashToken } = require("../utils/token.utils");

async function refresh(req, res) {
  const token = req.cookies?.jid;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const tokenHash = hashToken(token);

  const session = await sessionModel.findOne({
    where: { refreshTokenHash: tokenHash },
  });

  if (!session || session.expiresAt < new Date()) {
    return res.status(401).json({ error: "Session expired" });
  }

  const user = await userModel.findByPk(session.userId);

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Rotate session
  await session.destroy();

  const newRefreshToken = signRefreshToken({
    userId: user.id,
    tokenVersion: user.tokenVersion,
  });

  const newSession = await sessionModel.create({
    userId: user.id,
    refreshTokenHash: hashToken(newRefreshToken),
    userAgent: req.headers["user-agent"],
    ipAddress: req.ip,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  const newAccessToken = signAccessToken({
    userId: user.id,
    sessionId: newSession.id,
    tokenVersion: user.tokenVersion,
  });

  setRefreshTokenCookie(res, newRefreshToken);

  return res.json({ accessToken: newAccessToken });
}

module.exports = { refresh };
