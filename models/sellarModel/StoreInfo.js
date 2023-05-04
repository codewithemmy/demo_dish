const mongoose = require("mongoose");

const StoreInfoSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
    },
    foodCuisineOffer: {
      type: String,
    },
    pickUpInstruction: {
      type: String,
    },
    dayOfOpen: {
      type: String,
    },
    sellar: {
      type: mongoose.Types.ObjectId,
      ref: "Sellar",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StoreInfo", StoreInfoSchema);
