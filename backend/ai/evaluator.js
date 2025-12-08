import dotenv from "dotenv";
dotenv.config();

import Groq from "groq-sdk";

export const groqClient = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const evaluateWithGroq = async (taskDescription, code) => {
  const prompt = `
You are an expert coding evaluator.

Evaluate the user's code submission STRICTLY in JSON format with the following fields:
{
  "score": number (0-100),
  "strengths": ["point 1", "point 2", ...],
  "improvements": ["point 1", "point 2", ...],
  "fullFeedback": "Detailed written feedback"
}

DO NOT wrap the JSON in code blocks.
DO NOT add backticks.
Return ONLY pure JSON.

Task Description:
${taskDescription}

User's Code:
${code}
`;

  const response = await groqClient.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.2,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = response.choices[0].message.content.trim();

  // Remove code fences if the model ignored the instructions
  let clean = raw
    .replace(/```json/i, "")
    .replace(/```/g, "")
    .trim();

  let parsed;
  try {
    parsed = JSON.parse(clean);
  } catch (err) {
    console.error("CLEANED JSON FAILED:", clean);
    throw new Error("AI returned invalid JSON after cleaning. Raw: " + raw);
  }

  return {
    score: parsed.score,
    strengths: parsed.strengths,
    improvements: parsed.improvements,
    fullFeedback: parsed.fullFeedback,
  };
};
