const express = require("express");
const {
  updateOrderStatus,
  getPendingOrders,
  getDeliveredOrders,
  getCompletedOrders,
  getPendingOrdersNumbers,
  getComPletedOrdersNumbers,
  getDeliveredOrdersNumbers,
  pickUpOrder,
  getPickedOrders,
  confirmDelivery,
  getWallet,
  riderWithdrawal,
  riderTransaction,
} = require("../../controllers/rider/getOrders");

const { getRiderLocation } = require("../../controllers/rider/riderLocation");
const router = express.Router();

const auth = require("../../riderMiddleware/authentication");

router.route("/getDeliveredOrdersNumbers").get(auth, getDeliveredOrdersNumbers);
router.route("/getOrdersPendingNumbers").get(auth, getPendingOrdersNumbers);
router.route("/getComPletedOrdersNumbers").get(auth, getComPletedOrdersNumbers);
router.route("/getPendingOrders").post(auth, getPendingOrders);
router.route("/getCompletedOrders").post(auth, getCompletedOrders);
router.route("/getDeliveredOrders").post(auth, getDeliveredOrders);
router.route("/updateOrderStatus/:id").post(auth, updateOrderStatus);
router.route("/pickOrder/:id").post(auth, pickUpOrder);
router.route("/getPickOrder").get(auth, getPickedOrders);
router.route("/confirmDelivery/:id").patch(auth, confirmDelivery);
router.route("/wallet").get(auth, getWallet);
router.route("/withdraw").post(auth, riderWithdrawal);
router.route("/riderTransaction").get(auth, riderTransaction);

//location for rider routes
router.route("/location/:id").patch(getRiderLocation);

module.exports = router;
