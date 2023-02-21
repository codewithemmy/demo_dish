const Order = require("../../models/customerModel/CustomerOrder");

const getOrders = async (req, res) => {
  console.log(req.user);
  const getOrders = await Order.find({ assignedRider: req.user.userId });

  return res.status(200).json(getOrders);
};

module.exports = {
  getOrders,
};
