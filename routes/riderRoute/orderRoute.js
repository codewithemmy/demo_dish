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
router.route("/updateOrderStatus/:id").patch(auth, updateOrderStatus);
router.route("/pickOrder/:id").patch(auth, pickUpOrder);
router.route("/getPickOrder").get(auth, getPickedOrders);

//location for rider routes
router.route("/location/:id").patch(getRiderLocation);

// router.route("/verifyEmail/:id").post(verifyEmail);
// router.route("/login").post(login);
// // router.route("/logout").delete(logout);
// router.route("/forgot-password").post(forgotPassword);
// router.route("/reset-password").post(resetPassword);

module.exports = router;
