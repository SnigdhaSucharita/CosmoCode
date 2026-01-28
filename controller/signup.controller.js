require("dotenv").config();
const { User: userModel } = require("../models");
const { Op } = require("sequelize");
const { isValidEmailFormat } = require("../validations/index");
const { hashPassword } = require("../utils/password.utils");
const { generateToken, hashToken } = require("../utils/token.utils");
const { sendEmail } = require("../utils/email.utils");
const { EMAIL_TOKEN_EXPIRY_MS } = require("../config/auth.config");

async function signup(req, res) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (!isValidEmailFormat(email))
    return res.status(400).json({ message: "Invalid email format." });

  const existingUser = await userModel.findOne({
    where: { [Op.or]: [{ email }, { username }] },
  });
  if (existingUser)
    return res.status(400).json({ error: "username or email taken" });

  const passwordHash = await hashPassword(password);

  const verificationToken = generateToken();
  const verificationTokenHash = hashToken(verificationToken);

  const user = await userModel.create({
    username,
    email,
    passwordHash,
    verificationTokenHash,
    verificationExpiresAt: new Date(Date.now() + EMAIL_TOKEN_EXPIRY_MS),
  });

  const verifyLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;

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

  return res.status(201).json({
    success: true,
    message: "Signup successful. Please verify your email.",
  });
}

module.exports = { signup };
