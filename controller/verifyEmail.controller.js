const { User: userModel } = require("../models");
const { hashToken } = require("../utils/token.utils");

async function verifyEmail(req, res) {
  const { token, email } = req.query;

  if (!token || !email) {
    return res.status(400).send("Invalid verification link");
  }

  const user = await userModel.findOne({ where: { email } });

  if (!user || !user.verificationTokenHash) {
    return res.status(400).send("Invalid or expired link");
  }

  const incomingHash = hashToken(token);

  if (
    incomingHash !== user.verificationTokenHash ||
    user.verificationExpiresAt < new Date()
  ) {
    return res.status(400).send("Invalid or expired link");
  }

  user.isVerified = true;
  user.verificationTokenHash = null;
  user.verificationExpiresAt = null;

  await user.save();

  return res.send("Email verified successfully. You can now log in.");
}

module.exports = { verifyEmail };
