import mongoose from "mongoose";

/**
 * User Schema:
 * - Stores essential user account information
 * - Enforces email uniqueness and password complexity
 * - Tracks profile picture and timestamps automatically
 */
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,  // Prevents duplicate accounts
    },
    fullName: {
      type: String,
      required: true,  // Ensures profile completeness
    },
    password: {
      type: String,
      required: true,
      minlength: 6,  // Basic password complexity
    },
    profilePic: {
      type: String,
      default: "",  // Empty string until user uploads an image
    },
  },
  { timestamps: true }  // Adds createdAt and updatedAt automatically
);

// Compile and export the User model
const User = mongoose.model("User", userSchema);

export default User;