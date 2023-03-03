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
    location: {
      type: String,
      required: [true, "provide your location"],
    },
    cuisineType: {
      type: String,
      required: [true, "provide your cuisines"],
    },
    lng: { type: Number },
    lat: { type: Number },
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

module.exports = mongoose.model("StoreDetails", StoreDetailsSchema);
