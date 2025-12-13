import { fixCodeWithAI } from "../ai/codeFixer.js";

const SUPPORTED_LANGUAGES = ["java", "python", "c", "cpp", "javascript"];

export const fixCode = async (req, res) => {
  try {
    const { language, code } = req.body;

    if (!language || !code) {
      return res.status(400).json({
        message: "Language and code are required",
      });
    }

    if (!SUPPORTED_LANGUAGES.includes(language.toLowerCase())) {
      return res.status(400).json({
        message: "Unsupported language",
        supported: SUPPORTED_LANGUAGES,
      });
    }

    const result = await fixCodeWithAI(language, code);

    return res.status(200).json({
      success: true,
      language,
      ...result,
    });
  } catch (err) {
    console.error("AI Fix Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "AI failed to fix the code",
    });
  }
};
