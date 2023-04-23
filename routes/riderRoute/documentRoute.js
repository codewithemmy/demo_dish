const express = require("express");
const { multipleDoc, insertDoc } = require("../../controllers/rider/document");
const { createReg } = require("../../controllers/rider/registration");

const auth = require("../../riderMiddleware/authentication");

const router = express.Router();

router.route("/document").post(multipleDoc);
router.route("/registration").post(auth, createReg);
router.route("/upload").post(insertDoc);

module.exports = router;
