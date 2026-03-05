const express = require("express");
const router = express.Router();
const biController = require("../controllers/bi.controller");

router.get("/cities", biController.getCities);
router.post("/generate-chart", biController.generateChart);

module.exports = router;