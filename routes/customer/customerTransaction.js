const express = require("express");
const {
  webhookController
} = require("../../controllers/customer/customerTransaction");

const router = express.Router();
const authMiddleware = require("../../customerMiddleware/authentication");

router.route("/afrilish-webhook").post(webhookController);

module.exports = router;
