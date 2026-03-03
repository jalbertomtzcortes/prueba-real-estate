const express = require("express");
const router = express.Router();
const controller = require("../controllers/priceController");

/**
 * @swagger
 * /api/prices/by-project:
 *   get:
 *     summary: Obtener histórico de precios por proyecto
 *     tags: [Prices]
 *     parameters:
 *       - in: query
 *         name: project
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Histórico de precios
 */
router.get("/by-project", controller.getPricesByProject);

module.exports = router;