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
        riderStatus: "completed",
      },
    },
  ]);

  const result = await Order.populate(nearestStore, { path: "store" });

  return res.status(200).send(result);
};

// const getPendingOrders = async (req, res) => {
//   const getOrders = await Order.find({ riderStatus: "pending" });

//   return res.status(200).json(getOrders);
// };

// const getCompletedOrders = async (req, res) => {
//   const getOrders = await Order.find({ riderStatus: "completed" });

//   return res.status(200).json(getOrders);
// };

const getDeliveredOrders = async (req, res) => {
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
        riderStatus: "delivered",
      },
    },
  ]);

  const result = await Order.populate(nearestStore, { path: "store" });

  return res.status(200).send(result);
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
