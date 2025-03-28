import express from "express";
import { checkAuth, login, logout, signup, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes (no authentication required)
router.post("/signup", signup); // User registration
router.post("/login", login);   // User authentication
router.post("/logout", logout); // Token invalidation

// Protected routes (require valid JWT)
router.put("/update-profile", protectRoute, updateProfile); // Profile management
router.get("/check", protectRoute, checkAuth); // Session verification

export default router;