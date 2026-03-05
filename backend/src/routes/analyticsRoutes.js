const express = require("express");
const router = express.Router();

const controller = require("../controllers/analyticsController");

router.get("/compare", controller.compareCities);

module.exports = router;