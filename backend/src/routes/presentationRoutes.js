const express = require("express");
const router = express.Router();

const presentationController = require("../controllers/presentationController");

router.post("/generate", presentationController.generatePresentation);

module.exports = router;