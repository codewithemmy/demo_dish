const express = require("express");

const router = express.Router();
const authMiddleware = require("../../customerMiddleware/authentication");
const WebhookTransaction = require("../../models/customerModel/WebhookTransaction");

router.route("/afrilish-webhook").post(WebhookTransaction);

module.exports = router;
