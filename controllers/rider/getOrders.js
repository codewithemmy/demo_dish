const Order = require("../../models/customerModel/CustomerOrder");
const Transaction = require("../../models/customerModel/Transaction");
const Bank = require("../../models/riderModel/Bank");
const Rider = require("../../models/riderModel/Rider");
const RiderTransaction = require("../../models/riderModel/RiderTransaction");
const Sellar = require("../../models/sellarModel/Sellar");
const StoreDetails = require("../../models/sellarModel/StoreDetails");
const { mailTransport } = require("../../utils/sendEmail");
const { stripeTransfer } = require("../../utils/stripeTransfer");

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
      $sort: {
        createdAt: 1,
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
      .populate({ path: "items.food" })
      .sort({ createdAt: "desc" })
      .exec();

    return res.status(200).json(completeOrders);
  }
  return res.status(400).json({ msg: `unable to get picked orders` });
};

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
  const getOrders = await Order.countDocuments({ riderStatus: "delivered" })
    .sort({ createdAt: "desc" })
    .exec();

  return res.status(200).json(getOrders);
};

//confirm delivery
const confirmDelivery = async (req, res) => {
  const deliveryId = req.params.id;
  const { confirmDelivery } = req.body;
  const rider = req.user.userId;

  if (rider) {
    const order = await Order.findById({ _id: deliveryId });
    if (!order) {
      return res.status(200).json({ msg: `No order with id : ${deliveryId}` });
    }

    order.confirmDelivery = confirmDelivery;
    await order.save();

    const transaction = await Transaction.findOne({
      orderId: deliveryId,
    });

    if (transaction.transactionStatus === "Succeeded") {
      //send Mail
      mailTransport.sendMail({
        from: '"Afrilish" <afrilish@afrilish.com>', // sender address
        to: order.customerEmail, // list of receivers
        subject: "YOUR ORDER CODE", // Subject line
        html: `Hello, this is you order code: ${order.orderCode} upon delivery. Have a nice meal</h4>`, // html body
      });

      await Rider.findOneAndUpdate(
        { _id: order.assignedRider },
        { $inc: { wallet: order.ridersFee } },
        { new: true, runValidators: true }
      );

      await Sellar.findOneAndUpdate(
        { _id: order.sellarId },
        { $inc: { wallet: order.netAmount } },
        { new: true, runValidators: true }
      );
    }

    return res
      .status(200)
      .json({ msg: `Sucessful, confirm order code from the client` });
  }
  return res.status(400).json({ msg: `unable to confirm delivery` });
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

const getWallet = async (req, res) => {
  const rider = req.user.userId;
  if (rider) {
    const riderWallet = await Rider.findOne({ _id: rider });

    return res.status(200).json(riderWallet.wallet);
  }
  return res.status(404).json({ msg: `unable to get wallet` });
};

const riderWithdrawal = async (req, res) => {
  const rider = req.user.userId;
  if (rider) {
    const { amount } = req.body;

    const transaction = await RiderTransaction.create({
      amount: amountInCents,
      rider: req.user.userId,
    });

    const bank = await Bank.findOne({ riderId: rider });

    await stripeTransfer(
      bank.bankname,
      bank.accountnumber,
      bank.accountname,
      bank.sortcode,
      amount,
      bank.accounttype
    );

    return res.status(200).json({ msg: `Successful`, transaction });
  }
  return res.status(400).json({ msg: `unable to withdraw` });
};

const riderTransaction = async (req, res) => {
  const riderId = req.user.userId;
  if (riderId) {
    const history = await RiderTransaction.find({ rider: riderId });
    return res.status(200).json({ msg: `successful`, history });
  }
  return res.status(400).json({ msg: `unable to get history` });
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
  confirmDelivery,
  getWallet,
  riderWithdrawal,
  riderTransaction,
};
