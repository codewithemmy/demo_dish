const mongoose = require("mongoose");

const SellarTransactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["Failed", "Succeeded", "Pending", "Canceled"],
      default: "Pending",
    },
    sellar: {
      type: mongoose.Types.ObjectId,
      ref: "Sellar",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SellarTransaction", SellarTransactionSchema);
