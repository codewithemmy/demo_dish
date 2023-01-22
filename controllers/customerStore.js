const { StatusCodes } = require("http-status-codes");
const StoreDetails = require("../models/StoreDetails");

//get menu
const getStore = async (req, res) => {
  const store = await StoreDetails.find();
  return res.status(StatusCodes.OK).json(store);
};

module.exports = { getStore };
