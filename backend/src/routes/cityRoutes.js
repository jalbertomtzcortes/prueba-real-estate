const express = require("express");
const router = express.Router();
const controller = require("../controllers/cityController");

/**
 * @swagger
 * /api/cities:
 *   get:
 *     summary: Obtener todas las ciudades disponibles
 *     tags: [Cities]
 *     responses:
 *       200:
 *         description: Lista de ciudades
 *       500:
 *         description: Error interno del servidor
 */
router.get("/", controller.listCities);

module.exports = router;