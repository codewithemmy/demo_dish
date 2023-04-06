const express = require("express");
const {
  webhookController,
} = require("../../controllers/customer/customerTransaction");

const router = express.Router();

router.route("/afrilish-webhook").post(webhookController);

module.exports = router;
