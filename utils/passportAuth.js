const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;

const GOOGLE_CLIENT_ID =
  "764318071938-91oi3jl0f964u1a3e2811mffgje4scr6.apps.googleusercontent.com";

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

//https://dish-demo.onrender.com/auth/google/callback
//      callbackURL: "http://localhost:5000/auth/google/callback",
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
