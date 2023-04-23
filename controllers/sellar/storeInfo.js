const { StatusCodes } = require("http-status-codes");
const StoreInfo = require("../../models/sellarModel/StoreInfo");

//create store details
const createStoreInfo = async (req, res) => {
  const sellar = req.user.userId;

  if (sellar) {
    const { phoneNumber, foodCuisineOffer, pickUpInstruction, dayOfOpen } =
      req.body;
    const sellarInfo = await StoreInfo.create({
      phoneNumber,
      foodCuisineOffer,
      pickUpInstruction,
      dayOfOpen,
      sellar: sellar,
    });

    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "store inforomation successfully created", sellarInfo });
  }

  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ msg: "error creating store inforomation" });
};

//edit store information
const editStoreInfo = async (req, res) => {
  const { id: storeInfoId } = req.params;
  const sellar = req.user.userId;

  if (sellar) {
    const { phoneNumber, foodCuisineOffer, pickUpInstruction, dayOfOpen } =
      req.body;
    const updateStoreInfo = await StoreInfo.findById(storeInfoId);
    if (!updateStoreInfo) {
      return res.status(StatusCodes.NOT_FOUND).json({
        msg: "Store information Id not found",
      });
    }

    updateStoreInfo.phoneNumber = phoneNumber;
    updateStoreInfo.foodCuisineOffer = foodCuisineOffer;
    updateStoreInfo.pickUpInstruction = pickUpInstruction;
    updateStoreInfo.dayOfOpen = dayOfOpen;

    const result = await updateStoreInfo.save();

    return res.status(StatusCodes.CREATED).json({
      msg: "Store has been created successfully",
      result,
    });
  }
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ msg: "error in creating store information" });
};

//delete store Infor
const deleteStoreInfo = async (req, res) => {
  const { id: storeInfoId } = req.params;
  const sellar = req.user.userId;

  if (sellar) {
    const storeInfo = await StoreInfo.findByIdAndRemove({
      _id: storeInfoId,
    });

    return res.status(StatusCodes.CREATED).json({
      msg: "Store Information has been deleted",
    });
  }
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ msg: "error in deleting store information" });
};

const getStoreInfo = async (req, res) => {
  const sellar = req.user.userId;
  if (sellar) {
    const storeInfo = await StoreInfo.find({ storeOwner: sellar });
    return res.status(StatusCodes.OK).json(storeInfo);
  }
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ msg: "error getting store information" });
};

module.exports = {
  createStoreInfo,
  editStoreInfo,
  deleteStoreInfo,
  getStoreInfo
};
