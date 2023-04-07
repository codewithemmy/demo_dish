const express = require("express");

const router = express.Router();

const {
  register,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
} = require("../../controllers/sellar/auth");

const auth = require("../../middleware/authentication");

router.route("/register").post(register);
router.route("/verify-mail/:id").post(verifyEmail);
router.route("/login").post(login);
// router.route("/logout").delete(logout);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);
router.route("/change-password").post(auth, changePassword);

module.exports = router;
