const express = require("express");
const {
  createStoreInfo,
  editStoreInfo,
  deleteStoreInfo,
  getStoreInfo,
} = require("../../controllers/sellar/storeInfo");
const authMiddleware = require("../../middleware/authentication");

const router = express.Router();

router.route("/createStoreInfo").post(authMiddleware, createStoreInfo);
router.route("/editStoreInfo/:id").patch(authMiddleware, editStoreInfo);
router.route("/getStoreInfo").get(authMiddleware, getStoreInfo);
router.route("/deleteStoreInfo/:id").delete(authMiddleware, deleteStoreInfo);

module.exports = router;
