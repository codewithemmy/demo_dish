const mongoose = require("mongoose");

const InvoiceInfoSchema = new mongoose.Schema(
  {
    comapanyLegalName: {
      type: String,
      required: [true, "provide the company legal name"],
    },
    streetAddress: {
      type: String,
      required: [true, "provide the street address"],
    },
    townOrCity: {
      type: String,
      required: [true, "provide the town/city"],
    },
    postCode: {
      type: String,
    },
    vatRegNo: {
      type: String,
      required: [true, "provide the Vat Reg Number"],
    },
    companyRegNumber: {
      type: String,
      required: [true, "provide the Company Reg Number"],
    },
    storeOwner: {
      type: mongoose.Types.ObjectId,
      ref: "Sellar",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("InvoiceInfo", InvoiceInfoSchema);
