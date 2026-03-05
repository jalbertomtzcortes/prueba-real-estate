const pool = require("../config/database");

// =====================================
// PROMEDIO POR CIUDAD
// =====================================
exports.getAveragePrice = async (cityId, from, to) => {
  let query = `
    SELECT AVG(ph.price_per_m2) AS average_price
    FROM price_history ph
    JOIN projects p ON ph.project_id = p.id
    JOIN zones z ON p.zone_id = z.id
    JOIN cities c ON z.city_id = c.id
    WHERE c.id = $1
  `;

  const params = [cityId];

  if (from && to) {
    query += `
      AND EXTRACT(YEAR FROM ph.period) 
      BETWEEN $2 AND $3
    `;
    params.push(parseInt(from), parseInt(to));
  }

  const { rows } = await pool.query(query, params);
  return rows[0];
};


// =====================================
// CRECIMIENTO POR CIUDAD
// =====================================
exports.getCityGrowth = async (cityId, from, to) => {
  const query = `
    WITH yearly_avg AS (
      SELECT 
        EXTRACT(YEAR FROM ph.period) AS year,
        AVG(ph.price_per_m2) AS avg_price
      FROM price_history ph
      JOIN projects p ON ph.project_id = p.id
      JOIN zones z ON p.zone_id = z.id
      JOIN cities c ON z.city_id = c.id
      WHERE c.id = $1
      GROUP BY year
    )
    SELECT 
      CASE 
        WHEN MAX(CASE WHEN year = $2 THEN avg_price END) IS NULL
          OR MAX(CASE WHEN year = $3 THEN avg_price END) IS NULL
        THEN NULL
        ELSE (
          (MAX(CASE WHEN year = $3 THEN avg_price END) -
           MAX(CASE WHEN year = $2 THEN avg_price END)
          )
          /
          NULLIF(MAX(CASE WHEN year = $2 THEN avg_price END), 0)
        ) * 100
      END AS growth_percentage
    FROM yearly_avg;
  `;

  const { rows } = await pool.query(query, [
    cityId,
    parseInt(from),
    parseInt(to),
  ]);

  return rows[0];
};