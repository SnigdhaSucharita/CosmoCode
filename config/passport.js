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
    async (_, __, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const googleId = profile.id;

        let user = await userModel.findOne({ where: { email } });

        if (!user) {
          user = await userModel.create({
            email,
            username: profile.displayName.replace(/\s/g, "").toLowerCase(),
            googleId,
            isVerified: true, // Google already verified email
            passwordHash: null,
          });
        } else if (!user.googleId) {
          // Link existing account
          user.googleId = googleId;
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

module.exports = { passport };
