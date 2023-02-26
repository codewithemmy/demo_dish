const { StatusCodes } = require("http-status-codes");
const Order = require("../../models/customerModel/CustomerOrder");

// get pending order for sellar
const getPendingOrder = async (req, res) => {
  const sellar = req.user;

  if (sellar) {
    const orders = await Order.find({
      sellarId: req.user.userId,
      orderStatus: "pending",
    }).populate("items.food");
    if (orders != null) {
      return res.status(StatusCodes.OK).json(orders);
    }
    return res.status(StatusCodes.OK).json({ msg: `your order cart is empty` });
  }
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ msg: `error getting orders` });
};

// get completed order for sellar
const getCompletedOrder = async (req, res) => {
  const sellar = req.user;

  if (sellar) {
    const orders = await Order.find({
      sellarId: req.user.userId,
      orderStatus: "completed",
    }).populate("items.food");
    if (orders != null) {
      return res.status(StatusCodes.OK).json(orders);
    }
    return res.status(StatusCodes.OK).json({ msg: `your order cart is empty` });
  }
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ msg: `error getting orders` });
};

// get order details for sellar
const getOrderDetails = async (req, res) => {
  const orderId = req.params.id;

  const order = await Order.findById(orderId).populate("items.food");
  if (order) {
    return res.status(StatusCodes.OK).json({ order });
  }
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ msg: `error getting order` });
};

// customer process order by Id
const processOrders = async (req, res) => {
  const orderId = req.params.id;
  const { orderStatus, remarks, time } = req.body;

  if (orderId) {
    const order = await Order.findById(orderId).populate("items.food");

    order.orderStatus = orderStatus;

    orderStatus.remarks = remarks;
    if (time) {
      order.readyTime = time;
    }
    const orderResult = await order.save();

    return res.status(StatusCodes.OK).json({ orderResult });
  }
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ msg: `error processing order` });
};

module.exports = {
  getPendingOrder,
  getOrderDetails,
  processOrders,
  getCompletedOrder,
};
