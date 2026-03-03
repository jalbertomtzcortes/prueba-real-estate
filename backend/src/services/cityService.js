const pool = require("../config/database");

async function getAllCities() {
  const query = `
    SELECT id, name
    FROM cities
    ORDER BY name;
  `;
  const result = await pool.query(query);
  return result.rows;
}

module.exports = { getAllCities };