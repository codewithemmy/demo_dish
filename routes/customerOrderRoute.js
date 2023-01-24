const express = require("express");
const {
  CreateOrder,
  getOrders,
  getOrderById,
} = require("../controllers/customerOrder");
const authMiddleware = require("../customerMiddleware/authentication");

const router = express.Router();

router.route("/createOrder").post(authMiddleware, CreateOrder);
router.route("/getOrders").get(authMiddleware, getOrders);
router.route("/getOrderById/:id").get(authMiddleware, getOrderById);

module.exports = router;
