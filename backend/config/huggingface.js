const axios = require("axios");

const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;


const huggingfaceInstance = axios.create({
  baseURL:
    "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1",
  headers: {
    Authorization: `Bearer ${HUGGINGFACE_API_TOKEN}`,
  },
});

const getAIResponse = async (prompt) => {
  try {
    const response = await huggingfaceInstance.post("/", { inputs: prompt });
    return response.data[0]?.generated_text;
  } catch (error) {
    console.error("Error getting AI response:", error);
    throw error;
  }
};

module.exports = {
  getAIResponse,
};
