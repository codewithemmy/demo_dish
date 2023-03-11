const mongoose = require("mongoose");

const StoreDetailsSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
    },
    storeImage: {
      type: String,
    },
    address: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    location: {
      type: { type: String },
      coordinates: [],
    },
    cuisineType: {
      type: String,
    },
    deliveryFee: {
      type: String,
    },
    minimumOrder: {
      type: String,
    },
    description: {
      type: String,
    },
    rating: { type: Number },
    openHours: {
      type: String,
      trim: true,
    },
    serviceAvalaible: { type: Boolean, default: false },
    storeOwner: {
      type: mongoose.Schema.ObjectId,
      ref: "Sellar",
    },
  },
  { timestamps: true }
);

StoreDetailsSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("StoreDetails", StoreDetailsSchema);
