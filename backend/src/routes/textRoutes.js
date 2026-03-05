const express = require("express");
const router = express.Router();
const controller = require("../controllers/textController");

router.post("/fix-text", controller.fixText);

module.exports = router;