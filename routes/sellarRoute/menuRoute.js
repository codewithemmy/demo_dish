const express = require("express");
const {
  createMenu,
  editMenu,
  deleteMenu,
  getMenu,
  getMenuFood,
} = require("../../controllers/sellar/menu");
const authMiddleware = require("../../middleware/authentication");

const router = express.Router();

router.route("/getMenu").get(authMiddleware, getMenu);
router.route("/getMenuFood").get(authMiddleware, getMenuFood);
router.route("/editMenu").patch(authMiddleware, editMenu);
router.route("/createMenu").post(authMiddleware, createMenu);
router.route("/deleteMenu").delete(authMiddleware, deleteMenu);

module.exports = router;
