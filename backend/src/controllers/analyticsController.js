const service = require("../services/analyticsService");

const MIN_YEAR = 2015;
const MAX_YEAR = 2024;

// ===============================
// PROMEDIO
// ===============================
exports.averagePrice = async (req, res) => {
  try {
    const { cityId, from, to } = req.query;

    if (!cityId) {
      return res.status(400).json({ error: "cityId es requerido" });
    }

    if (from && to) {
      if (from < MIN_YEAR || to > MAX_YEAR) {
        return res.status(400).json({
          error: `Solo hay datos entre ${MIN_YEAR} y ${MAX_YEAR}`,
        });
      }
    }

    const result = await service.getAveragePrice(
      parseInt(cityId),
      from,
      to
    );

    res.json({
      average: result?.average_price || 0,
    });

  } catch (error) {
    res.status(500).json({ error: "Error calculando promedio" });
  }
};


// ===============================
// CRECIMIENTO
// ===============================
exports.cityGrowth = async (req, res) => {
  try {
    const { cityId, from, to } = req.query;

    if (!cityId || !from || !to) {
      return res.status(400).json({
        error: "cityId, from y to son requeridos",
      });
    }

    if (from < MIN_YEAR || to > MAX_YEAR) {
      return res.status(400).json({
        error: `Solo hay datos entre ${MIN_YEAR} y ${MAX_YEAR}`,
      });
    }

    const result = await service.getCityGrowth(
      parseInt(cityId),
      from,
      to
    );

    if (!result?.growth_percentage) {
      return res.json({
        growth: 0,
        message: "No hay datos suficientes para esos años",
      });
    }

    res.json({
      growth: result.growth_percentage,
    });

  } catch (error) {
    res.status(500).json({ error: "Error calculando crecimiento" });
  }
};