const service = require("../services/priceService");

exports.getPricesByProject = async (req, res) => {
  try {
    const { project } = req.query;

    if (!project) {
      return res.status(400).json({ error: "Project es requerido" });
    }

    const data = await service.getPricesByProject(project);

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo precios" });
  }
};