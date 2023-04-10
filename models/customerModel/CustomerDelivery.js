const mongoose = require("mongoose");

const CustomerDeliverySchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: [`please, provide your accessible address`],
    },
    language: { type: String },
    paymentType: { type: String },
    deliveryType: {
      type: String,
      required: [true, "provide menu name"],
      enum: ["pick-up", "rider"],
      default: "rider",
    },
    customer: {
      type: mongoose.Types.ObjectId,
      ref: "Customer",
      required: [true, "Please provide customer"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CustomerDelivery", CustomerDeliverySchema);
