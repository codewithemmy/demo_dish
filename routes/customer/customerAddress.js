const express = require("express");
const { postAddress } = require("../../controllers/customer/customerAddress");
const authMiddleware = require("../../customerMiddleware/authentication");

const router = express.Router();

router.route("/postAddress").post(authMiddleware, postAddress);

module.exports = router;
