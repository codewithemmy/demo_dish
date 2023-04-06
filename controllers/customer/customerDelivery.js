const CustomerDelivery = require("../../models/customerModel/CustomerDelivery");
const { StatusCodes } = require("http-status-codes");

// create delivery post
const createDelivery = async (req, res) => {
  const customer = req.user.userId;
  if (customer) {
    const { address, language, paymentType, deliveryType } = req.body;
    if (!address && !deliveryType) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: `address and delivery should not be empty` });
    }

    const customerDelivery = await CustomerDelivery.create({
      address,
      language,
      paymentType,
      deliveryType,
      customer: customer,
    });

    return res
      .status(StatusCodes.CREATED)
      .json({ msg: `delivery created successfully`, customerDelivery });
  }

  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ msg: `error while creating customer delivery` });
};

//get delivery type
const getDeliveryType = async (req, res) => {
  const customer = req.user.userId;
  if (customer) {
    const getDelivery = await CustomerDelivery.find({ customer: customer });
    return res.status(StatusCodes.OK).json(getDelivery);
  }
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ msg: `cannot get delivery` });
};

//update delivery type
const updateDeliveryType = async (req, res) => {
  const { id: deliveryId } = req.params;
  const customer = req.user.userId;
  if (customer) {
    const getDelivery = await CustomerDelivery.find({ _id: deliveryId });
    if (!getDelivery) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: `cannot identify id: ${deliveryId}` });
    }

    //update customer delivery post
    const result = await CustomerDelivery.findByIdAndUpdate(
      { _id: deliveryId },
      req.body,
      { new: true, runValidators: true }
    );
    return res.status(StatusCodes.OK).json(result);
  }
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ msg: `cannot update delivery` });
};

module.exports = { createDelivery, getDeliveryType, updateDeliveryType };
