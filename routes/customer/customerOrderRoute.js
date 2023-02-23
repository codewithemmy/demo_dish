const express = require("express");
const {
  getOrders,
  getOrderById,
  deleteOrder,
  createOrder,
  updateOrder,
  confirmDelivery,
} = require("../../controllers/customer/customerOrder");
const authMiddleware = require("../../customerMiddleware/authentication");

const router = express.Router();

router.route("/createOrder").post(authMiddleware, createOrder);
router.route("/deleteOrder/:id").delete(authMiddleware, deleteOrder);
router.route("/getOrders").get(authMiddleware, getOrders);
router.route("/getOrderById/:id").get(authMiddleware, getOrderById);
router.route("/updateOrder/:id").patch(authMiddleware, updateOrder);
router.route("/confirmDelivery/:id").patch(authMiddleware, confirmDelivery);

module.exports = router;
