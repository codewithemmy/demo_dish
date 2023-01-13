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
    cuisineType: {
      type: String,
      required: [true, "provide your cuisines"],
    },
    openHours: {
      type: String,
      trim: true,
      required: [true, "provide hours store is open"],
    },
    serviceAvalaible: { type: Boolean },
    storeOwner: {
      type: mongoose.Types.ObjectId,
      ref: "Sellar",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StoreDetails", StoreDetailsSchema);
