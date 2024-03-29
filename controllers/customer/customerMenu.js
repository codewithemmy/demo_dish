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
  const storeId = req.params.storeId;

  if (storeId) {
    const storeDetails = await StoreDetails.findOne({ _id: storeId }).populate({
      path: "menuId",
      select: " -storeOwner -createdAt -updatedAt -__v",
    });

    if (!storeDetails) {
      return res.status(400).json({
        msg: `cannot find storeId ${storeId}  in params`,
      });
    }

    // Loop through each menu item and populate its nested food items
    for (const menuItem of storeDetails.menuId) {
      await menuItem
        .populate({
          path: "food",
          select: "-foodavailable -menu -storeOwner -createdAt -updatedAt -__v",
        })
        .execPopulate();
    }

    const food = await SellarFood.find({ storeOwner: storeDetails._id });

    return res.status(200).json({ storeDetails, food });
  }

  return res.status(400).json({ msg: "unable to get store, food, and menu" });
};

//get single Food
const getSingleFood = async (req, res) => {
  const foodId = req.params.id;

  if (foodId) {
    const food = await SellarFood.findOne({ _id: foodId });

    if (!food) {
      return res.status(400).json({
        msg: `cannot find foodId: ${foodId}  in params`,
      });
    }

    const store = await StoreDetails.findOne({
      _id: food.storeOwner,
    }).select({ _id: 1 });

    if (!store) {
      return res.status(400).json({
        msg: `cannot find Store`,
      });
    }

    return res.status(200).json({ food, store });
  }

  return res.status(400).json({ msg: "unable to get single food" });
};

module.exports = {
  getStoreMenu,
  getMenuFood,
  getSingleStoreDetails,
  getSingleFood,
};
