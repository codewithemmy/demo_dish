const express = require("express");
const { getStore, getFood } = require("../../controllers/customer/customerStore");

const router = express.Router();

router.route("/getStore").get(getStore);
router.route("/getFood").get(getFood);
module.exports = router;
