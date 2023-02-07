const express = require("express");
const { getStore } = require("../../controllers/customer/customerStore");

const router = express.Router();

router.route("/getStore").get(getStore);
module.exports = router;
