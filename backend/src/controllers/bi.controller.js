const pool = require("../config/database");

exports.getCities = async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT DISTINCT city
      FROM properties
      ORDER BY city
    `);

    res.json(result.rows);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "Error obteniendo ciudades" });

  }

};


exports.generateChart = async (req, res) => {

  const { cities, startDate, endDate, chartType } = req.body;

  try {

    const result = await pool.query(`
      SELECT city, AVG(price) as avg_price
      FROM properties
      WHERE city = ANY($1)
      AND date BETWEEN $2 AND $3
      GROUP BY city
    `,[cities,startDate,endDate]);

    const labels = result.rows.map(r => r.city);
    const data = result.rows.map(r => r.avg_price);

    res.json({
      labels,
      datasets: [
        {
          label: "Precio Promedio",
          data
        }
      ],
      chartType
    });

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "Error generando gráfico" });

  }

};