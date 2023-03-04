const express = require("express");
const { getStore, getFood, getStoreLocation } = require("../../controllers/customer/customerStore");

const router = express.Router();

router.route("/getStore").get(getStore);
router.route("/getFood").get(getFood);
router.route("/customerLocation/:id").patch(getStoreLocation);

module.exports = router;
