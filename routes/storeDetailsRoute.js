const express = require("express");
const { createStoreDetails, editStoreDetails } = require("../controllers/storeDetails");
const authMiddleware = require("../middleware/authentication");

const router = express.Router();

router.route("/createStoreDetails").post(authMiddleware, createStoreDetails);
router.route("/editStoreDetails/:id").patch(authMiddleware, editStoreDetails);

module.exports = router;
