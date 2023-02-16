const mongoose = require("mongoose");

const DeliveryTypeSchema = new mongoose.Schema(
  {
    deliveryType: {
      type: String,
      required: [true, "provide your delivery type"],
    },
    type: {
      type: String,
    },
    storeOwner: {
      type: mongoose.Schema.ObjectId,
      ref: "Sellar",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DeliveryType", DeliveryTypeSchema);
