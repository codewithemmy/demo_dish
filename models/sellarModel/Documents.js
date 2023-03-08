const mongoose = require("mongoose");

const RequiredDocumentsSchema = new mongoose.Schema(
  {
    compRegCert: {
      type: String,
    },
    passportId: {
      type: String,
    },
    taxDocument: { type: String },
    storeOwner: {
      type: mongoose.Schema.ObjectId,
      ref: "Sellar",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RequiredDocuments", RequiredDocumentsSchema);