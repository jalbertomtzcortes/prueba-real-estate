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

    // 🔥 Generar contenido IA
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

Incluye:
- Título atractivo
- 3 bullet points estratégicos
- Conclusión ejecutiva
          `,
        },
      ],
    });

    const content = completion.choices[0].message.content;

    // 🔥 Asegurar que carpeta public existe
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
          h1 { color:#00ff88; }
          ul { margin-top:20px; }
        </style>
      </head>
      <body>
        ${content}
      </body>
    </html>
    `;

    const filePath = path.join(publicDir, "presentation.html");

    fs.writeFileSync(filePath, html);

    return res.json({ success: true });

  } catch (err) {
    console.error("🔥 ERROR PRESENTATION:", err.message);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;