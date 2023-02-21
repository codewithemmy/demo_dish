const express = require("express");
const { getOrders } = require("../../controllers/rider/getOrders");
const router = express.Router();

const auth = require("../../riderMiddleware/authentication");

router.route("/getOrders").get(auth, getOrders);
// router.route("/verifyEmail/:id").post(verifyEmail);
// router.route("/login").post(login);
// // router.route("/logout").delete(logout);
// router.route("/forgot-password").post(forgotPassword);
// router.route("/reset-password").post(resetPassword);

module.exports = router;
