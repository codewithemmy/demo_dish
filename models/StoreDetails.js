
const mongoose = require("mongoose");

const StoreDetailsSchema = new mongoose.Schema(
  {
    phonenumber: {
      type: String,
      required: [true, "provide your phonenumber"],
    },
    cuisineType: {
      type: String,
      required: [true, "provide your cuisines"],
    },
    StoreOwner: {
      type: mongoose.Types.ObjectId,
      ref: "Sellar",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StoreDetails", StoreDetailsSchema);
