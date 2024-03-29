const { StatusCodes } = require("http-status-codes");
const BusinessInfo = require("../../models/sellarModel/BusinessInfo");

//create business information
const createBusiness = async (req, res) => {
  const {
    legalEntityName,
    legalBusinessAddress,
    bankName,
    bankAcountName,
    bankAccountNumber,
  } = req.body;
  const sellar = req.user.userId;

  if (
    !legalEntityName ||
    !legalBusinessAddress ||
    !bankName ||
    !bankAcountName ||
    !bankAccountNumber
  ) {
    return res
      .status(400)
      .json({ msg: `provide legal entity name or legal business name` });
  }

  if (sellar) {
    const businessInfo = await BusinessInfo.create({
      legalEntityName: legalEntityName,
      legalBusinessAddress: legalBusinessAddress,
      bankName: bankName,
      bankAcountName: bankAcountName,
      bankAccountNumber: bankAccountNumber,
      sellar: sellar,
    });

    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "Business information created successfully", businessInfo });
  }
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ msg: "error in creating business information" });
};

//edit business information
const editBusiness = async (req, res) => {
  const { id: businessId } = req.params;
  const sellar = req.user.userId;

  if (sellar) {
    const editBusinessInfo = await BusinessInfo.findByIdAndUpdate(
      {
        _id: businessId,
        storeOwner: sellar,
      },
      req.body,
      { new: true, runValidators: true }
    );

    return res.status(StatusCodes.CREATED).json({
      msg: "Business information created successfully",
      editBusinessInfo,
    });
  }
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ msg: "error in creating business information" });
};

module.exports = { createBusiness, editBusiness };
