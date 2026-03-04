const pool = require("../config/database");

exports.listCities = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT DISTINCT name FROM cities ORDER BY name ASC"
    );

    const cities = result.rows.map(row => row.name);

    res.json(cities);

  } catch (error) {
    console.error("CITIES ERROR:", error);
    res.status(500).json({ error: "Error fetching cities" });
  }
};