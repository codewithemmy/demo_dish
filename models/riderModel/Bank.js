const mongoose = require("mongoose");

const BankSchema = new mongoose.Schema(
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
    riderId: {
      type: mongoose.Types.ObjectId,
      ref: "Rider",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bank", BankSchema);
