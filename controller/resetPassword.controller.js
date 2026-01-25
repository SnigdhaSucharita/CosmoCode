const { User: userModel, Session: sessionModel } = require("../models");
const { hashPassword } = require("../utils/password.utils");
const { hashToken } = require("../utils/token.utils");

async function resetPassword(req, res) {
  const { token, email, Password } = req.body;

  if (!token || !email || !Password) {
    return res.status(400).json({ error: "Invalid request" });
  }

  const user = await userModel.findOne({ where: { email } });

  if (!user || !user.resetTokenHash || user.resetExpiresAt < new Date()) {
    return res.status(400).json({ error: "Invalid or expired token" });
  }

  const incomingHash = hashToken(token);

  if (incomingHash !== user.resetTokenHash) {
    return res.status(400).json({ error: "Invalid or expired token" });
  }

  const passwordHash = await hashPassword(Password);

  await user.update({
    passwordHash,
    resetTokenHash: null,
    resetExpiresAt: null,
    tokenVersion: user.tokenVersion + 1,
  });

  // Kill all sessions
  await sessionModel.destroy({
    where: { userId: user.id },
  });

  return res.json({
    message: "Password reset successful. Please log in again.",
  });
}

module.exports = { resetPassword };
