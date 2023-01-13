const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema(
  {
    menuName: {
      type: String,
      required: [true, "provide the store menu name"],
    },
    food: { type: String },
    storeOwner: {
      type: mongoose.Types.ObjectId,
      ref: "Sellar",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Menu", MenuSchema);
