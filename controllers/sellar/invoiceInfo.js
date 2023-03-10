const { StatusCodes } = require("http-status-codes");
const InvoiceInfo = require("../../models/sellarModel//InvoiceInfo");

//create business bank information
const createInvoiceInfo = async (req, res) => {
  const {
    comapanyLegalName,
    streetAddress,
    townOrCity,
    postCode,
    vatRegNo,
    companyRegNumber,
  } = req.body;
  const sellar = req.user.userId;

  if (
    !comapanyLegalName ||
    !streetAddress ||
    !townOrCity ||
    !postCode ||
    !vatRegNo ||
    !companyRegNumber
  ) {
    return res.status(400).json({ msg: `No field should be empty` });
  }

  if (sellar) {
    const invoiceInfo = await InvoiceInfo.create({
      comapanyLegalName,
      streetAddress,
      townOrCity,
      postCode,
      vatRegNo,
      companyRegNumber,
      storeOwner: sellar,
    });

    return res.status(StatusCodes.CREATED).json({
      msg: "Invoice Information created successfully",
      invoiceInfo,
    });
  }
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ msg: "error in creating Invoice Information" });
};

//update Invoice information
const updateInvoiceInfo = async (req, res) => {
  const { id: invoiceInfoId } = req.params;
  const sellar = req.user.userId;

  if (sellar) {
    const invoiceInfo = await InvoiceInfo.findByIdAndUpdate(
      {
        _id: invoiceInfoId,
        storeOwner: sellar,
      },
      req.body,
      { new: true, runValidators: true }
    );

    return res.status(StatusCodes.CREATED).json({
      msg: "Invoice Information updated successfully",
      invoiceInfo,
    });
  }
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ msg: "error in updating bInvoice Information" });
};

module.exports = { createInvoiceInfo, updateInvoiceInfo };
