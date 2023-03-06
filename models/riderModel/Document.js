const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema(
  {
    compRegCert: {
      type: String,
    },
    passportId: {
      type: String,
    },
    taxDocument: { type: String },
    rider: {
      type: mongoose.Schema.ObjectId,
      ref: "Rider",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Document", DocumentSchema);
