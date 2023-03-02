const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    orderID: { type: String, required: true },
    assignedRider: {
      type: mongoose.Schema.ObjectId,
      ref: "Rider",
    },
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
    sellarId: { type: String },
    totalAmount: { type: Number },
    orderDate: { type: Date },
    paymentResponse: { type: String },
    marketPlace: { type: Number, default: 2.99 },
    deliveryFee: { type: Number, default: 2.0 },
    orderStatus: {
      type: String,
      enum: ["pending", "failed", "completed", "delivered", "canceled", "in-progress"],
      default: "pending",
    },
    riderStatus: {
      type: String,
      enum: ["pending", "reject", "accepted", "delivered", "picked", "on-road"],
      default: "pending", 
    },
    confirmDelivery: {
      type: String,
      enum: ["yes", "no", "waiting"],
      default: "no",
    },
    remarks: { type: String },
    readyTime: { type: String },
    paymentIntentId: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
