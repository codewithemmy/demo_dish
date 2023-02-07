const express = require("express");
const {
  createFood,
  editFood,
  deleteFood,
  getFood,
} = require("../../controllers/Sellar/food");
const authMiddleware = require("../../middleware/authentication");

const router = express.Router();

router.route("/createFood").post(authMiddleware, createFood);
router.route("/editFood").patch(authMiddleware, editFood);
router.route("/getFood").get(authMiddleware, getFood);
router.route("/deleteFood").delete(authMiddleware, deleteFood);

module.exports = router;
