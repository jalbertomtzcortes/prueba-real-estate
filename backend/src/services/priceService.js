const pool = require("../config/database");

exports.getPricesByProject = async (project) => {
  const query = `
    SELECT period, price_per_m2
    FROM prices p
    JOIN projects pr ON p.project_id = pr.id
    WHERE pr.name = $1
    ORDER BY period;
  `;

  const { rows } = await pool.query(query, [project]);

  return rows;
};