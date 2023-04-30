const express = require("express");
const {
  getProfile,
  updateProfile,
  createSupport,
} = require("../../controllers/rider/profile");
const {
  register,
  verifyEmail,
  forgotPassword,
  resetPassword,
  login,
  riderAvailable,
  changePassword,
  sendVerifyMail,
} = require("../../controllers/rider/riderAuth");

const auth = require("../../riderMiddleware/authentication");

const router = express.Router();

router.route("/register").post(register);
router.route("/verify-mail/:id").post(verifyEmail);
router.route("/login").post(login);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);
router.route("/change-password").post(auth, changePassword);
router.route("/send-verify-mail/:id").post(auth, sendVerifyMail);

// router.route("/logout/:id").delete(logout);

//profile
router.route("/profile/:id").get(getProfile);
router.route("/updateProfile/:id").patch(updateProfile);

//rider available
router.route("/riderAvailable").patch(auth, riderAvailable);

//support
router.route("/support").post(auth, createSupport);

module.exports = router;
