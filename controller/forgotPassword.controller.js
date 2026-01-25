const { user: userModel } = require("../models");
const { generateToken, hashToken } = require("../utils/token.utils");
const { sendEmail } = require("../utils/email.utils");
const { PASSWORD_RESET_TOKEN_EXPIRY_MS } = require("../config/auth.config");

async function forgotPassword(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email required" });
  }

  const user = await userModel.findOne({ where: { email } });

  // Always returning success (prevents email enumeration)
  if (!user) {
    return res.json({
      message: "If the email exists, a reset link has been sent",
    });
  }

  const resetToken = generateToken();
  const resetTokenHash = hashToken(resetToken);

  await user.update({
    resetTokenHash,
    resetExpiresAt: new Date(Date.now() + PASSWORD_RESET_TOKEN_EXPIRY_MS),
  });

  const resetLink = `${
    process.env.FRONTEND_URL
  }/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

  await sendEmail({
    to: email,
    subject: "Reset your Picstoria password",
    html: `
      <h3>Password Reset</h3>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>This link expires in 30 minutes.</p>
    `,
  });

  return res.json({
    message: "If the email exists, a reset link has been sent",
  });
}

module.exports = { forgotPassword };
