const express = require("express");
const { deliveryType } = require("../../controllers/sellar/deliveryType");
const authMiddleware = require("../../middleware/authentication");

const router = express.Router();

router.route("/deliveryType").post(authMiddleware, deliveryType);


module.exports = router;
