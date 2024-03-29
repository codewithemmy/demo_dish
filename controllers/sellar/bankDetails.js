const BankDetails = require("../../models/sellarModel/BankDetails");

//create business bank information

const createBankDetails = async (req, res) => {
  const sellar = req.user.userId;

  if (sellar) {
    const businessBank = await BankDetails.create({
      ...req.body,
      sellar: sellar,
    });

    return res.status(201).json({
      msg: "Business Bank information created successfully",
      businessBank,
    });
  }
  return res
    .status(400)
    .json({ msg: "error in creating business  bank information" });
};

//update business bank information
const updateBusinessBankInfo = async (req, res) => {
  const { id: businessBankId } = req.params;
  const sellar = req.user.userId;

  if (sellar) {
    const businessBank = await BankDetails.findByIdAndUpdate(
      {
        _id: businessBankId,
        storeOwner: sellar,
      },
      req.body,
      { new: true, runValidators: true }
    );

    return res.status(201).json({
      msg: "Business bank information updated successfully",
      businessBank,
    });
  }
  return res
    .status(400)
    .json({ msg: "error in updating business bank information" });
};

module.exports = { createBankDetails, updateBusinessBankInfo };
