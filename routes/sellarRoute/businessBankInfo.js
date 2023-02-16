const express = require("express");
const { createBusinessBank, updateBusinessBankInfo } = require("../../controllers/sellar/businessBankInfo");

const authMiddleware = require("../../middleware/authentication");

const router = express.Router();

router.route("/createBusinessBank").post(authMiddleware, createBusinessBank);
router.route("/updateBusinessBank/:id").patch(authMiddleware, updateBusinessBankInfo);

module.exports = router;
