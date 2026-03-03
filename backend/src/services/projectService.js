const pool = require("../config/database");

async function getProjectsByCity(city) {
  const query = `
    SELECT p.id, p.name, z.name AS zone, c.name AS city
    FROM projects p
    JOIN zones z ON p.zone_id = z.id
    JOIN cities c ON z.city_id = c.id
    WHERE c.name = $1
    ORDER BY p.name;
  `;
  const result = await pool.query(query, [city]);
  return result.rows;
}

async function getProjectHistory(projectId) {
  const query = `
    SELECT period, price_per_m2
    FROM price_history
    WHERE project_id = $1
    ORDER BY period;
  `;
  const result = await pool.query(query, [projectId]);
  return result.rows;
}

async function getProjectHistoryByDate(projectId, start, end) {
  const query = `
    SELECT period, price_per_m2
    FROM price_history
    WHERE project_id = $1
      AND period BETWEEN $2 AND $3
    ORDER BY period;
  `;
  const result = await pool.query(query, [projectId, start, end]);
  return result.rows;
}

module.exports = {
  getProjectsByCity,
  getProjectHistory,
  getProjectHistoryByDate
};