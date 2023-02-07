const express = require("express");
const { getStoreMenu } = require("../../controllers/customer/customerMenu");

const router = express.Router();

router.route("/getStoreMenu/:id").get(getStoreMenu);
module.exports = router;
