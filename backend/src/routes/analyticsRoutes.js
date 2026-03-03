const express = require("express");
const router = express.Router();
const controller = require("../controllers/analyticsController");

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
 *     summary: Obtener promedio de precios por ciudad en un rango de fechas
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: city
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre de la ciudad
 *       - in: query
 *         name: from
 *         required: false
 *         schema:
 *           type: string
 *         description: Periodo inicial (ej. Mar-20)
 *       - in: query
 *         name: to
 *         required: false
 *         schema:
 *           type: string
 *         description: Periodo final (ej. Mar-24)
 *     responses:
 *       200:
 *         description: Promedio calculado correctamente
 *       400:
 *         description: Parámetros inválidos
 */
router.get("/average", controller.averagePrice);

/**
 * @swagger
 * /api/analytics/growth:
 *   get:
 *     summary: Obtener crecimiento porcentual de precios por ciudad
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: city
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre de la ciudad
 *       - in: query
 *         name: from
 *         required: true
 *         schema:
 *           type: string
 *         description: Periodo inicial (ej. Mar-20)
 *       - in: query
 *         name: to
 *         required: true
 *         schema:
 *           type: string
 *         description: Periodo final (ej. Mar-24)
 *     responses:
 *       200:
 *         description: Crecimiento calculado correctamente
 *       400:
 *         description: Parámetros inválidos
 */
router.get("/growth", controller.cityGrowth);

module.exports = router;