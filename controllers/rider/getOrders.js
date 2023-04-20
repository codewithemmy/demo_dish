const Order = require("../../models/customerModel/CustomerOrder");
const StoreDetails = require("../../models/sellarModel/StoreDetails");

const getPendingOrders = async (req, res) => {
  const longitude = req.body.lng;
  const latitude = req.body.lat;
  const nearestStore = await Order.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        key: "location",
        maxDistance: parseFloat(20000) * 1609,
        distanceField: "distance",
        spherical: true,
      },
    },
    {
      $match: {
        riderStatus: "pending",
        paymentStatus: "paid",
      },
    },
  ]);

  const result = await Order.populate(nearestStore, [
    { path: "store" },
    { path: "orderedBy" },
  ]);

  return res.status(200).send(result);
};

const getCompletedOrders = async (req, res) => {
  const user = req.user.userId;
  if (user) {
    const completeOrders = await Order.find({
      assignedRider: user,
      riderStatus: "delivered",
      orderStatus: "completed",
    })
      .populate({ path: "store" })
      .populate({ path: "orderedBy", select: "-orders" })
      .populate({ path: "items.food" });
    return res.status(200).json(completeOrders);
  }
  return res.status(400).json({ msg: `unable to get completed orders` });
};

const getDeliveredOrders = async (req, res) => {
  const user = req.user.userId;
  if (user) {
    const completeOrders = await Order.find({
      assignedRider: user,
      riderStatus: "delivered",
    })
      .populate({ path: "store" })
      .populate({ path: "orderedBy", select: "-orders" })
      .populate({ path: "items.food" });
    return res.status(200).json(completeOrders);
  }
  return res.status(400).json({ msg: `unable to get completed orders` });
};

const getPickedOrders = async (req, res) => {
  const user = req.user.userId;
  if (user) {
    const completeOrders = await Order.find({
      assignedRider: user,
      riderStatus: "picked",
    })
      .populate({ path: "store" })
      .populate({ path: "orderedBy", select: "-orders" })
      .populate({ path: "items.food" });
    return res.status(200).json(completeOrders);
  }
  return res.status(400).json({ msg: `unable to get picked orders` });
};

// //assign and pick order
// const pickUpOrder = async (req, res) => {
//   const orderId = req.params.id;
//   if (orderId) {
//     const pickOrder = await Order.findByIdAndUpdate(
//       { _id: orderId },
//       { assignedRider: req.user.userId, riderStatus: "picked" },
//       { new: true, runValidators: true }
//     );

//     return res
//       .status(200)
//       .json({ msg: `Order is now assigned to riderId: ${orderId}`, pickOrder });
//   }

//   return res.status(400).json({ msg: `unable to update order` });
// };

//assign and pick order
const pickUpOrder = async (req, res) => {
  const orderId = req.params.id;
  const pickUpCode = req.body.pickUpCode;
  if (orderId) {
    const findCode = await Order.findOne({
      pickUpCode: pickUpCode,
      paymentStatus: "paid",
    });

    if (!findCode) {
      return res.status(404).json({ msg: `you pickup code is invalid` });
    }

    const pickOrder = await Order.findByIdAndUpdate(
      { _id: orderId },
      { assignedRider: req.user.userId, riderStatus: "picked" },
      { new: true, runValidators: true }
    );

    return res
      .status(200)
      .json({ msg: `Order is now assigned to riderId: ${orderId}`, pickOrder });
  }

  return res.status(400).json({ msg: `unable to pick order` });
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
  const orderId = req.params.id;
  const deliveryCode = req.body.deliveryCode;

  if (orderId) {
    const findCode = await Order.findOne({
      orderCode: deliveryCode,
      paymentStatus: "paid",
    });

    if (!findCode) {
      return res.status(404).json({ msg: `your delivery is invalid` });
    }

    await Order.findByIdAndUpdate(
      { _id: orderId },
      { riderStatus: "delivered" },
      { new: true, runValidators: true }
    );

    return res.status(200).json({ msg: `Your delivery is successful` });
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
  pickUpOrder,
  getPickedOrders,
};
