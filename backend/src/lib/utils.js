import jwt from "jsonwebtoken";

/**
 * Generates and sets a JWT token as an HTTP-only cookie
 * @param {string} userId - User ID to encode in the token
 * @param {object} res - Express response object
 * @returns {string} Generated JWT token
 */
export const generateToken = (userId, res) => {
  // Create token with user ID payload that expires in 7 days
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // Set secure HTTP-only cookie with token
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    httpOnly: true, // Prevent client-side JS access (XSS protection)
    sameSite: "strict", // Prevent CSRF attacks
    secure: process.env.NODE_ENV !== "development", // HTTPS-only in production
  });

  return token; 
};