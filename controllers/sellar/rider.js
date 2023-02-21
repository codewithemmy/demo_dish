const Rider = require("../../models/riderModel/Rider");
const Order = require("../../models/customerModel/CustomerOrder");

//get Order
const getRider = async (req, res) => {
  const sellar = req.user.userId;

  if (sellar) {
    const rider = await Rider.find();

    return res.status(200).json(rider);
  }

  return res.status(400).json({ msg: `unable to get rider` });
};

const assignRiderOrder = async (req, res) => {
  const sellar = req.user.userId;

  const orderId = req.params.id1;
  const riderId = req.params.id2;

  if (sellar) {
    const assignOrder = await Order.findByIdAndUpdate(
      { _id: orderId },
      { assignedRider: riderId },
      { new: true, runValidators: true }
    );

    if (!assignOrder) {
      return res.status(404).json({ msg: `id provided not found` });
    }

    return res
      .status(200)
      .json({ msg: `Order asigned successfully`, assignOrder });
  }

  return res.status(400).json({ msg: `unable to assign order` });
};

module.exports = {
  getRider,
  assignRiderOrder,
};
