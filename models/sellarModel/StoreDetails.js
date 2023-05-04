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
    city: {
      type: { type: String },
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
    endDay: {
      type: String,
      trim: true,
    },
    openHour: {
      type: String,
      trim: true,
    },
    openHours: {
      type: String,
      trim: true,
    },
    serviceAvalaible: { type: Boolean, default: false },
    menuId: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Menu",
      },
    ],
    storeOwner: {
      type: mongoose.Types.ObjectId,
      ref: "Sellar",
    },
  },
  { timestamps: true }
);

StoreDetailsSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("StoreDetails", StoreDetailsSchema);
