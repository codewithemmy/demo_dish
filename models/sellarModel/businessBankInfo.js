const mongoose = require("mongoose");

const BusinessBankingInfoSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, "provide your fullname"],
    },
    bankName: {
      type: String,
    },
    bankAccountNumber: {
      type: String,
    },
    sortCode: {
      type: String,
    },
    storeOwner: {
      type: mongoose.Schema.ObjectId,
      ref: "Sellar",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "BusinessBankingInfo",
  BusinessBankingInfoSchema
);
