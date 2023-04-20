const mongoose = require("mongoose");

const WebhookTransactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    currency: {
      type: String,
    },
    amount: {
      type: Number,
    },
    // customer: {
    //   type: String,
    //   required: true,
    // },
    TransactionStatus: {
      type: String,
      default: "pending",
      enum: ["failed", "success", "pending", "canceled"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WebhookTransaction", WebhookTransactionSchema);
