import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

/**
 * Authentication middleware that:
 * 1. Checks for JWT token in cookies
 * 2. Verifies token validity
 * 3. Attaches authenticated user to request
 * 4. Blocks unauthorized access with clear error messages
 */
export const protectRoute = async (req, res, next) => {
  try {
    // 1. Extract token from HTTP-only cookie
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No Token Provided" });
    }

    // 2. Verify token signature and expiration
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    // 3. Fetch user (excluding password) and verify existence
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 4. Attach user to request for downstream middleware/routes
    req.user = user;

    next();
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    // Differentiate between verification errors and server errors
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Unauthorized - Token Expired" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};