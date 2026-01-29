const { User: userModel } = require("../models");
const { hashToken } = require("../utils/token.utils");

async function verifyEmail(req, res) {
  const { token, email } = req.query;

  if (!token || !email) {
    return res.status(400).json({ message: "Invalid verification link" });
  }

  const user = await userModel.findOne({ where: { email } });

  if (!user || !user.verificationTokenHash) {
    return res.status(400).json({ message: "Invalid or expired link" });
  }

  const incomingHash = hashToken(token);

  const isExpired = user.verificationExpiresAt < new Date();
  const isInvalid = incomingHash !== user.verificationTokenHash;

  if (isInvalid || isExpired) {
    return res.status(400).json({
      message: isExpired ? "Link expired" : "Invalid verification link",
    });
  }

  user.isVerified = true;
  user.verificationTokenHash = null;
  user.verificationExpiresAt = null;

  await user.save();

  return res.set("Cache-Control", "no-store").json({
    success: true,
    message: "Email verified successfully",
  });
}

module.exports = { verifyEmail };
