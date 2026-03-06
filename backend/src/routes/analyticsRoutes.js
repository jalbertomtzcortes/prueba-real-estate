const express = require("express");
const router = express.Router();

const controller = require("../controllers/analyticsController");

router.get("/compare", controller.compareCities);
router.get("/zone-evolution", controller.zoneEvolution);

module.exports = router;
