const Order = require("../../models/customerModel/CustomerOrder");

const getPendingOrders = async (req, res) => {
  const getOrders = await Order.find({ riderStatus: "pending" });

  return res.status(200).json(getOrders);
};

const getCompletedOrders = async (req, res) => {
  const getOrders = await Order.find({ riderStatus: "completed" });

  return res.status(200).json(getOrders);
};

const getDeliveredOrders = async (req, res) => {
  const getOrders = await Order.find({ riderStatus: "delivered" });

  return res.status(200).json(getOrders);
};

const getPendingOrdersNumbers = async (req, res) => {
  const getOrders = await Order.countDocuments({ riderStatus: "pending" });

  return res.status(200).json(getOrders);
};

const getComPletedOrdersNumbers = async (req, res) => {
  const getOrders = await Order.countDocuments({ riderStatus: "completed" });

  return res.status(200).json(getOrders);
};

const getDeliveredOrdersNumbers = async (req, res) => {
  const getOrders = await Order.countDocuments({ riderStatus: "delivered" });

  return res.status(200).json(getOrders);
};

const updateOrderStatus = async (req, res) => {
  const riderId = req.user.userId;
  const orderId = req.params.id;
  const { riderStatus } = req.body;

  if (riderId) {
    if (!orderId) {
      return res.status(404).json({ msg: `order params id not found` });
    }

    const orderStatus = await Order.findOne({ _id: orderId });
    if (!orderStatus) {
      return res
        .status(404)
        .json({ msg: `cannot find order with id ${orderId}` });
    }

    orderStatus.riderStatus = riderStatus;

    const result = await orderStatus.save();

    return res
      .status(200)
      .json({ msg: `order status update is successful`, result });
  }

  return res.status(400).json({ msg: `unable to update status` });
};


module.exports = {
  getPendingOrders,
  getDeliveredOrders,
  updateOrderStatus,
  getCompletedOrders,
  getPendingOrdersNumbers,
  getComPletedOrdersNumbers,
  getDeliveredOrdersNumbers,
};
