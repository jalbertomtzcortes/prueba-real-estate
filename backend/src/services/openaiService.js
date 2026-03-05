const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.fixTextWithAI = async (text) => {
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You receive corrupted Spanish text with encoding issues like 'CancÃºn'. Return ONLY the correctly written Spanish text. No explanations.",
      },
      {
        role: "user",
        content: text,
      },
    ],
    temperature: 0,
  });

  return completion.choices[0].message.content.trim();
};