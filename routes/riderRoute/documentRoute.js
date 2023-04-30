const express = require("express");
const { multipleDoc, insertDoc } = require("../../controllers/rider/document");
const { createReg, createBankDetails } = require("../../controllers/rider/registration");

const auth = require("../../riderMiddleware/authentication");

const router = express.Router();

router.route("/document").post(multipleDoc);
router.route("/registration").post(auth, createReg);
router.route("/bank").post(auth, createBankDetails);
router.route("/upload").post(insertDoc);

module.exports = router;
