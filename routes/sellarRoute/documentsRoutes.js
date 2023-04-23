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

router.route("/compRegCert/:id").post(compRegCert);
router.route("/passportId/:id").post(passportId);
router.route("/taxDocument/:id").post(taxDocument);
router.route("/multipleDoc/:id").post(multipleDoc);
router.route("/upload").post(insertDoc);

module.exports = router;
