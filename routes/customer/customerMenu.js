const express = require("express");
const {
  getStoreMenu,
  getMenuFood,
  getSingleStoreDetails,
  getSingleFood,
} = require("../../controllers/customer/customerMenu");

const router = express.Router();

router.route("/getStoreMenu/:id").get(getStoreMenu);
router.route("/getMenuFood/:id").get(getMenuFood);
router.route("/getSingleStoreDetails/:storeId").get(getSingleStoreDetails);
router.route("/getSingleFood/:id").get(getSingleFood);

module.exports = router;
