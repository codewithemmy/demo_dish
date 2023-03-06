const express = require("express");
const {
  compRegCert,
  passportId,
  taxDocument,
  multipleDoc,
} = require("../../controllers/rider/document");

const auth = require("../../riderMiddleware/authentication");

const router = express.Router();

// router.route("/compRegCert").post(auth, compRegCert);
// router.route("/passportId").post(auth, passportId);
// router.route("/taxDocument").post(auth, taxDocument);
router.route("/document").post(auth, multipleDoc);

module.exports = router;
