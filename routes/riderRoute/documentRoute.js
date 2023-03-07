const express = require("express");
const { multipleDoc } = require("../../controllers/rider/document");
const { createReg } = require("../../controllers/rider/registration");

const auth = require("../../riderMiddleware/authentication");

const router = express.Router();

// router.route("/compRegCert").post(auth, compRegCert);
// router.route("/passportId").post(auth, passportId);
// router.route("/taxDocument").post(auth, taxDocument);
router.route("/document").post(auth, multipleDoc);
router.route("/registration").post(auth, createReg);

module.exports = router;
