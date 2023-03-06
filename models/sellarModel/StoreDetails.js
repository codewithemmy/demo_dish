const mongoose = require("mongoose");

const StoreDetailsSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      required: [true, "provide the store name"],
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
      required: [true, "provide your cuisines"],
    },
    deliveryFee: {
      type: String,
      required: [true, "provide your delivery fee"],
    },
    minimumOrder: {
      type: String,
      required: [true, "provide your minimum order"],
    },
    description: {
      type: String,
      required: [true, "description must not be empty"],
    },
    rating: { type: Number },
    openHours: {
      type: String,
      trim: true,
      required: [true, "provide hours store is open"],
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
