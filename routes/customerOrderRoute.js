const express = require("express");
const { CreateOrder } = require("../controllers/customerOrder");
const authMiddleware = require("../customerMiddleware/authentication");

const router = express.Router();

router.route("/createOrder").post(authMiddleware, CreateOrder);
module.exports = router;
