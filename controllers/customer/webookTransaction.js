const WebhookTransaction = require("../../models/customerModel/WebhookTransaction");
const Order = require("../../models/customerModel/CustomerOrder");
const stripe = require("stripe")(process.env.STRIPE_KEY);

// Endpoint for Stripe webhooks
const webhookController = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  event = stripe.webhooks.constructEvent(
    request.body,
    sig,
    process.env.STRIPE_SECRET
  );

  let event;

  // Handle the event
  switch (event.type) {
    case "payment_intent.canceled":
      const paymentIntentCanceled = event.data.object;
      // Then define and call a function to handle the event payment_intent.canceled

      //find order using findOne

      //map order to get transaction id from stripe

      //if order id is true, update transaction to canceled

      await WebhookTransaction.create({
        transactionId: paymentIntentCanceled.id,
        clientSecret: paymentIntentCanceled.client_secret,
        currency: paymentIntentCanceled.currency,
        customer: customer,
        TransactionStatus: "canceled",
      });

      break;
    case "payment_intent.created":
      const paymentIntentCreated = event.data.object;
      // Then define and call a function to handle the event payment_intent.created
      break;
    case "payment_intent.payment_failed":
      const paymentIntentPaymentFailed = event.data.object;
      // Then define and call a function to handle the event payment_intent.payment_failed

      //find order using findOne

      //map order to get transaction id from stripe

      //if order id is true, update transaction to failed
      await WebhookTransaction.create({
        transactionId: paymentIntentCanceled.id,
        clientSecret: paymentIntentCanceled.client_secret,
        currency: paymentIntentCanceled.currency,
        customer: customer,
        TransactionStatus: "failed",
      });

      break;
    case "payment_intent.succeeded":
      const paymentIntentSucceeded = event.data.object;
      // Then define and call a function to handle the event payment_intent.succeeded

      //find order using findOne

      //map order to get transaction id from stripe

      //if order id is true, update transaction to paid or completed

      await WebhookTransaction.create({
        transactionId: paymentIntentCanceled.id,
        clientSecret: paymentIntentCanceled.client_secret,
        currency: paymentIntentCanceled.currency,
        customer: customer,
        TransactionStatus: "success",
      });

      break;
    // ... handle other event types
    default:
      res.status(200).json({ msg: `Unhandled event type ${event.type}` });
  }

  // Return a 200 response to acknowledge receipt of the event
  return res.status(200).json({ msg: `event successfully handled` });
};

module.export = {
  webhookController,
};
