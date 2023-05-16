const stripe = require("stripe")(process.env.STRIPE_KEY);

const stripeTransfer = async (
  accoutName,
  accounType,
  accountNumber,
  bankName,
  amount
) => {
  try {
    // Create a bank account token for Zenith Bank
    const bankAccountToken = await stripe.tokens.create({
      bank_account: {
        country: "NG",
        currency: "NGN",
        account_holder_name: accoutName,
        account_holder_type: accounType,
        account_number: accountNumber,
        bank_name: bankName,
      },
    });

    // Create a transfer to the bank account
    const transfer = await stripe.transfers.create({
      source_transaction: paymentIntent.id,
      amount: amount, // Amount in cents (e.g., ₦10.00)
      currency: "NGN",
      destination: bankAccountToken.id,
      // description: "Transfer for order 123",
    });

    // Handle the created transfer object
    console.log("transfer", transfer);

    return res.send("Transfer created successfully");
  } catch (error) {
    console.error("error", error);
  }
};

module.exports = { stripeTransfer };
