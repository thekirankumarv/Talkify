import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

// Protected message routes (all require authentication)
router.get("/users", protectRoute, getUsersForSidebar); // Get users list for sidebar
router.get("/:id", protectRoute, getMessages);          // Fetch conversation with user :id

// Send message to specific user
router.post("/send/:id", protectRoute, sendMessage);    // :id = recipient's user ID

export default router;