const { StatusCodes } = require("http-status-codes");
const StoreDetails = require("../../models/sellarModel/StoreDetails");
const Customer = require("../../models/customerModel/Customer");
const SellarFood = require("../../models/sellarModel/SellarFood");

//get store
const getStore = async (req, res) => {
  const store = await StoreDetails.find().sort({ createdAt: "desc" }).exec();
  return res.status(StatusCodes.OK).json(store);
};

//get food
const getFood = async (req, res) => {
  const food = await SellarFood.find({ foodavailable: true })
    .sort({ createdAt: "desc" })
    .exec();
  return res.status(StatusCodes.CREATED).json(food);
};

//create location
const getCustomerLocation = async (req, res) => {
  const { lng, lat } = req.body;
  const customerId = req.params.id;
  if (customerId) {
    const customer = await Customer.findByIdAndUpdate(
      { _id: customerId },
      {
        location: {
          type: "Point",
          coordinates: [parseFloat(lng), parseFloat(lat)],
        },
      },
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
