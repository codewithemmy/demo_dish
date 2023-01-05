const mongoose = require("mongoose");

const PartnerSchema = new mongoose.Schema(
  {
    delivery: {
      type: String,
      required: [true, "provide delivery option"],
    },
    StoreOwner: {
      type: mongoose.Types.ObjectId,
      ref: "Sellar",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Partner", PartnerSchema);
