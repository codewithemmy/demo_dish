const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema(
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
      type: String,
      required: [true, "provide menu id"],
    },
    storeOwner: {
      type: mongoose.Schema.ObjectId,
      ref: "Sellar",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Food", FoodSchema);
