const { generateGeminiResponse } = require("../config/gemini");
const User = require("../models/userModel");
const Post = require("../models/postModel");

const chatWithAI = async (req, res) => {
  const userMessage = req.body.message;

  try {
    const users = await User.find({}, "userId name email role");
    const posts = await Post.find({})
      .populate("createdBy", "userId name")
      .select("post_id title content isDeleted isUpdated createdBy");

    const userDataText = users
      .map(
        (u) =>
          `UserID: ${u.userId}, Name: ${u.name}, Email: ${u.email}, Role: ${u.role}`
      )
      .join("\n");

    const postDataText = posts
      .map((p) => {
        const statusTags = [];
        if (p.isDeleted) statusTags.push("Deleted");
        if (p.isUpdated) statusTags.push("Updated");
        const tagString = statusTags.length
          ? ` [${statusTags.join(", ")}]`
          : "";
        return `PostID: ${p.post_id}, Title: ${p.title}, Content: ${
          p.content
        }, Created By: ${p.createdBy?.name || "Unknown"}${tagString}`;
      })
      .join("\n");

    const prompt = `
You are an AI assistant for a blogging platform.
Below is the list of registered users:
${userDataText}

Here is the list of posts with status tags like [Deleted], [Updated] if applicable:
${postDataText}

Now answer the following question from the user:
"${userMessage}"
Only provide relevant post or user details based on the question. Do not mention internal field names like isDeleted or isUpdated.
`;

    const aiReply = await generateGeminiResponse(prompt);

    res.json({ reply: aiReply });
  } catch (error) {
    console.error("Error in chatWithAI controller:", error);
    res.status(500).json({ reply: "Internal server error." });
  }
};

module.exports = {
  chatWithAI,
};
