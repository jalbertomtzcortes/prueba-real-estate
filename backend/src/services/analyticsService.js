const pool = require("../config/database");

exports.getAveragePrice = async (city, from, to) => {
  let query = `
    SELECT AVG(price_per_m2) as average_price
    FROM prices p
    JOIN projects pr ON p.project_id = pr.id
    JOIN cities c ON pr.city_id = c.id
    WHERE c.name = $1
  `;

  const params = [city];

  if (from && to) {
    query += " AND period BETWEEN $2 AND $3";
    params.push(from, to);
  }

  const { rows } = await pool.query(query, params);

  return rows[0];
};

exports.getCityGrowth = async (city, from, to) => {
  const query = `
    SELECT 
      (
        (AVG(CASE WHEN period = $3 THEN price_per_m2 END) -
         AVG(CASE WHEN period = $2 THEN price_per_m2 END)
        )
        /
        AVG(CASE WHEN period = $2 THEN price_per_m2 END)
      ) * 100 AS growth_percentage
    FROM prices p
    JOIN projects pr ON p.project_id = pr.id
    JOIN cities c ON pr.city_id = c.id
    WHERE c.name = $1;
  `;

  const { rows } = await pool.query(query, [city, from, to]);

  return rows[0];
};