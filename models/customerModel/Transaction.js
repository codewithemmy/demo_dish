const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    customerId: {
      type: mongoose.Types.ObjectId,
      ref: "Customer",
    },
    item: [
      {
        food: {
          type: mongoose.Types.ObjectId,
          ref: "SellarFood",
        },
        quantity: { type: Number },
      },
    ],

    currency: { type: String },
    orderId: {
      type: mongoose.Types.ObjectId,
      ref: "Order",
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    TransactionStatus: {
      type: String,
      default: "pending",
      // enum: ["failed", "succeeded", "pending", "canceled"],
    },
    paymentFor: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", TransactionSchema);
