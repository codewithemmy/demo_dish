const express = require("express");
const {
  createMenu,
  editMenu,
  deleteMenu,
  getMenu,
} = require("../controllers/menu");
const authMiddleware = require("../middleware/authentication");

const router = express.Router();

router.route("/getMenu").get(authMiddleware, getMenu);
router.route("/editMenu/:id").patch(authMiddleware, editMenu);
router.route("/createMenu").post(authMiddleware, createMenu);
router.route("/deleteMenu/:id").delete(authMiddleware, deleteMenu);

module.exports = router;
