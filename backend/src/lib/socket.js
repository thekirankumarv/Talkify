import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

// Socket.IO server configuration with CORS for local development
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"], // Allow connections from frontend dev server
  },
});

/**
 * Utility function to get socket ID of a connected user
 * @param {string} userId - User ID from database
 * @returns {string} Corresponding socket ID if user is online
 */
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// Maps user IDs to their active socket connections
// Format: { [userId]: socketId }
const userSocketMap = {};

// Handle new socket connections
io.on("connection", (socket) => {
  console.log("New connection:", socket.id);

  // Associate user ID with socket connection
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // Broadcast updated online users list to all clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };