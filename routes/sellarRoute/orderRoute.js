const express = require("express");
const {
  getOrder,
  getOrderDetails,
  processOrders,
} = require("../../controllers/Sellar/order");
const authMiddleware = require("../../middleware/authentication");

const router = express.Router();

router.route("/getOrder").get(authMiddleware, getOrder);
router.route("/getOrderDetails/:id").get(authMiddleware, getOrderDetails);
router.route("/:id/processOrders").patch(authMiddleware, processOrders);

module.exports = router;
