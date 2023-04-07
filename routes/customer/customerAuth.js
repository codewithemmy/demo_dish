const express = require("express");

const router = express.Router();

const {
  register,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
} = require("../../controllers/customer/customerAuth");
const {
  getProfile,
  updateProfile,
} = require("../../controllers/customer/profile");

const auth = require("../../customerMiddleware/authentication");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);
router.route("/change-password").post(auth, changePassword);

//customer profile route
router.route("/getProfile/:id").get(getProfile);
router.route("/updateProfile/:id").patch(updateProfile);

module.exports = router;
