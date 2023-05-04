const stripe = require("stripe")(process.env.STRIPE_KEY);

const stripeTransfer = async (
  bankName,
  accountNumber,
  recipient,
  routingNumber,
  walletAmount,
  accountType,
  currency = "gbp"
) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: walletAmount,
    currency: currency,
  });

  // create a transfer to the rider's bank account
  const transfer = await stripe.transfers.create({
    amount: walletAmount,
    currency: currency,
    source_transaction: paymentIntent.id,
    transfer_group: paymentIntent.id,
    destination: {
      type: "bank_account",
      account: {
        account_number: accountNumber,
        routing_number: routingNumber, // Replace with the routing number of the bank
        account_holder_name: recipient,
        account_holder_type: accountType,
        // set the bank name as metadata
        metadata: {
          bank_name: bankName,
        },
      },
    },
  });

  res.json({ clientSecret: paymentIntent.client_secret });

  return transfer;

  // TODO: update rider's balance in your database
};

module.exports = { stripeTransfer };
