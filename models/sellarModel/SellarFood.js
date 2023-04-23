const mongoose = require("mongoose");

const SellarFoodSchema = new mongoose.Schema(
  {
    foodImage: {
      type: String,
    },
    foodName: {
      type: String,
      required: [true, "provide food name"],
    },
    price: {
      type: Number,
      required: [true, "provide food price"],
    },
    nutritionalFacts: {
      type: String,
      required: [true, "provide nutritional facts of food"],
    },
    shortInfo: {
      type: String,
    },
    foodavailable: { type: Boolean, default: false },
    menu: {
      type: mongoose.Types.ObjectId,
      ref: "Menu",
    },
    storeOwner: {
      type: mongoose.Types.ObjectId,
      ref: "StoreDetails",
    },
    sellar: {
      type: mongoose.Types.ObjectId,
      ref: "Sellar",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SellarFood", SellarFoodSchema);
