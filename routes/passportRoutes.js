/**passport authentication setup */
const express = require("express");
const router = express.Router();
const Sellar = require("../models/sellarModel/Sellar");
const passport = require("passport");
require("../utils/passportAuth");
const { StatusCodes } = require("http-status-codes");

router.get("/home", (req, res) => {
  res.send('<a href="/api/v1/auth/google">Authenticate with google</a>');
});

router.get(
  "/api/v1/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/api/v1/auth/passportLogin",
    failureRedirect: "/api/v1/auth/passportFailed",
  })
);

router.get("/api/v1/auth/passportFailed", (req, res) => {
  return res.status(403).json({ msg: `Error Authenticating Google Id` });
});

router.get("/api/v1/auth/passportLogin", async (req, res) => {
  const sellar = await Sellar.findOne();
  if (req.user.email === sellar.email) {
    let token = sellar.createJWT();
    return res
      .status(StatusCodes.ACCEPTED)
      .json({ msg: `Google Authentication valid`, token });
  } else {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `Google Authentication is invalid` });
  }
});

router.get("/logout", (req, res) => {
  req.logout;
  req.session.destroy();
  res.send("Good Bye");
});

module.exports = router;
