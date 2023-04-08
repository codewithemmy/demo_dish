const express = require("express");
const {
  createFood,
  editFood,
  deleteFood,
  getFood,
  foodAvailable,
} = require("../../controllers/sellar/sellarFood");
const authMiddleware = require("../../middleware/authentication");

const router = express.Router();

router.route("/createFood/:id").post(authMiddleware, createFood);
router.route("/editFood/:id").patch(authMiddleware, editFood);
router.route("/getFood").get(authMiddleware, getFood);
router.route("/deleteFood/:id").delete(authMiddleware, deleteFood);
router.route("/deleteFood").delete(authMiddleware, deleteFood);
router.route("/isAvailable/:id").patch(authMiddleware, foodAvailable);

module.exports = router;
