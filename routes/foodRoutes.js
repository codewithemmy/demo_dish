const express = require("express");
const {
  createFood,
  editFood,
  deleteFood,
  getFood,
} = require("../controllers/food");
const authMiddleware = require("../middleware/authentication");

const router = express.Router();

router.route("/createFood/:id").post(authMiddleware, createFood);
router.route("/editFood/:id").patch(authMiddleware, editFood);
router.route("/getFood").get(authMiddleware, getFood);
router.route("/deleteFood/:id").delete(authMiddleware, deleteFood);

module.exports = router;
