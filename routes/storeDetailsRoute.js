const express = require("express");
const {
  createStoreDetails,
  editStoreDetails,
  deleteStoreDetails,
  getStoreDetails,
  isAvailable,
} = require("../controllers/storeDetails");
const authMiddleware = require("../middleware/authentication");

const router = express.Router();

router.route("/editStoreDetails/:id").patch(authMiddleware, editStoreDetails);
router.route("/createStoreDetails").post(authMiddleware, createStoreDetails);
router.route("/getStoreDetails").get(authMiddleware, getStoreDetails);
router.route("/isAvailable").get(authMiddleware, isAvailable);
router
  .route("/deleteStoreDetails/:id")
  .delete(authMiddleware, deleteStoreDetails);

module.exports = router;
