const express = require("express");
const { createPartner, editPartner } = require("../../controllers/sellar/partner");
const authMiddleware = require("../../middleware/authentication");

const router = express.Router();

router.route("/createPartner").post(authMiddleware, createPartner);
router.route("/editPartner/:id").patch(authMiddleware, editPartner);

module.exports = router;
