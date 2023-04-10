const mongoose = require("mongoose");

const CustomerAddressSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: [true, "provide your orderId"],
    },
    name: {
      type: String,
    },
    phoneNumber: {
      type: String,
      required: [true, "provide your phone number"],
    },
    flatNumber: {
      type: String,
    },
    city: {
      type: String,
    },
    fullAddress: {
      type: String,
      required: [true, "provide your full adrress"],
    },
    lat: {
      type: Number,
    },
    lng: {
      type: Number,
    },
    customer: {
      type: mongoose.Types.ObjectId,
      ref: "Customer",
      required: [true, "Please provide customer"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CustomerAddress", CustomerAddressSchema);
