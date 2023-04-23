const mongoose = require("mongoose");

const StoreInfoSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: [true, "provide store phone number"],
    },
    foodCuisineOffer: {
      type: String,
      required: [true, "provide the food cuisine you offer"],
    },
    pickUpInstruction: {
      type: String,
      required: [true, "provide how couriers should pick order"],
    },
    dayOfOpen: {
      type: String,
      required: [true, "provide your day of open after setup"],
    },
    sellar: {
      type: mongoose.Types.ObjectId,
      ref: "Sellar",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StoreInfo", StoreInfoSchema);
