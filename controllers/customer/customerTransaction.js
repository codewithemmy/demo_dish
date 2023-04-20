const Transaction = require("../../models/customerModel/Transaction");
const Order = require("../../models/customerModel/CustomerOrder");
const stripe = require("stripe")(process.env.STRIPE_KEY);
const { mailTransport } = require("../../utils/sendEmail");

//const create payment intent
const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency } = req.body;

    if (!amount && !currency) {
      return res.status(200).json({ msg: `fields must not be empty` });
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });

    return res.status(200).json({
      // clientSecret: paymentIntent.client_secret,
      // transactionId: paymentIntent.id,
    });
  } catch (error) {
    return res.status(200).json(error);
  }
};

//post transaction response and update orders status
const updateTransaction = async (req, res) => {
  const order = await Order.findOne({ _id: req.body.orderId });

  if (!order) {
    return res.status(200).json({ msg: `invalid order Id` });
  }

  const transaction = await Transaction.create({
    ...req.body,
    customerId: req.user.userId,
  });

  //update order with the transaction id
  order.transaction = transaction._id;
  order.paymentStatus = "paid";

  await order.save();

  if (req.body.transactionStatus === "success") {
    //send Mail
    mailTransport.sendMail({
      from: '"Afrilish" <afrilish@afrilish.com>', // sender address
      to: req.user.email, // list of receivers
      subject: "YOUR ORDER CODE", // Subject line
      html: `Hello, this is you order code: ${order.orderCode} upon delivery. Have a nice meal</h4>`, // html body
    });
  }
  return res
    .status(200)
    .json({ msg: "transaction successfully created/updated" });
};

module.exports = {
  updateTransaction,
  createPaymentIntent,
};
