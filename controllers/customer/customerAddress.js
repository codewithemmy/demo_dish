const CustomerAddress = require("../../models/customerModel/CustomerAddress");
const { StatusCodes } = require("http-status-codes");


//post address
const postAddress = async (req, res) => {
  const customer = req.user.userId;
  if (customer) {
    const {
      orderId,
      name,
      phoneNumber,
      flatNumber,
      city,
      fullAddress,
      lat,
      lng,
    } = req.body;
    if (!fullAddress && !name && !phoneNumber) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: `full address, name and phone number cannot be empty` });
    }

    const customerAddress = await CustomerAddress.create({
      orderId,
      name,
      phoneNumber,
      flatNumber,
      city,
      fullAddress,
      lat,
      lng,
      customer: customer,
    });

    return res.status(StatusCodes.CREATED).json({
      msg: `Address for delivery/order created successfully`,
      customerAddress,
    });
  }

  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ msg: `error while creating customer address` });
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

module.exports = { postAddress };
