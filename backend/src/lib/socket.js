import { Server } from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/Message.js";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";

const app = express();
const server = http.createServer(app);

/**
 * IMPORTANT CHANGES:
 * 1. origin: true  → allow same-origin (single deploy)
 * 2. transports    → polling first (Render free tier friendly)
 */
const io = new Server(server, {
  cors: {
    origin: true,
    credentials: true,
  },
  transports: ["polling", "websocket"],
});

io.use(socketAuthMiddleware);

// userId -> socketId map
const userSocketMap = {};

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.user.fullName);

  const userId = socket.user._id.toString();
  userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // 🔴 DELETE MESSAGE FEATURE
  socket.on("deleteMessage", async ({ messageId }) => {
    try {
      const message = await Message.findById(messageId);
      if (!message) return;

      if (message.senderId.toString() !== userId) return;

      message.isDeleted = true;
      message.text = null;
      message.image = null;
      message.deletedAt = new Date();
      await message.save();

      const senderSocketId = getReceiverSocketId(message.senderId.toString());
      const receiverSocketId = getReceiverSocketId(message.receiverId.toString());

      if (senderSocketId) {
        io.to(senderSocketId).emit("messageDeleted", { messageId });
      }
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("messageDeleted", { messageId });
      }
    } catch (error) {
      console.error("socket delete message error:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.user.fullName);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
