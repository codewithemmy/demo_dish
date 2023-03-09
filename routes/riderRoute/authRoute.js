const express = require("express");
const {
  getProfile,
  updateProfile,
} = require("../../controllers/rider/profile");
const {
  register,
  verifyEmail,
  riderLogin,
  logout,
} = require("../../controllers/rider/riderAuth");

const router = express.Router();

router.route("/register").post(register);
router.route("/verifyEmail/:id").post(verifyEmail);
router.route("/login").post(riderLogin);
router.route("/logout/:id").delete(logout);
router.route("/profile/:id").get(getProfile);
router.route("/updateProfile/:id").patch(updateProfile);

// router.route("/forgot-password").post(forgotPassword);
// router.route("/reset-password").post(resetPassword);

module.exports = router;
