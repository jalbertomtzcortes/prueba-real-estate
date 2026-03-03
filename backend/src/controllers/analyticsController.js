const analyticsService = require("../services/analyticsService");
const service = require("../services/analyticsService");

exports.averagePrice = async (req, res) => {
  try {
    const { city, from, to } = req.query;

    if (!city) {
      return res.status(400).json({ error: "City es requerido" });
    }

    const result = await service.getAveragePrice(city, from, to);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error calculando promedio" });
  }
};

exports.cityGrowth = async (req, res) => {
  try {
    const { city, from, to } = req.query;

    if (!city || !from || !to) {
      return res.status(400).json({ error: "City, from y to son requeridos" });
    }

    const result = await service.getCityGrowth(city, from, to);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error calculando crecimiento" });
  }
};