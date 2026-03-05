const pool = require("../config/database");

exports.listCities = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name FROM cities ORDER BY name ASC"
    );

    res.json(result.rows);

  } catch (error) {
    console.error("CITIES ERROR:", error);
    res.status(500).json({ error: "Error obteniendo ciudades" });
  }
};