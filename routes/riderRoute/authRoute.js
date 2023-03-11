const express = require("express");
const {
  getProfile,
  updateProfile,
} = require("../../controllers/rider/profile");
const {
  register,
  verifyEmail,
  riderLogin,
  forgotPassword,
  resetPassword,
} = require("../../controllers/rider/riderAuth");

const router = express.Router();

router.route("/register").post(register);
router.route("/verify-mail/:id").post(verifyEmail);
router.route("/login").post(riderLogin);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);

// router.route("/logout/:id").delete(logout);

//profile
router.route("/profile/:id").get(getProfile);
router.route("/updateProfile/:id").patch(updateProfile);

module.exports = router;
