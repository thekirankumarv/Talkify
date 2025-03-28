import mongoose from "mongoose";

/**
 * Establishes a connection to MongoDB using the URI from environment variables.
 * Logs connection status or errors to the console.
 */
export const connectDB = async () => {
  try {
    // Attempt connection using the URI from .env
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    // Log successful connection with host info
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    // Log full error if connection fails
    console.log("MongoDB connection error:", error);
    
    // Note: Consider adding process.exit(1) here for production 
    // to force restart on DB connection failure
  }
};