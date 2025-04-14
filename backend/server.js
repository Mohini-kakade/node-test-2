const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const postRoutes = require("./routes/postRoutes");
const dotenv = require("dotenv");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  connectTimeout: 5000,
  pingTimeout: 10000,
  pingInterval: 25000,
  allowEIO3: true,
  transports: ["websocket"],
});

app.set("io", io);

io.use((socket, next) => {
  console.log("Socket connection attempt:", socket.handshake.query);
  next();
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

app.use("/api/auth", authRoutes);
app.use("/chat", chatRoutes);
app.use("/posts", postRoutes);

server.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
  console.log("Socket.IO endpoint: ws://localhost:5000/socket.io/");
});
