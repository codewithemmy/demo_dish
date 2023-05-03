const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    pickUpCode: { type: Number, required: true },
    orderCode: { type: Number, required: true },
    assignedRider: {
      type: mongoose.Types.ObjectId,
      ref: "Rider",
    },
    items: [
      {
        food: {
          type: mongoose.Types.ObjectId,
          ref: "SellarFood",
          required: [true, "provide food ID"],
        },
        quantity: { type: Number, required: true },
      },
    ],
    orderedBy: {
      type: mongoose.Types.ObjectId,
      ref: "Customer",
      required: [true, "Provide customer Id"],
    },
    sellarId: {
      type: mongoose.Types.ObjectId,
      ref: "Sellar",
    },
    store: {
      type: mongoose.Types.ObjectId,
      ref: "StoreDetails",
    },
    totalAmount: { type: Number },
    customerEmail: { type: String },
    customerName: { type: String },
    paymentStatus: {
      type: String,
      enum: ["paid", "pending", "failed"],
      default: "pending",
    },
    orderDate: { type: Date },
    paymentResponse: { type: String },
    ridersFee: { type: Number },
    netAmount: { type: Number },
    marketPlace: { type: Number, default: 2.99 },
    serviceCharge: { type: Number },
    orderStatus: {
      type: String,
      enum: [
        "pending",
        "failed",
        "completed",
        "delivered",
        "canceled",
        "waiting",
      ],
      default: "pending",
    },
    riderStatus: {
      type: String,
      enum: [
        "pending",
        "reject",
        "accepted",
        "completed",
        "delivered",
        "picked",
        "on-road",
      ],
      default: "pending",
    },
    confirmDelivery: {
      type: Boolean,
      default: false,
    },
    remarks: { type: String },
    addNote: { type: String },
    readyTime: { type: String },
    paymentIntentId: {
      type: String,
    },
    transaction: {
      type: mongoose.Types.ObjectId,
      ref: "Transaction",
    },
    location: {
      type: { type: String, require: true },
      coordinates: [],
    },
  },
  { timestamps: true }
);

OrderSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Order", OrderSchema);
