const Menu = require("../../models/sellarModel/Menu");
const SellarFood = require("../../models/sellarModel/SellarFood");
const StoreDetails = require("../../models/sellarModel/StoreDetails");

//get menu
const getStoreMenu = async (req, res) => {
  const { id: storeId } = req.params;
  const menu = await Menu.find({ store: storeId });
  return res.status(200).json(menu);
};

//get menu with food
const getMenuFood = async (req, res) => {
  const { id: menuId } = req.params;

  if (menuId) {
    const food = await SellarFood.find({ menu: menuId });
    if (!food) {
      return res
        .status(400)
        .json({ msg: `cannot find id: ${menuId} in params` });
    }

    return res.status(200).json(food);
  }

  return res.status(400).json({ msg: "error while getting menu with food" });
};

//get single store, menu, foodMenu
const getSingleStoreDetails = async (req, res) => {
  const menuId = req.params.menuId;
  const storeId = req.params.storeId;

  if (menuId && storeId) {
    const food = await SellarFood.find({ menu: menuId });
    const storeDetails = await StoreDetails.findById(storeId);
    const menu = await Menu.find({ store: storeId });
    if (!food && !store) {
      return res.status(400).json({
        msg: `cannot find menuId: ${menuId} or storeId ${storeId}  in params`,
      });
    }

    return res.status(200).json({ food, storeDetails, menu });
  }

  return res.status(400).json({ msg: "unable to get store, food, and menu" });
};

module.exports = { getStoreMenu, getMenuFood, getSingleStoreDetails };
