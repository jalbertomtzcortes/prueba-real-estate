const pool = require("../config/database");

exports.compareCities = async (req, res) => {

  try {

    const { city1, city2, from, to } = req.query;

    const fromDate = `${from}-01-01`;
    const toDate = `${to}-12-31`;

    const query = `
      SELECT
        c.name AS city,
        EXTRACT(YEAR FROM ph.period) AS year,
        ROUND(AVG(ph.price_per_m2),2) AS avg_price
      FROM price_history ph
      JOIN projects p ON ph.project_id = p.id
      JOIN zones z ON p.zone_id = z.id
      JOIN cities c ON z.city_id = c.id
      WHERE c.id IN ($1,$2)
      AND ph.period BETWEEN $3 AND $4
      GROUP BY c.name, year
      ORDER BY year;
    `;

    const result = await pool.query(query, [
      city1,
      city2,
      fromDate,
      toDate
    ]);

    const cities = {};

    result.rows.forEach(row => {

      if (!cities[row.city]) {
        cities[row.city] = [];
      }

      cities[row.city].push({
        year: row.year,
        avg_price: Number(row.avg_price)
      });

    });

    res.json({
      history: cities
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error generando comparación"
    });

  }

};