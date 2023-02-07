const express = require("express");
const { createBusiness, editBusiness } = require("../../controllers/Sellar/businessInfo");
const authMiddleware = require("../../middleware/authentication");

const router = express.Router();

router.route("/createBusiness").post(authMiddleware, createBusiness);
router.route("/editBusiness/:id").patch(authMiddleware, editBusiness);

module.exports = router;
