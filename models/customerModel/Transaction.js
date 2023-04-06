const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.ObjectId,
      ref: "Customer",
    },
    storeId: {
      type: mongoose.Schema.ObjectId,
      ref: "StoreDetails",
    },
    orderId: {
      type: mongoose.Schema.ObjectId,
      ref: "Order",
    },
    ridersFee: { type: Number },
    amount: {
      type: Number,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
    TransactionStatus: {
      type: String,
      default: "pending",
      enum: ["failed", "succeeded", "pending", "canceled"],
    },
    paymentFor: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", TransactionSchema);
