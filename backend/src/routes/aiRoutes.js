const express = require("express");
const router = express.Router();
const pool = require("../config/database");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post("/", async (req, res) => {

  try {

    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        error: "Question is required"
      });
    }

    // =========================
    // DATOS REALES DE LA DB
    // =========================

    const query = `
      SELECT
        c.name AS city,
        ROUND(AVG(ph.price_per_m2),2) AS avg_price,
        MIN(EXTRACT(YEAR FROM ph.period)) AS first_year,
        MAX(EXTRACT(YEAR FROM ph.period)) AS last_year
      FROM price_history ph
      JOIN projects p ON ph.project_id = p.id
      JOIN zones z ON p.zone_id = z.id
      JOIN cities c ON z.city_id = c.id
      GROUP BY c.name
      ORDER BY avg_price DESC
      LIMIT 20
    `;

    const result = await pool.query(query);

    const citiesData = result.rows;

    // =========================
    // GPT ANALYSIS
    // =========================

    const completion = await openai.chat.completions.create({

      model: "gpt-4o-mini",

      messages: [

        {
          role: "system",
          content: `
Eres un analista inmobiliario senior.

Responde usando SOLO los datos proporcionados.

Explica con lenguaje profesional para inversionistas.
`
        },

        {
          role: "user",
          content: `
Datos disponibles:

${JSON.stringify(citiesData, null, 2)}

Pregunta:

${question}
`
        }

      ]

    });

    const reply = completion.choices[0].message.content;

    res.json({
      reply,
      data: citiesData
    });

  } catch (error) {

    console.error("AI ERROR:", error);

    res.status(500).json({
      error: "AI analysis failed"
    });

  }

});

module.exports = router;