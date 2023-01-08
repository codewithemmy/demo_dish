const { StatusCodes } = require("http-status-codes");
const StoreDetails = require("../models/StoreDetails");

//create sotre details
const createStoreDetails = async (req, res) => {
  const { phonenumber, cuisineType } = req.body;
  const sellar = req.user.userId;

  if (!phonenumber || !cuisineType) {
    return res.status(400).json({ msg: `provide phonenumber or cuisineType` });
  }

  if (sellar) {
    const storeDetails = await StoreDetails.create({
      phonenumber: phonenumber,
      cuisineType: cuisineType,
      storeOwner: sellar,
    });

    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "store details created successfully", storeDetails });
  }
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ msg: "error in creating store details" });
};

//edit store details
const editStoreDetails = async (req, res) => {
  const { id: storeDetailsId } = req.params;
  const sellar = req.user.userId;

  if (sellar) {
    const editStoreDetails = await StoreDetails.findByIdAndUpdate(
      {
        _id: storeDetailsId,
        storeOwner: sellar,
      },
      req.body,
      { new: true, runValidators: true }
    );

    return res.status(StatusCodes.CREATED).json({
      msg: "Business information created successfully",
      editStoreDetails,
    });
  }
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ msg: "error in creating business information" });
};

module.exports = { createStoreDetails, editStoreDetails };
