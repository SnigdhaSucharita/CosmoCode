const crypto = require("crypto");
const { User: userModel } = require("../models");
const { generateToken, hashToken } = require("../utils/token.utils");
const { sendEmail } = require("../utils/email.utils");

async function resendVerification(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const user = await userModel.findOne({ where: { email } });

  if (!user) {
    return res.status(200).json({
      message: "If the account exists, a verification email has been sent",
    });
  }

  if (user.isVerified) {
    return res.status(400).json({
      message: "Email already verified",
    });
  }

  // generate new token
  const token = generateToken();

  user.verificationTokenHash = hashToken(token);
  user.verificationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

  await user.save();

  const verifyLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}&email=${encodeURIComponent(
    email,
  )}`;

  try {
    await sendEmail({
      to: email,
      subject: "Verify your Picstoria account",
      html: `
        <h2>Welcome to Picstoria</h2>
        <p>Please verify your email to activate your account.</p>
        <a href="${verifyLink}">Verify Email</a>
        <p>This link expires in 24 hours.</p>
      `,
    });
    await user.update({ emailSent: true });
  } catch (err) {
    console.error("Email failed:", err.message);
  }

  return res.json({
    success: true,
    message: "Verification email sent",
  });
}

module.exports = { resendVerification };
