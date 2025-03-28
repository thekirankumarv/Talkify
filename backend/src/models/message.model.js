import mongoose from "mongoose";

/**
 * Message Schema:
 * - Tracks conversation history between users
 * - Supports both text and image messages
 * - Includes automatic timestamps for message tracking
 */
const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",  // References User model for population
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",  // References User model for population
      required: true,
    },
    text: {
      type: String,  // Optional text content
    },
    image: {
      type: String,  // Cloudinary URL for image messages
    },
  },
  { timestamps: true }  // Adds createdAt and updatedAt automatically
);

// Create and export Message model
const Message = mongoose.model("Message", messageSchema);

export default Message;