const express = require("express");
const router = express.Router();
const controller = require("../controllers/chatController");

router.post("/", controller.chat);

module.exports = router;