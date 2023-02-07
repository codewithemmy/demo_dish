const mongoose = require("mongoose");

const BusinessInfoSchema = new mongoose.Schema(
  {
    legalEntityName: {
      type: String,
      required: [true, "provide a legal business entity name"],
    },
    legalBusinessAddress: {
      type: String,
      required: [true, "provide legal business name"],
    },
    bankName: {
      type: String,
      required: [true, "provide Bank name"],
    },
    bankAcountName: {
      type: String,
      required: [true, "provide bank account name"],
    },
    bankAccountNumber: {
      type: String,
      required: [true, "provide your account number"],
    },
    storeOwner: {
      type: mongoose.Schema.ObjectId,
      ref: "Sellar",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BusinessInfo", BusinessInfoSchema);
