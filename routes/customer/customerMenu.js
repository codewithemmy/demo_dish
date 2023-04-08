const express = require("express");
const {
  getStoreMenu,
  getMenuFood,
  getSingleStoreDetails,
} = require("../../controllers/customer/customerMenu");

const router = express.Router();

router.route("/getStoreMenu/:id").get(getStoreMenu);
router.route("/getMenuFood/:id").get(getMenuFood);
router
  .route("/getSingleStoreDetails/:storeId/:menuId")
  .get(getSingleStoreDetails);

module.exports = router;
