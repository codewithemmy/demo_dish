const { StatusCodes } = require("http-status-codes");
const BusinessBankInfo = require("../../models/sellarModel/BusinessBankInfo");

//create business bank information
const createBusinessBank = async (req, res) => {
  const { fullname, postCode, bankAccountNumber, sortCode } = req.body;
  const sellar = req.user.userId;

  if (!fullname || !postCode || !bankAccountNumber || !sortCode) {
    return res.status(400).json({ msg: `No field should be empty` });
  }

  if (sellar) {
    const businessBank = await BusinessBankInfo.create({
      fullname,
      postCode,
      bankAccountNumber,
      sortCode,
      storeOwner: sellar,
    });

    return res.status(StatusCodes.CREATED).json({
      msg: "Business Bank information created successfully",
      businessBank,
    });
  }
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ msg: "error in creating business  bank information" });
};

//update business bank information
const updateBusinessBankInfo = async (req, res) => {
  const { id: businessBankId } = req.params;
  const sellar = req.user.userId;

  if (sellar) {
    const businessBank = await BusinessBankInfo.findByIdAndUpdate(
      {
        _id: businessBankId,
        storeOwner: sellar,
      },
      req.body,
      { new: true, runValidators: true }
    );

    return res.status(StatusCodes.CREATED).json({
      msg: "Business bank information updated successfully",
      businessBank,
    });
  }
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ msg: "error in updating business bank information" });
};

module.exports = { createBusinessBank, updateBusinessBankInfo };
