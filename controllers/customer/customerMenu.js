const Menu = require("../../models/sellarModel/Menu");
const Food = require('../../models/sellarModel/Food');

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
    const food = await Food.find({ menu: menuId });
    if (!food) {
      return res
        .status(400)
        .json({ msg: `cannot find id: ${menuId} in params` });
    }

    return res.status(200).json(food);
  }

  return res.status(400).json({ msg: "error while getting menu with food" });
};

module.exports = { getStoreMenu, getMenuFood };
