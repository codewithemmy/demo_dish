const Order = require("../../models/customerModel/CustomerOrder");
const Customer = require("../../models/customerModel/Customer");
const StoreDetails = require("../../models/sellarModel/StoreDetails");
const SellarFood = require("../../models/sellarModel/SellarFood");
const { StatusCodes } = require("http-status-codes");
const { genRandomNumber } = require("../../utils/index");

// Helper function to convert degrees to radians
function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

//create order
const createTransactionOrder = async (req, res) => {
  //grab the login customer
  const customer = req.user;

  if (customer) {
    //get the store id
    const storeId = req.params.id;

    //get the store and customer using findOne
    const store = await StoreDetails.findOne({ _id: storeId });

    const customerlng = req.body.lng;
    const customerlat = req.body.lat;
    const storelng = store.location.coordinates[0];
    const storelat = store.location.coordinates[1];

    const R = 6371; // Earth's radius in kilometers
    const dLon = deg2rad(customerlng - storelng);
    const dLat = deg2rad(customerlat - storelat);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(storelat)) *
        Math.cos(deg2rad(customerlat)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    const kilometers = distance.toFixed(2);

    let ridersFee = kilometers * 1;

    //get the store location type and coordinates
    const locationType = store.location.type;
    const locationCoordinates = store.location.coordinates;

    const profile = await Customer.findById(customer.userId);
    //grab order items from request [{id: xx, unit: xx}]
    const cart = req.body.cartItems; //[{ id: xx, quantity: xx }];
    let cartItems = Array();
    let netAmount = 0.0;

    //calculate order amount
    const foods = await SellarFood.find()
      .where("_id")
      .in(cart.map((item) => item._id))
      .exec();

    //map food and compare with id from req.body array
    foods.map((food) => {
      cart.map(({ _id, quantity }) => {
        if (food._id == _id) {
          // sellarId = food.storeOwner;
          netAmount += food.price * quantity;
          cartItems.push({ food, quantity });
        }
      });
    });

    const deliveryFee = 2;
    const marketPlace = 3;

    let totalPrice = netAmount + deliveryFee + marketPlace + ridersFee;
    let roundTotalPrice = Math.ceil(totalPrice);

    //create order with item description
    if (cartItems) {
      let serviceCharge = (10 * totalPrice) / 100;

      //create order
      const currentOrder = await Order.create({
        pickUpCode: genRandomNumber(),
        orderCode: genRandomNumber(),
        items: cartItems,
        orderedBy: customer.userId,
        netAmount,
        totalAmount: roundTotalPrice,
        orderDate: new Date(),
        paymentResponse: "",
        location: {
          type: "Point",
          coordinates: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
        },
        store: storeId,
        ridersFee,
        customerEmail: req.user.email,
        customerName: req.user.fullName,
        addNote: req.body.addNote,
        serviceCharge,
        sellarId: store.storeOwner,
        readyTime: "",
        remarks: "",
      });

      if (currentOrder) {
        profile.orders.push(currentOrder);
        await profile.save();

        return res.status(200).json({ currentOrder });
      }
    }
    return res.status(400).json({ msg: "Your cart is empty" });
  }
  return res.status(400).json({ msg: "error with creating order" });
};

//get customers order /cart
const getOrders = async (req, res) => {
  const customer = req.user.userId;
  if (customer) {
    const customerOrders = await Customer.findOne({ _id: customer }).populate(
      "orders"
    );
    if (!customerOrders) {
      return res.status(404).json({ msg: `customer order not found` });
    }
    return res.status(200).json({ "Current Orders": customerOrders.orders });
  }
  return res.status(400).json({ msg: `error getting customer orders` });
};

//get all customer orders
const getCustomerOrders = async (req, res) => {
  const customer = req.user.userId;
  if (customer) {
    const customerOrders = await Order.find({ orderedBy: customer })
      .populate("items.food")
      .sort({ createdAt: "desc" })
      .exec();
    if (!customerOrders) {
      return res.status(404).json({ msg: `order not available` });
    }
    return res.status(200).json(customerOrders);
  }
  return res.status(400).json({ msg: `error getting customer orders` });
};

//get all pending  orders
const getCompletedOrders = async (req, res) => {
  const customer = req.user.userId;
  if (customer) {
    const customerOrders = await Order.find({
      orderedBy: customer,
      orderStatus: "completed",
    })
      .populate("items.food")
      .populate("store", { storeName: 1, storeImage: 1 })
      .sort({ createdAt: "desc" })
      .exec();
    if (!customerOrders) {
      return res.status(404).json({ msg: `order not available` });
    }
    return res.status(200).json(customerOrders);
  }
  return res.status(400).json({ msg: `error getting customer orders` });
};

//get all pending  orders
const getPendingOrders = async (req, res) => {
  const customer = req.user.userId;
  if (customer) {
    const customerOrders = await Order.find({
      orderedBy: customer,
      orderStatus: "pending",
    })
      .populate("items.food")
      .populate("store", { storeName: 1, storeImage: 1 })
      .sort({ createdAt: "desc" })
      .exec();

    if (!customerOrders) {
      return res.status(404).json({ msg: `order not available` });
    }
    return res.status(200).json(customerOrders);
  }
  return res.status(400).json({ msg: `error getting customer orders` });
};

//get all waiting  orders
const getWaitingOrders = async (req, res) => {
  const customer = req.user.userId;
  if (customer) {
    const customerOrders = await Order.find({
      orderedBy: customer,
      orderStatus: "waiting",
    })
      .populate("items.food")
      .populate("store", { storeName: 1, storeImage: 1 })
      .sort({ createdAt: "desc" })
      .exec();
    if (!customerOrders) {
      return res.status(404).json({ msg: `order not available` });
    }
    return res.status(200).json(customerOrders);
  }
  return res.status(400).json({ msg: `error getting customer orders` });
};

//get customers order by id
const getOrderById = async (req, res) => {
  const { id: orderId } = req.params;
  const customer = req.user.userId;
  if (customer) {
    const customerOrder = await Order.findOne({ _id: orderId })
      .populate("items.food")
      .populate("store", { storeName: 1, storeImage: 1 });

    if (!customerOrder) {
      return res.status(404).json({ msg: `customer order not found` });
    }
    return res.status(200).json(customerOrder);
  }
  return res.status(400).json({ msg: `error getting customer order` });
};

//delete order
const deleteOrder = async (req, res) => {
  const { id: deleteId } = req.params;
  const customer = req.user.userId;
  if (customer) {
    const customerOrderDelete = await Customer.findOne({ _id: customer });
    if (!customerOrderDelete) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: `this is not your order` });
    }

    const orderDeleted = await Order.findByIdAndDelete({ _id: deleteId });
    return res
      .status(StatusCodes.OK)
      .json({ msg: `order successfully deleted` });
  }
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ msg: `error deleting order` });
};

//update order controller
const updateOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const { paymentIntentId } = req.body;
  const order = await Order.findById({ _id: orderId });
  if (!order) {
    return res.status(200).json({ msg: `No order with id : ${orderId}` });
  }

  order.paymentIntentId = paymentIntentId;
  order.status = "paid";
  await order.save();

  return res.status(200).json(order);
};

module.exports = {
  createTransactionOrder,
  getOrders,
  getOrderById,
  deleteOrder,
  updateOrder,
  getCustomerOrders,
  getPendingOrders,
  getCompletedOrders,
  getWaitingOrders,
};
