const express = require("express");

const router = express.Router();

const {
  register,
  login,
  forgotPassword,
  resetPassword,
} = require("../../controllers/customer/customerAuth");
const {
  getProfile,
  updateProfile,
} = require("../../controllers/customer/profile");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);


//customer profile route
router.route("/getProfile/:id").post(getProfile);
router.route("/updateProfile/:id").patch(updateProfile);

module.exports = router;
