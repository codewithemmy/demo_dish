const express = require("express");
const { CreateOrder } = require("../customerController/customerOrder");
const authMiddleware = require("../middleware/authentication");

const router = express.Router();

router.route("/createOrder").post(authMiddleware, CreateOrder);
module.exports = router;
