const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

exports.createPresentation = async (city1, city2, growth) => {

  const prompt = `
Create a real estate investment presentation.

Cities:
${city1.name} growth ${city1.growth_percentage}%
${city2.name} growth ${city2.growth_percentage}%

Return JSON format:

{
slides:[
{title:"Market Overview",content:""},
{title:"City Comparison",content:""},
{title:"Investment Opportunity",content:""},
{title:"Recommendation",content:""}
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