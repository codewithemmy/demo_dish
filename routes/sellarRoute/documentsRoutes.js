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

router.route("/compRegCert").post(authMiddleware, compRegCert);
router.route("/passportId").post(authMiddleware, passportId);
router.route("/taxDocument").post(authMiddleware, taxDocument);
router.route("/multipleDoc").post(authMiddleware, multipleDoc);
router.route("/upload").post(authMiddleware, insertDoc);

module.exports = router;
