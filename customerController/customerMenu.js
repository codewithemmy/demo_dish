const Menu = require("../models/Menu");
const { StatusCodes } = require("http-status-codes");

//get menu
const getStoreMenu = async (req, res) => {
  const { id: storeId } = req.params;
  const menu = await Menu.find({ store: storeId });
  return res.status(StatusCodes.OK).json(menu);
};

module.exports = { getStoreMenu };
