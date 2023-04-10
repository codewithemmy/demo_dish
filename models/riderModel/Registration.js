const mongoose = require("mongoose");

const RegistrationSchema = new mongoose.Schema(
  {
    workPermit: {
      type: String,
    },
    idCard: {
      type: String,
    },
    vehicleSerialNo: { type: String },
    accountnumber: { type: String },
    insuranceNo: { type: String },
    deliveryInsuranceNo: { type: String },
    driverLicenseNo: { type: String },
    sortcode: { type: String },
    rider: {
      type: mongoose.Types.ObjectId,
      ref: "Rider",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Registration", RegistrationSchema);
