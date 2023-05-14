const mongoose = require("mongoose");

const RiderTransactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["Failed", "Succeeded", "Pending", "Canceled"],
      default: "Pending",
    },
    rider: {
      type: mongoose.Types.ObjectId,
      ref: "Rider",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RiderTransaction", RiderTransactionSchema);
