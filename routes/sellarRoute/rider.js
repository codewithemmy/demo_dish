const express = require("express");
const { getRider, assignRiderOrder } = require("../../controllers/sellar/rider");

const authMiddleware = require("../../middleware/authentication");

const router = express.Router();

router.route("/getRiders").get(authMiddleware, getRider);
router.route("/assignOrder/:id1/:id2").patch(authMiddleware, assignRiderOrder);

module.exports = router;
