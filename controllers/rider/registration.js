const Registration = require("../../models/riderModel/Registration");
const Bank = require("../../models/riderModel/Bank");

const createReg = async (req, res) => {
  const user = req.user;
  if (user) {
    await Registration.create({
      ...req.body,
      riderId: user.userId,
    });

    return res.status(200).json({ msg: `successful` });
  }
  return res.status(400).json({ msg: `unable to register` });
};

const createBankDetails = async (req, res) => {
  const rider = req.user.userId;

  if (rider) {
    await Bank.create({
      ...req.body,
      riderId: rider,
    });

    return res.status(201).json({
      msg: "Bank information created successfully",
    });
  }
  return res.status(400).json({ msg: "error in creating  bank information" });
};

module.exports = { createReg, createBankDetails };
