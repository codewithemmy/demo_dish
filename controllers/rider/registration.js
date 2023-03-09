const Registration = require("../../models/riderModel/Registration");

const createReg = async (req, res) => {
  const {
    workPermit,
    idCard,
    vehicleSerialNo,
    BankAccount,
    insuranceNo,
    deliveryInsuranceNo,
    driverLicenseNo,
  } = req.body;
  const user = req.user;
  if (user) {
    const registration = await Registration.create({
      workPermit,
      idCard,
      vehicleSerialNo,
      BankAccount,
      insuranceNo,
      deliveryInsuranceNo,
      driverLicenseNo,
      rider: user.userId,
    });

    return res.status(200).json({ msg: `document upload successful` });
  }
  return res.status(400).json({ msg: `unable to register` });
};

module.exports = { createReg };
