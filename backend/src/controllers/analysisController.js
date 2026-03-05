const pool = require("../config/database");

const compareCities = async (req, res) => {

  try {

    const { city1, city2 } = req.body;

    const result = await pool.query(`
      SELECT 
        c.name AS city,
        AVG(ph.price_per_m2) AS avg_price_m2
      FROM price_history ph
      JOIN projects p ON ph.project_id = p.id
      JOIN zones z ON p.zone_id = z.id
      JOIN cities c ON z.city_id = c.id
      WHERE c.name = $1 OR c.name = $2
      GROUP BY c.name
      ORDER BY avg_price_m2 DESC
    `, [city1, city2]);

    res.json(result.rows);

  } catch (error) {

    console.error(error);
    res.status(500).json({
      error: "Error comparing cities"
    });

  }

};

module.exports = {
  compareCities
};