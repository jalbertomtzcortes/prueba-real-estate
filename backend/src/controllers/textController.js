const { fixTextWithAI } = require("../services/openaiService");

exports.fixText = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const fixed = await fixTextWithAI(text);

    res.json({ fixed });
  } catch (error) {
    console.error("AI FIX ERROR:", error);
    res.status(500).json({ error: "Error fixing text" });
  }
};