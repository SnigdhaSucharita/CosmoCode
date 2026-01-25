const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { user: userModel } = require("../models");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const googleId = profile.id;

        if (!email) {
          return done(new Error("Google account has no email"));
        }

        let user = await userModel.findOne({ where: { email } });

        if (!user) {
          user = await userModel.create({
            email,
            username: profile.displayName.replace(/\s/g, "").toLowerCase(),
            googleId,
            isVerified: true,
            passwordHash: null,
          });
        } else if (!user.googleId) {
          // Link Google account to existing user
          user.googleId = googleId;
          user.isVerified = true;
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

module.exports = passport;
