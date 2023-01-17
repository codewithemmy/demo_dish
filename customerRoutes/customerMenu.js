const express = require("express");
const { getStoreMenu } = require("../customerController/customerMenu");

const router = express.Router();

router.route("/getStoreMenu/:id").get(getStoreMenu);
module.exports = router;
