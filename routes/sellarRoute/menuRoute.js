const express = require("express");
const {
  createMenu,
  editMenu,
  deleteMenu,
  getMenu,
  getMenuFood,
  getSingleMenu,
} = require("../../controllers/sellar/menu");
const authMiddleware = require("../../middleware/authentication");

const router = express.Router();

router.route("/getMenu").get(authMiddleware, getMenu);
router.route("/getMenuFood/:id").get(authMiddleware, getMenuFood);
router.route("/getSingleMenu/:id").get(authMiddleware, getSingleMenu);
router.route("/editMenu").patch(authMiddleware, editMenu);
router.route("/createMenu/:id").post(authMiddleware, createMenu);
router.route("/deleteMenu").delete(authMiddleware, deleteMenu);

module.exports = router;
