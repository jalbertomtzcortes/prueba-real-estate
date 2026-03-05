const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
const fs = require("fs");
const path = require("path");

// 🔥 Validar API Key
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY no definida en .env");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/", async (req, res) => {
  try {
    const { city, growth, average, from, to } = req.body;

    if (!city) {
      return res.status(400).json({ error: "Missing data" });
    }

    /*
    =========================================
    🔴 PARTE DINÁMICA CON OPENAI (DESACTIVADA)
    =========================================

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Eres consultor inmobiliario senior.",
        },
        {
          role: "user",
          content: `
Genera una diapositiva ejecutiva en HTML profesional.

Ciudad: ${city}
Periodo: ${from} - ${to}
Crecimiento: ${growth}%
Precio promedio: ${average} USD/m2
          `,
        },
      ],
    });

    const content = completion.choices[0].message.content;
    */

    // 🔥 CONTENIDO ESTÁTICO PARA TEST
    const content = `
      <h1>Reporte Inmobiliario - ${city}</h1>

      <h2>Periodo ${from} - ${to}</h2>

      <ul>
        <li>📈 Crecimiento del mercado: ${growth}% anual</li>
        <li>🏢 Precio promedio: ${average} USD/m2</li>
        <li>🌎 Alta demanda en zonas premium</li>
      </ul>

      <p>
        <strong>Conclusión:</strong><br/>
        El mercado inmobiliario en ${city} muestra una tendencia positiva 
        impulsada por inversión extranjera y crecimiento urbano.
      </p>
    `;

    // 🔥 Asegurar carpeta public
    const publicDir = path.join(__dirname, "../public");

    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir);
    }

    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          body {
            font-family: Arial;
            padding: 50px;
            background:#0f0f14;
            color:white;
          }

          h1 {
            color:#00ff88;
          }

          h2 {
            margin-top:20px;
          }

          ul {
            margin-top:20px;
          }
        </style>
      </head>

      <body>
        ${content}
      </body>

    </html>
    `;

    const filePath = path.join(publicDir, "presentation.html");

    fs.writeFileSync(filePath, html);

    return res.json({
      success: true,
      url: "/presentation.html"
    });

  } catch (err) {

    console.error("🔥 ERROR PRESENTATION:", err.message);

    return res.status(500).json({
      error: err.message
    });

  }
});

module.exports = router;