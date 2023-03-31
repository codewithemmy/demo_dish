const Order = require("../../models/customerModel/CustomerOrder");
const Customer = require("../../models/customerModel/Customer");
const StoreDetails = require("../../models/sellarModel/StoreDetails");
const Food = require("../../models/sellarModel/Food");
const { StatusCodes } = require("http-status-codes");
const stripe = require("stripe")(process.env.STRIPE_KEY);

// Helper function to convert degrees to radians
function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

//create order
const createOrder = async (req, res) => {
  //grab the login customer
  const customer = req.user;
  if (customer) {
    //get the store id
    const storeId = req.params.id;
    //get the store and customer using findOne
    const store = await StoreDetails.findOne({ _id: storeId });

    const customerCoordinates = await Customer.findOne({
      _id: customer.userId,
    });

    const customerlng = customerCoordinates.location.coordinates[0];
    const customerlat = customerCoordinates.location.coordinates[1];
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

    // console.log(
    //   `The distance between the two locations is ${distance.toFixed(
    //     2
    //   )} kilometers.`
    // );

    const kilometers = distance.toFixed(2);

    let ridersFee = kilometers * 2;

    //get the store location type and coordinates
    const locationType = store.location.type;
    const locationCoordinates = store.location.coordinates;

    //create an Order Id
    const orderId = `${Math.floor(Math.random() * 89999) + 1000}`;

    const profile = await Customer.findById(customer.userId);
    //grab order items from request [{id: xx, unit: xx}]
    const cart = req.body; //[{ id: xx, quantity: xx }];
    let cartItems = Array();
    let netAmount = 0.0;

    let sellarId;

    //calculate order amount
    const foods = await Food.find()
      .where("_id")
      .in(cart.map((item) => item._id))
      .exec();

    foods.map((food) => {
      cart.map(({ _id, quantity }) => {
        if (food._id == _id) {
          sellarId = food.storeOwner;
          netAmount += food.price * quantity;
          cartItems.push({ food, quantity });
        }
      });
    });

    const deliveryFee = 2;
    const marketPlace = 3;

    const totalPrice = netAmount + deliveryFee + marketPlace;

    // get client secret

    //create order with item description
    if (cartItems) {
      // use stripe calculation
      const calculateOrderAmount = () => {
        return totalPrice;
      };

      const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmount(),
        currency: "gbp",
      });

      let serviceCharge = (10 * totalPrice) / 100;

      console.log(paymentIntent);

      //create order
      const currentOrder = await Order.create({
        orderID: orderId,
        items: cartItems,
        orderedBy: customer.userId,
        totalAmount: totalPrice,
        orderDate: new Date(),
        paymentResponse: "",
        location: {
          type: locationType,
          coordinates: locationCoordinates,
        },
        store: storeId,
        ridersFee,
        serviceCharge,
        sellarId,
        clientSecret: "paymentIntent.client_secret",
        readyTime: "",
        remarks: "",
      });

      if (currentOrder) {
        profile.orders.push(currentOrder);
        const profileResponse = await profile.save();

        return res
          .status(200)
          .json({ currentOrder, clientSecret: paymentIntent.client_secret });
      }
    }
    return res.status(400).json({ msg: "Your cart is empty" });
    //finally update orders to user account
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
    return res.status(200).json(customerOrders.orders);
  }
  return res.status(400).json({ msg: `error getting customer orders` });
};

//get customers order by id
const getOrderById = async (req, res) => {
  const { id: orderId } = req.params;
  const customer = req.user.userId;
  if (customer) {
    const customerOrder = await Order.findOne({ _id: orderId });
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

const confirmDelivery = async (req, res) => {
  const deliveryId = req.params.id;
  const { confirmDelivery } = req.body;
  const customer = req.user.userId;

  if (customer) {
    const order = await Order.findById({ _id: deliveryId });
    if (!order) {
      return res.status(200).json({ msg: `No order with id : ${deliveryId}` });
    }

    order.confirmDelivery = confirmDelivery;
    const result = await order.save();

    return res.status(200).json(result);
  }
  return res.status(400).json({ msg: `unable to confirm delivery` });
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  deleteOrder,
  updateOrder,
  confirmDelivery,
};
