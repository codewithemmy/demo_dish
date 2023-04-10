const mongoose = require("mongoose");

const DeliveryTypeSchema = new mongoose.Schema(
  {
    deliveryType: {
      type: String,
      required: [true, "provide your delivery type"],
    },
    type: {
      type: Boolean,
    },
    storeOwner: {
      type: mongoose.Types.ObjectId,
      ref: "Sellar",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DeliveryType", DeliveryTypeSchema);
