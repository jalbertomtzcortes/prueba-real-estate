const pool = require("../config/database");

exports.chat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const cleanMessage = message.toLowerCase().trim();

    // 🔥 Si pide ciudades
    if (cleanMessage.includes("ver ciudades")) {
      const result = await pool.query(
        "SELECT id, name FROM cities ORDER BY name ASC"
      );

      const cities = result.rows.map((row) => ({
        id: row.id,
        name: row.name,
      }));

      return res.json({
        reply: "Estas son las ciudades disponibles:",
        cities,
      });
    }

    return res.json({
      reply: `Analizando ${message}...`,
    });

  } catch (error) {
    console.error("CHAT ERROR:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
