const { getAIResponse } = require("../models/huggingface");

const cleanAIResponse = (userMessage, aiText) => {
  let reply = aiText || "";

  if (reply.toLowerCase().startsWith(userMessage.toLowerCase())) {
    reply = reply.slice(userMessage.length).trim();
  }

  reply = reply.replace(/^(?:\s*\?+|\s*(Answer|Response|AI)[:\-])\s*/i, "");

  reply = reply.trimStart();

  return reply;
};

const chatWithAI = async (req, res) => {
  const userMessage = req.body.message;

  try {
    const generatedText = await getAIResponse(userMessage);

    if (generatedText) {
      const cleanedReply = cleanAIResponse(userMessage, generatedText);
      res.json({ reply: cleanedReply });
    } else {
      res.json({ reply: "Sorry, I didn't get a response from the AI." });
    }
  } catch (error) {
    console.error(
      "Error in chatWithAI controller:",
      error?.response?.data || error.message
    );
    res.status(500).json({ reply: "AI error. Please try again later." });
  }
};

module.exports = {
  chatWithAI,
};
