const express = require("express");
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
// router.route("/forgot-password").post(forgotPassword);
// router.route("/reset-password").post(resetPassword);

module.exports = router;
