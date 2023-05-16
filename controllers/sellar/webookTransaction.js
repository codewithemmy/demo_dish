const WebhookTransaction = require("../../models/customerModel/WebhookTransaction");
const stripe = require("stripe")(process.env.STRIPE_KEY);

// Endpoint for Stripe webhooks
const webhookController = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  event = stripe.webhooks.constructEvent(
    request.body,
    sig,
    process.env.WEBHOOK_SECRET
  );

  // Handle the event
  switch (event.type) {
    case "payment_intent.canceled":
      const paymentIntentCanceled = event.data.object;

      await WebhookTransaction.findOneAndUpdate(
        { transactionId: paymentIntentCanceled.id },
        {
          currency: paymentIntentCanceled.currency,
          amount: paymentIntentCanceled.amount,
          TransactionStatus: "canceled",
        },
        { new: True, runValidators: true }
      );

      break;

    case "payment_intent.created":
      const paymentIntentCreated = event.data.object;

      // Then define and call a function to handle the event payment_intent.created
      await WebhookTransaction.create({
        transactionId: paymentIntentCreated.id,
        currency: paymentIntentCreated.currency,
        amount: paymentIntentCreated.amount,
        TransactionStatus: "pending",
      });

      break;

    case "payment_intent.payment_failed":
      const paymentIntentPaymentFailed = event.data.object;
      await WebhookTransaction.findOneAndUpdate(
        { transactionId: paymentIntentPaymentFailed.id },
        {
          currency: paymentIntentPaymentFailed.currency,
          amount: paymentIntentPaymentFailed.amount,
          TransactionStatus: "failed",
        },
        { new: True, runValidators: true }
      );

      break;
    case "payment_intent.succeeded":
      const paymentIntentSucceeded = event.data.object;
      await WebhookTransaction.findOneAndUpdate(
        { transactionId: paymentIntentSucceeded.id },
        {
          currency: paymentIntentSucceeded.currency,
          amount: paymentIntentSucceeded.amount,
          TransactionStatus: "success",
        },
        { new: True, runValidators: true }
      );
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
