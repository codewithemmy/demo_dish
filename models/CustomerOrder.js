const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    orderID: { type: String, required: true },
    items: [
      {
        food: {
          type: mongoose.Schema.ObjectId,
          ref: "Food",
          required: [true, "provide food ID"],
        },
        quantity: { type: Number, required: true },
      },
    ],
    orderedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "Customer",
      required: [true, "Provide customer Id"],
    },
    totalAmount: { type: Number },
    orderDate: { type: Date },
    paymentResponse: { type: String },
    marketPlace: { type: Number, default: 2.99 },
    deliveryFee: { type: Number, default: 2.0 },
    orderStatus: {
      type: String,
      enum: ["pending", "failed", "paid", "delivered", "canceled"],
      default: "pending",
    },
    clientSecret: {
      type: String,
    },
    paymentIntentId: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
