const { io } = require("socket.io-client");

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
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
