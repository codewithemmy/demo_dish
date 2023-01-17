const { StatusCodes } = require("http-status-codes");
const Menu = require("../models/Menu");
const Food = require("../models/Food");

//create menu
const createMenu = async (req, res) => {
  const { id: storeId } = req.params;
  const { menuName } = req.body;
  const sellar = req.user.userId;

  if (!menuName) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: `kindly input your menu name` });
  }

  if (sellar) {
    const menu = await Menu.create({
      menuName: menuName,
      storeOwner: sellar,
      store: storeId,
    });

    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "Menu Successfully created", menu });
  }
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ msg: "error while creating menu" });
};

//edit menu
const editMenu = async (req, res) => {
  const { id: menuId } = req.params;
  const sellar = req.user.userId;
  const { menuName } = req.body;

  if (!menuId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: `Invalid/No Id input` });
  }

  if (sellar) {
    const menu = await Menu.findByIdAndUpdate(
      menuId,
      {
        menuName: menuName,
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

//get menu with food
const getMenuFood = async (req, res) => {
  const { id: menuId } = req.params;
  const sellar = req.user.userId;
  if (sellar) {
    const food = await Food.find({ menu: menuId, storeOwner: sellar });
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

module.exports = { createMenu, editMenu, deleteMenu, getMenu, getMenuFood };
