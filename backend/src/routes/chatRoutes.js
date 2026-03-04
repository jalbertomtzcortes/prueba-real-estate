const express = require("express");
const OpenAI = require("openai");
const router = express.Router();

const { saveMessage, getLastMessages } = require("../services/chatService");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post("/", async (req, res) => {
  try {
    const { message, mode, city, growth, average, userId } = req.body;

    const realUserId = userId || "default_user";

    const systemPrompt =
      mode === "agent"
        ? `Eres un consultor inmobiliario experto en ${city}.
Crecimiento: ${growth}%
Precio promedio: ${average} USD/m2`
        : `Eres un analista maestro en real estate.
Ciudad: ${city}
Crecimiento: ${growth}%
Precio promedio: ${average} USD/m2`;

    // 1️⃣ Obtener historial desde PostgreSQL
    const history = await getLastMessages(realUserId);

    // 2️⃣ Guardar mensaje usuario
    await saveMessage(realUserId, "user", message);

    // 3️⃣ Crear stream
    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      stream: true,
      messages: [
        { role: "system", content: systemPrompt },
        ...history,
        { role: "user", content: message }
      ]
    });

    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Transfer-Encoding", "chunked");

    let fullResponse = "";

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      fullResponse += content;
      res.write(content);
    }

    // 4️⃣ Guardar respuesta IA
    await saveMessage(realUserId, "assistant", fullResponse);

    res.end();

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en chat IA" });
  }
});

module.exports = router;