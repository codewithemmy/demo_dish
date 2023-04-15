const express = require("express");
const {
  getOrders,
  getOrderById,
  deleteOrder,
  updateOrder,
  confirmDelivery,
  getCustomerOrders,
  getPendingOrders,
  getCompletedOrders,
  getWaitingOrders,
  createTransactionOrder,
} = require("../../controllers/customer/customerOrder");
const auth = require("../../customerMiddleware/authentication");
const {
  updateTransaction,
  createPaymentIntent,
} = require("../../controllers/customer/customerTransaction");

const router = express.Router();

router.route("/totalPrice/:id").post(auth, createTransactionOrder);
router.route("/deleteOrder/:id").delete(auth, deleteOrder);
router.route("/getOrders").get(auth, getOrders);
router.route("/getOrderById/:id").get(auth, getOrderById);
router.route("/updateOrder/:id").patch(auth, updateOrder);
router.route("/confirmDelivery/:id").patch(auth, confirmDelivery);

//getting all customers orders
router.route("/getCustomerOrders").get(auth, getCustomerOrders);
router.route("/getPendingOrders").get(auth, getPendingOrders);
router.route("/getCompletedOrders").get(auth, getCompletedOrders);
router.route("/getWaitingOrders").get(auth, getWaitingOrders);
router.route("/placeOrder").post(auth, updateTransaction);
router.route("/createPaymentIntent").post(auth, createPaymentIntent);

module.exports = router;
