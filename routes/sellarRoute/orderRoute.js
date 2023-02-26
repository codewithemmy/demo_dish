const express = require("express");
const {
  getPendingOrder,
  getCompletedOrder,
  getOrderDetails,
  processOrders,
} = require("../../controllers/sellar/order");
const authMiddleware = require("../../middleware/authentication");

const router = express.Router();

router.route("/getOrder/pending").get(authMiddleware, getPendingOrder);
router.route("/getOrder/completed").get(authMiddleware, getCompletedOrder);
router.route("/getOrderDetails/:id").get(authMiddleware, getOrderDetails);
router.route("/:id/processOrders").patch(authMiddleware, processOrders);

module.exports = router;
