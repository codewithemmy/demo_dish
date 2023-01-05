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
    StoreOwner: {
      type: mongoose.Types.ObjectId,
      ref: "Sellar",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BusinessInfo", BusinessInfoSchema);
