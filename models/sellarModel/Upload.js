const mongoose = require("mongoose");

const UploadSchema = new mongoose.Schema(
  {
    document: {
      type: String,
    },
    type: {
      type: String,
    },
    sellar: {
      type: mongoose.Schema.ObjectId,
      ref: "Sellar",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Upload", UploadSchema);
