const express = require("express");
const { getStoreMenu, getMenuFood } = require("../../controllers/customer/customerMenu");

const router = express.Router();

router.route("/getStoreMenu/:id").get(getStoreMenu);
router.route("/getMenuFood/:id").get(getMenuFood);
module.exports = router;
