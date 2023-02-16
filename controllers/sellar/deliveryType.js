const { StatusCodes } = require("http-status-codes");
const DeliveryType = require("../../models/sellarModel/DeliveryType");

//create business information
const deliveryType = async (req, res) => {
  const { deliveryType, type } = req.body;
  const sellar = req.user.userId;

  if (sellar) {
    const delivery = await DeliveryType.create({
      deliveryType,
      type,
      storeOwner: sellar,
    });

    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "delivery Type created successfully", delivery });
  }
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ msg: "error in delivery Type" });
};

module.exports = { deliveryType };
