const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;

const GOOGLE_CLIENT_ID =
  "764318071938-otluemiqpa2hoodo2kn0uqrk1kfu3i7d.apps.googleusercontent.com";

const GOOGLE_CLIENT_SECRET = "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";

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "https://dish-demo.onrender.com/auth/google/callback",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
