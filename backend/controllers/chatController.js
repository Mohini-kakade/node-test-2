const { generateGeminiResponse } = require("../config/gemini");
const User = require("../models/userModel");
const Post = require("../models/postModel");

const chatWithAI = async (req, res) => {
  const userMessage = req.body.message;
  const userId = req.user.id;

  try {
    const loggedInUser = await User.findById(userId).select("name email role");
    if (!loggedInUser) {
      return res.status(400).json({ reply: "User not found." });
    }

    let allUsersText = "";

    const posts = await Post.find().select(
      "post_id title content isDeleted isUpdated createdAt updatedAt userId"
    );

    const visiblePosts = posts.filter((post) => !post.isDeleted);

    if (loggedInUser.role === "admin") {
      const allUsers = await User.find().select("name email role _id");
      allUsersText = allUsers
        .map(
          (user) =>
            `UserID: ${user._id}\nName: ${user.name}\nEmail: ${user.email}\nRole: ${user.role}\n`
        )
        .join("\n");
    }

    const postsCreated = visiblePosts.length;
    const postsDeleted = posts.filter((post) => post.isDeleted).length;
    const postsUpdated = visiblePosts.filter((post) => post.isUpdated).length;

    const updatedPosts = visiblePosts
      .filter((post) => post.isUpdated)
      .map(
        (p) =>
          `PostID: ${p.post_id}\nTitle: ${p.title}\nContent: ${p.content}\nUpdated At: ${p.updatedAt}\n`
      )
      .join("\n");

    const postDataText = visiblePosts
      .map(
        (p) =>
          `PostID: ${p.post_id}\nTitle: ${p.title}\nContent: ${p.content}\nCreated At: ${p.createdAt}\nAuthor: ${p.userId}\n`
      )
      .join("\n");

    const userDataText = `UserID: ${loggedInUser._id}\nName: ${loggedInUser.name}\nEmail: ${loggedInUser.email}\nRole: ${loggedInUser.role}`;

    const prompt = `
You are an AI assistant for a blogging platform.

Logged-in user details:
${userDataText}

${
  loggedInUser.role === "admin"
    ? `As an admin, you have access to all users and all posts.

All registered users:
${allUsersText}

All posts:
${postDataText}
`
    : `As a regular user, you have access to all posts but not all users.

All posts:
${postDataText}`
}
  
Number of posts created: ${postsCreated}
Number of posts deleted: ${postsDeleted}
Number of posts updated: ${postsUpdated}

Updated posts:
${updatedPosts || "No posts have been updated."}

Now, answer the following question from the user:
"${userMessage}"

Provide accurate and clear answers based on the information available to this user.
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
