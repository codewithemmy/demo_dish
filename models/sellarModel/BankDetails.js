const mongoose = require("mongoose");

const BankDetailsSchema = new mongoose.Schema(
  {
    accountname: {
      type: String,
      required: [true, "provide your fullname"],
    },
    bankname: {
      type: String,
    },
    accountnumber: {
      type: String,
    },
    sortcode: {
      type: String,
    },
    accounttype: { type: String },
    routingnumber: { type: String },
    sellar: {
      type: mongoose.Types.ObjectId,
      ref: "Sellar",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BankDetails", BankDetailsSchema);
