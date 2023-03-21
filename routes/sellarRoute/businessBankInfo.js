const express = require("express");
const { createBankDetails, updateBusinessBankInfo } = require("../../controllers/sellar/bankDetails");

const authMiddleware = require("../../middleware/authentication");

const router = express.Router();

router.route("/createBusinessBank").post(authMiddleware, createBankDetails);

router.route("/updateBusinessBank/:id").patch(authMiddleware, updateBusinessBankInfo);

module.exports = router;
