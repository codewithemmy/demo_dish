const express = require("express");
const {
  getSellarProfile,
  updateSellarProfile,
} = require("../../controllers/sellar/user");

const auth = require("../../middleware/authentication");

const router = express.Router();

//sellar profile route
router.route("/profile/:id").get(auth, getSellarProfile);
router.route("/updateProfile/:id").patch(auth, updateSellarProfile);

module.exports = router;
