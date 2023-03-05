const { StatusCodes } = require("http-status-codes");
const StoreDetails = require("../../models/sellarModel/StoreDetails");
const Customer = require("../../models/customerModel/Customer");
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

//create location
const getCustomerLocation = async (req, res) => {
  const { lng, lat } = req.body;
  const customerId = req.params.id;
  if (customerId) {
    const customer = await Customer.findByIdAndUpdate(
      { _id: customerId },
      { lng, lat },
      { new: true, runValidators: true }
    );

    return res
      .status(200)
      .json({ msg: `longitude and latitude created successful`, customer });
  }

  return res
    .status(400)
    .json({ msg: `unable to store longitude and latitude` });
};

module.exports = { getStore, getFood, getCustomerLocation };
