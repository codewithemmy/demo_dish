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
    BankAccount: { type: String },
    insuranceNo: { type: String },
    deliveryInsuranceNo: { type: String },
    driverLicenseNo: { type: String },
    rider: {
      type: mongoose.Schema.ObjectId,
      ref: "Rider",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Registration", RegistrationSchema);
