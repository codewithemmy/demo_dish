const { StatusCodes } = require("http-status-codes");
const StoreDetails = require("../../models/sellarModel/StoreDetails");

//get menu
const getStore = async (req, res) => {
  const store = await StoreDetails.find({}).populate('storeOwner')
  return res.status(StatusCodes.OK).json(store);
};

module.exports = { getStore };
