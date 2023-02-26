const { StatusCodes } = require("http-status-codes");
const StoreDetails = require("../../models/sellarModel/StoreDetails");
const Food = require("../../models/sellarModel/Food");

//get store
const getStore = async (req, res) => {
  const store = await StoreDetails.find();
  return res.status(StatusCodes.OK).json(store);
};

//get food
const getFood = async (req, res) => {
  const food = await Food.find({});
  return res.status(StatusCodes.CREATED).json(food);
};

module.exports = { getStore, getFood };
