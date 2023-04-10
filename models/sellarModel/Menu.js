const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema(
  {
    menuTitle: { type: String, required: [true, "provide menu name"] },
    description: { type: String, required: [true, "provide menu description"] },
    storeOwner: {
      type: mongoose.Types.ObjectId,
      ref: "Sellar",
    },
    store: {
      type: mongoose.Types.ObjectId,
      ref: "StoreDetails",
    },
    food: [
      {
        type: mongoose.Types.ObjectId,
        ref: "SellarFood",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Menu", MenuSchema);
