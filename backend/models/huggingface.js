const axios = require("axios");

const getAIResponse = async (userMessage) => {
  const endpoint =
    "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1";
  const token = process.env.HUGGINGFACE_API_TOKEN;

  const response = await axios.post(
    endpoint,
    { inputs: userMessage },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data?.[0]?.generated_text || null;
};

module.exports = {
  getAIResponse,
};
