const http = require("http");
const express = require("express");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Socket.io
io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);

  socket.on("user-message", (message) => {
    // Validate message
    if (!message || typeof message !== "object" || !message.text || !message.senderId) {
      console.warn("Invalid message received:", message);
      return;
    }

    // Add server-side timestamp
    const timestamp = new Date().toISOString();
    const broadcastMessage = {
      text: message.text,
      senderId: message.senderId,
      timestamp,
    };

    io.emit("message", broadcastMessage);
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

app.use(express.static(path.resolve("./public")));

app.get("/", (req, res) => {
  return res.sendFile(path.resolve("./public/index.html"));
});

server.listen(9000, () => console.log(`Server Started at PORT:9000`));
