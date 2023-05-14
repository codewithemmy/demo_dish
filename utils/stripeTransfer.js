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
      account: `${accountNumber}`,
      account_holder_name: `${recipient}`,
      account_holder_type: `${accountType}`,
      bank_name: `${bankName}`,
      routing_number: `${routingNumber}`,
      default_for_currency: true,
    },
  });

  res.json({ clientSecret: paymentIntent.client_secret });

  return transfer;
};

module.exports = { stripeTransfer };
