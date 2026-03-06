const pool = require("../config/database");

exports.getCities = async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT id, name
      FROM cities
      ORDER BY name
    `);

    res.json(result.rows);

  } catch (error) {

    console.error(error);
    res.status(500).json({
      error: "Error loading cities"
    });

  }
};