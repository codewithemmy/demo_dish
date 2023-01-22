const express = require("express");
const { getStore } = require("../controllers/customerStore");

const router = express.Router();

router.route("/getStore").get(getStore);
module.exports = router;
