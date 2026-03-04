const express = require("express");
const router = express.Router();
const pool = require("../config/database");

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Mensaje requerido" });
    }

    const text = message.toLowerCase();

    // =============================
    // SI PREGUNTA POR CIUDADES
    // =============================
    if (
      text.includes("ciudad") ||
      text.includes("buscar") ||
      text.includes("ver")
    ) {
      const result = await pool.query(
        "SELECT DISTINCT name FROM cities ORDER BY name ASC"
      );

      const cities = result.rows.map(c => c.name);

      return res.json({
        reply: "Estas son las ciudades disponibles:",
        cities
      });
    }

    // =============================
    // SI ESCRIBE UNA CIUDAD
    // =============================
    const cityResult = await pool.query(
      "SELECT name FROM cities WHERE LOWER(name) = LOWER($1)",
      [message]
    );

    if (cityResult.rows.length > 0) {
      const city = cityResult.rows[0].name;

      const analytics = await pool.query(
        "SELECT growth, average_price FROM analytics WHERE city = $1",
        [city]
      );

      const growth = analytics.rows[0]?.growth || 0;
      const average = analytics.rows[0]?.average_price || 0;

      return res.json({
        reply: `📍 ${city}

Crecimiento: ${growth}%
Precio promedio: $${average} USD/m²

¿Deseas un análisis más profundo?`
      });
    }

    return res.json({
      reply:
        "No encontré esa ciudad. Escribe 'ver ciudades' para mostrar opciones."
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en chat" });
  }
});

module.exports = router;