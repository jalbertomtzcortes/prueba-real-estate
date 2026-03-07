const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

exports.createPresentation = async (payload = {}) => {
  const isSingleCity = Boolean(payload.city) && !payload.city1 && !payload.city2;

  const prompt = isSingleCity
    ? `
Create a single-slide real estate presentation in Spanish.

City: ${payload.city.name}
Period: ${payload.from}-${payload.to}
Growth: ${payload.city.growth_percentage}%
Average price: ${payload.city.average_price} USD/m2

Return valid JSON only with this format:
{
  "slides": [
    {
      "title": "string",
      "content": "short executive summary"
    }
  ],
  "insights": [
    "string",
    "string",
    "string"
  ]
}
`
    : `
Create a real estate investment presentation.

Cities:
${payload.city1.name} growth ${payload.city1.growth_percentage}%
${payload.city2.name} growth ${payload.city2.growth_percentage}%

Return valid JSON only with this format:
{
  "slides": [
    {"title":"Market Overview","content":""},
    {"title":"City Comparison","content":""},
    {"title":"Investment Opportunity","content":""},
    {"title":"Recommendation","content":""}
  ]
}
`;

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7
  });

  return JSON.parse(completion.choices[0].message.content);
};
