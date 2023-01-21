const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema(
  {
    menuName: { type: String, required: [true, "provide menu name"] },
    storeOwner: {
      type: mongoose.Schema.ObjectId,
      ref: "Sellar",
      required: [true, "Please provide sellar"],
    },
    store: {
      type: mongoose.Schema.ObjectId,
      ref: "StoreDetails",
      required: [true, "Please provide sellar"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Menu", MenuSchema);
