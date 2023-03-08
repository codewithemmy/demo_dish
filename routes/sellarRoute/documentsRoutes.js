const express = require("express");
const {
  compRegCert,
  passportId,
  taxDocument,
  multipleDoc,
  insertDoc,
} = require("../../controllers/sellar/documentsRequired");
const authMiddleware = require("../../middleware/authentication");

const router = express.Router();

router.route("/compRegCert").post(compRegCert);
router.route("/passportId").post(passportId);
router.route("/taxDocument").post(taxDocument);
router.route("/multipleDoc").post(multipleDoc);
router.route("/upload").post(insertDoc);

module.exports = router;
