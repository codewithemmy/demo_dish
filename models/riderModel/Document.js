const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema(
  {
    document: {
      type: String,
    },
    type: {
      type: String,
    },
    rider: {
      type: mongoose.Schema.ObjectId,
      ref: "Rider",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Document", DocumentSchema);
