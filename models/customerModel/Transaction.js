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
        quantity: { type: Number, required: true },
      },
    ],
    quantity: { type: Number },
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
    transactionStatus: {
      type: String,
      default: "pending",
      enum: ["Failed", "Succeeded", "Pending", "Canceled"],
    },
    paymentFor: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", TransactionSchema);
