const Order = require("../models/CustomerOrder");
const Customer = require("../models/Customer");
const Food = require("../models/Food");

//create order
const CreateOrder = async (req, res) => {

  //grab the login customer
  const customer = req.user;
  if (customer) {
    //create an Order Id
    const orderId = `${Math.floor(Math.random() * 89999) + 1000}`;

    const profile = await Customer.findById(customer.userId);
    //grab order items from request [{id: xx, unit: xx}]
    const cart = req.body; //[{ id: xx, quantity: xx }];
    let cartItems = Array();
    let netAmount = 0.0;

    //calculate order amount
    const foods = await Food.find()
      .where("_id")
      .in(cart.map((item) => item._id))
      .exec();

    foods.map((food) => {
      cart.map(({ _id, quantity }) => {
        if (food._id == _id) {
          netAmount += food.price * quantity;
          cartItems.push({ food, quantity });
        }
      });
    });

    //create order with item description
    if (cartItems) {
      //create order

      const currentOrder = await Order.create({
        orderID: orderId,
        items: cartItems,
        totalAmount: netAmount,
        orderDate: new Date(),
        paymentResponse: "",
        orderStatus: "pending",
      });

      if (currentOrder) {
        profile.orders.push(currentOrder);
        const profileResponse = await profile.save();

        return res.status(200).json(currentOrder);
      }
    }
    //finally update orders to user account
  }
  return res.status(400).json({ msg: "error with creating order" });
};

module.exports = { CreateOrder };
