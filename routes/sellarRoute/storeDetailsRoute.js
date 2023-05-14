const express = require("express");
const {
  createStoreDetails,
  editStoreDetails,
  deleteStoreDetails,
  getStoreDetails,
  isAvailable,
  getStoreLocation,
} = require("../../controllers/sellar/storeDetails");
const authMiddleware = require("../../middleware/authentication");
const {
  sellarTransaction,
  getWallet,
  sellarWithdrawal,
} = require("../../controllers/sellar/wallet");

const router = express.Router();

router.route("/editStoreDetails/:id").patch(authMiddleware, editStoreDetails);
router.route("/createStoreDetails").post(authMiddleware, createStoreDetails);
router.route("/getStoreDetails").get(authMiddleware, getStoreDetails);
router.route("/isAvailable").post(authMiddleware, isAvailable);
router
  .route("/deleteStoreDetails/:id")
  .delete(authMiddleware, deleteStoreDetails);
router.route("/wallet").get(authMiddleware, getWallet);
router.route("/withdraw").post(authMiddleware, sellarWithdrawal);
router.route("/sellarTransaction").get(authMiddleware, sellarTransaction);

router.route("/location/:id").patch(getStoreLocation);

module.exports = router;
