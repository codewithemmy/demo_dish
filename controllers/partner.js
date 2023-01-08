const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require("../errors");
const Partner = require("../models/Partner");

//create partnership
const createPartner = async (req, res) => {
  const { delivery } = req.body;
  const store = req.user.userId;
  if (store) {
    const partner = await Partner.create({
      delivery: delivery,
      storeOwner: store,
    });

    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "partnership created successfully", partner });
  }
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ msg: "error in creating partnership" });
};

//edit partners
const editPartner = async (req, res) => {
  const { id: partnerId } = req.params;
  const { delivery } = req.body;
  const store = req.user.userId;
  if (delivery === "") {
    return res
      .status(StatusCodes.NOT_ACCEPTABLE)
      .json({ msg: "delivery fields should not be empty" });
  }

  const findPartner = await Partner.findById({ _id: partnerId });
  if (!findPartner) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `no partner with the Id ${partnerId}` });
  }
  const editPartner = await Partner.findByIdAndUpdate(
    {
      _id: partnerId,
      storeOwner: store,
    },
    { delivery: delivery },
    { new: true, runValidators: true }
  );

  if (!editPartner) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: `you are not authorized on this route` });
  }

  return res
    .status(StatusCodes.OK)
    .json({ msg: "update successful", editPartner });
};

module.exports = { createPartner, editPartner };
