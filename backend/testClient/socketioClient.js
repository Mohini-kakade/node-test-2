const readline = require("readline");
const axios = require("axios");
const { io } = require("socket.io-client");
require("dotenv").config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const apiUrl = "http://localhost:5000";

const askLogin = () => {
  rl.question("Enter your email: ", (email) => {
    rl.question("Enter your password: ", (password) => {
      authenticateUser(email, password);
    });
  });
};

const authenticateUser = async (email, password) => {
  try {
    const response = await axios.post(`${apiUrl}/api/auth/login`, {
      email,
      password,
    });
    const token = response.data.token;

    console.log("Successfully logged in!");

    connectToSocket(token);
  } catch (error) {
    console.error(
      "Error logging in:",
      error.response ? error.response.data.msg : error.message
    );
    rl.close();
  }
};

const connectToSocket = (token) => {
  const socket = io(apiUrl, {
    transports: ["websocket"],
    query: { token },
  });

  socket.on("connect", () => {
    console.log("✅ Connected to socket with id:", socket.id);
  });

  socket.on("new_post", (data) => {
    console.log("🆕 New post received:", data);
  });

  socket.on("post_updated", (data) => {
    console.log("✏️ Post updated:", data);
  });

  socket.on("post_deleted", (data) => {
    console.log("❌ Post deleted:", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ Disconnected from socket");
  });
};

askLogin();
