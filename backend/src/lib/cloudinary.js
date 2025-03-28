import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";

// Load environment variables from .env file
config();

/**
 * Cloudinary configuration:
 * - Sets up cloud storage credentials using environment variables
 * - Required for media uploads (images/videos)
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  // Cloudinary account name
  api_key: process.env.CLOUDINARY_API_KEY,        // API key for authentication
  api_secret: process.env.CLOUDINARY_API_SECRET,  // Secret key for secure access
});

export default cloudinary;