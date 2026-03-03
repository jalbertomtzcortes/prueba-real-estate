const cityService = require("../services/cityService");

async function listCities(req, res) {
  try {
    const cities = await cityService.getAllCities();
    res.json(cities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching cities" });
  }
}

module.exports = { listCities };