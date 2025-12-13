import dotenv from "dotenv";
dotenv.config();

import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const fixCodeWithAI = async (language, code) => {
  const prompt = `
You are an expert software engineer.

Fix the following ${language} code.
Return ONLY valid JSON in this exact format:

{
  "fixedCode": "The fixed code string. IMPORTANT: Use \\n for newlines and spaces for indentation to make it readable.",
  "issuesFound": ["issue 1", "issue 2"],
  "explanation": "clear explanation of what was wrong"
}

Rules:
- DO NOT wrap output in backticks
- Return ONLY pure JSON
- Maintain proper code indentation using spaces
- Fix logical, syntax, and runtime issues

Buggy Code:
${code}
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.2,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = response.choices[0].message.content.trim();

  // Clean possible code fences
  const clean = raw
    .replace(/```json/i, "")
    .replace(/```/g, "")
    .trim();

  let parsed;
  try {
    parsed = JSON.parse(clean);
  } catch (err) {
    throw new Error("Invalid AI JSON output");
  }

  return parsed;
};
