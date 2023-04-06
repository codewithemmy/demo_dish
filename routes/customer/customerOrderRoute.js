const express = require("express");
const {
  getOrders,
  getOrderById,
  deleteOrder,
  createOrder,
  updateOrder,
  confirmDelivery,
  getCustomerOrders,
  getPendingOrders,
  getCompletedOrders,
  getWaitingOrders,
} = require("../../controllers/customer/customerOrder");
const authMiddleware = require("../../customerMiddleware/authentication");

const router = express.Router();

router.route("/createOrder/:id").post(authMiddleware, createOrder);
router.route("/deleteOrder/:id").delete(authMiddleware, deleteOrder);
router.route("/getOrders").get(authMiddleware, getOrders);
router.route("/getOrderById/:id").get(authMiddleware, getOrderById);
router.route("/updateOrder/:id").patch(authMiddleware, updateOrder);
router.route("/confirmDelivery/:id").patch(authMiddleware, confirmDelivery);

//getting all customers orders
router.route("/getCustomerOrders").get(authMiddleware, getCustomerOrders);
router.route("/getPendingOrders").get(authMiddleware, getPendingOrders);
router.route("/getCompletedOrders").get(authMiddleware, getCompletedOrders);
router.route("/getWaitingOrders").get(authMiddleware, getWaitingOrders );

module.exports = router;
