const express = require("express");
const { createDelivery, getDeliveryType, updateDeliveryType } = require("../controllers/customerDelivery");
const authMiddleware = require("../customerMiddleware/authentication");

const router = express.Router();

router.route("/createDelivery").post(authMiddleware, createDelivery);
router.route("/getDeliveryType").get(authMiddleware, getDeliveryType);
router.route("/updateDeliveryType/:id").patch(authMiddleware, updateDeliveryType);

module.exports = router;
