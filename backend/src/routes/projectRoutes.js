const express = require("express");
const router = express.Router();
const controller = require("../controllers/projectController");

router.get("/", controller.listProjects);
router.get("/:id/history", controller.projectHistory);

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Obtener proyectos por ciudad y zona
 *     tags: [Projects]
 *     parameters:
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: zone
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Lista de proyectos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 */

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Obtener proyecto por ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Proyecto encontrado
 *       404:
 *         description: Proyecto no encontrado
 */
module.exports = router;