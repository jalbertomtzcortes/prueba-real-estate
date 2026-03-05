const express = require("express");
const router = express.Router();
const controller = require("../controllers/analyticsController");
const auth = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Endpoints de análisis inmobiliario
 */

/**
 * @swagger
 * /api/analytics/average:
 *   get:
 *     summary: Obtener promedio de precios por ciudad en un rango
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: cityId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la ciudad
 *       - in: query
 *         name: from
 *         required: false
 *         schema:
 *           type: string
 *         description: Fecha inicial (YYYY-MM-DD)
 *       - in: query
 *         name: to
 *         required: false
 *         schema:
 *           type: string
 *         description: Fecha final (YYYY-MM-DD)
 */

router.get("/average", auth, controller.averagePrice);


/**
 * @swagger
 * /api/analytics/growth:
 *   get:
 *     summary: Obtener crecimiento porcentual de precios por ciudad
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: cityId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la ciudad
 *       - in: query
 *         name: from
 *         required: true
 *         schema:
 *           type: string
 *         description: Fecha inicial (YYYY)
 *       - in: query
 *         name: to
 *         required: true
 *         schema:
 *           type: string
 *         description: Fecha final (YYYY)
 */

router.get("/growth", auth, controller.cityGrowth);

module.exports = router;