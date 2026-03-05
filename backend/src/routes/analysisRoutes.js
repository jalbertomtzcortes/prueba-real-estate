const express = require("express");
const router = express.Router();

const controller = require("../controllers/analysisController");

router.post("/compare-cities", controller.compareCities);

module.exports = router;