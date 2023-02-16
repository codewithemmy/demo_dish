const express = require("express");
const {
  createInvoiceInfo,
  updateInvoiceInfo,
} = require("../../controllers/sellar/invoiceInfo");
const authMiddleware = require("../../middleware/authentication");

const router = express.Router();

router.route("/createInvoiceInfo").post(authMiddleware, createInvoiceInfo);
router.route("/updateInvoice/:id").patch(authMiddleware, updateInvoiceInfo);

module.exports = router;
