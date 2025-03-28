import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

// Database and Socket.io setup
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";

// Route imports
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

/**
 * Middleware Configuration:
 * - 10MB JSON limit for message/image data
 * - Cookie parser for JWT tokens
 * - CORS restricted to frontend origin
 */
app.use(express.json({ limit: "10mb" })); // Handle large image payloads
app.use(cookieParser()); // Parse JWT HTTP-only cookies
app.use(
  cors({
    origin: "http://localhost:5173", // Only allow frontend origin
    credentials: true, // Enable cookies cross-origin
  })
);

// API Routes
app.use("/api/auth", authRoutes); // Authentication endpoints
app.use("/api/messages", messageRoutes); // Message endpoints

/**
 * Production Configuration:
 * - Serve static frontend files
 * - Enable SPA fallback routing
 */
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // Handle SPA routing
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

/**
 * Start Server:
 * - Initialize on specified PORT
 * - Connect to MongoDB
 * - Socket.io runs on same server instance
 */
server.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
  connectDB().catch(err => console.error("Database connection failed:", err));
});