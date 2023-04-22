const { StatusCodes } = require("http-status-codes");
const mongoose = require("mongoose");
const Menu = require("../../models/sellarModel/Menu");
const SellarFood = require("../../models/sellarModel/SellarFood");
const StoreDetails = require("../../models/sellarModel/StoreDetails");

//create menu
const createMenu = async (req, res) => {
  const { menuTitle, description } = req.body;

  const { id: storeId } = req.params;

  const sellar = req.user.userId;

  if (!menuTitle) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: `kindly input your menu title` });
  }

  if (sellar) {
    const createMenu = await Menu.create({
      menuTitle: menuTitle,
      description: description,
      storeOwner: sellar,
      store: storeId,
    });

    const store = await StoreDetails.findOne({
      storeOwner: req.user.userId,
    });

    await StoreDetails.findOneAndUpdate(
      {
        storeOwner: req.user.userId,
      },
      { $push: { menuId: createMenu._id } },
      { new: true, runValidators: true }
    );

    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "Menu Successfully created", createMenu });
  }
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ msg: "error while creating menu" });
};

//edit menu
const editMenu = async (req, res) => {
  const sellar = req.user.userId;
  const menuId = req.params.id;
  const { menuTitle, description } = req.body;

  if (!menuId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: `Invalid/No Id input` });
  }

  if (sellar) {
    const menu = await Menu.findByIdAndUpdate(
      menuId,
      {
        menuTitle: menuTitle,
        description: description,
      },
      { runValidators: true, new: true }
    );

    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "Menu Successfully updated", menu });
  }
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ msg: "error while updating menu" });
};

//delete menu
const deleteMenu = async (req, res) => {
  const { id: deleteId } = req.params;
  const sellar = req.user.userId;

  if (!deleteId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: `Invalid/No Id input` });
  }

  if (sellar) {
    await Menu.findByIdAndDelete({ _id: deleteId });

    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "Menu Successfully deleted" });
  }
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ msg: "error while deleting menu" });
};

//get menu
const getMenu = async (req, res) => {
  const sellar = req.user.userId;
  if (sellar) {
    const menu = await Menu.find({ storeOwner: sellar });

    return res.status(StatusCodes.CREATED).json(menu);
  }
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ msg: "error while getting menu" });
};

//get menu
const getSingleMenu = async (req, res) => {
  const sellar = req.user.userId;
  const { id: menuId } = req.params;
  if (sellar) {
    const menu = await Menu.find({ storeOwner: sellar, _id: menuId });

    return res.status(StatusCodes.CREATED).json(menu);
  }
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ msg: "error while getting menu" });
};

//get menu with food
const getMenuFood = async (req, res) => {
  const { id: menuId } = req.params;
  const sellar = req.user.userId;
  if (sellar) {
    const food = await SellarFood.find({ menu: menuId });
    if (!food) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: `cannot find id: ${menuId} in params` });
    }

    return res.status(StatusCodes.OK).json(food);
  }
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ msg: "error while getting menu with food" });
};

module.exports = {
  createMenu,
  editMenu,
  deleteMenu,
  getMenu,
  getSingleMenu,
  getMenuFood,
};
