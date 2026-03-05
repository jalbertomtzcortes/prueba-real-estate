const db = require("../config/database");

exports.compareCities = async (req, res) => {

  try {

    const { city1, city2, from, to } = req.query;

    if (!city1 || !city2 || !from || !to) {
      return res.status(400).json({
        error: "Faltan parámetros"
      });
    }

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
      ORDER BY year
    `;

    const result = await db.query(query, [
      city1,
      city2,
      `${from}-01-01`,
      `${to}-12-31`
    ]);

    const cityData = {};

    result.rows.forEach(row => {

      if (!cityData[row.city]) {
        cityData[row.city] = [];
      }

      cityData[row.city].push({
        year: row.year,
        avg_price: Number(row.avg_price)
      });

    });

    res.json(cityData);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error en análisis"
    });

  }

};