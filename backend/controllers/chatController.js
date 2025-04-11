const { getAIResponse } = require('../models/huggingface');

const cleanAIResponse = (userMessage, aiText) => {
  let reply = aiText || '';

  // Remove original message if echoed at the start
  if (reply.toLowerCase().startsWith(userMessage.toLowerCase())) {
    reply = reply.slice(userMessage.length).trim();
  }

  // Remove prefixes like ?, Answer:, Response:, AI:
  reply = reply.replace(/^(?:\s*\?+|\s*(Answer|Response|AI)[:\-])\s*/i, '');

  // Remove leading empty lines or spaces
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
    console.error('Error in chatWithAI controller:', error?.response?.data || error.message);
    res.status(500).json({ reply: 'AI error. Please try again later.' });
  }
};

module.exports = {
  chatWithAI,
};
