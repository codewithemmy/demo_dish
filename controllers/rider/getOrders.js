const Order = require("../../models/customerModel/CustomerOrder");

const getOrders = async (req, res) => {
  const getOrders = await Order.find();

  return res.status(200).json(getOrders);
};

module.exports = {
  getOrders,
};
