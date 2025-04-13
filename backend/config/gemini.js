const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
require("dotenv").config();

const API_KEY = process.env.GOOGLE_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

const generateGeminiResponse = async (prompt) => {
  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      safetySettings: safetySettings,
      generationConfig: {
        temperature: 0.3,
      },
    });

    const response = result.response;
    if (!response || !response.candidates || !response.candidates[0]?.content) {
      return "I couldn't generate a response at this time.";
    }

    return response.candidates[0].content.parts[0].text.trim();
  } catch (error) {
    console.error("Error from Gemini:", error);
    return "Gemini AI could not process your request.";
  }
};

module.exports = { generateGeminiResponse };
