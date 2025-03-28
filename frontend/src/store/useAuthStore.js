import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

// Configure base URL based on environment
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

/**
 * Authentication Store:
 * - Manages user authentication state and session
 * - Handles all auth operations (login, signup, logout)
 * - Manages WebSocket connections for real-time features
 */
export const useAuthStore = create((set, get) => ({
  // State
  authUser: null,            // Current authenticated user data
  isSigningUp: false,       // Signup process loading state
  isLoggingIn: false,       // Login process loading state
  isUpdatingProfile: false, // Profile update loading state
  isCheckingAuth: true,     // Initial auth check flag
  onlineUsers: [],          // List of online user IDs
  socket: null,             // WebSocket connection instance

  /**
   * Verifies active session on app load
   * Connects socket if authenticated
   */
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Auth check failed:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  /**
   * Handles new user registration
   * @param {Object} data - Contains email, password, fullName
   */
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  /**
   * Authenticates existing user
   * @param {Object} data - Contains email and password
   */
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  /**
   * Terminates user session
   * Disconnects socket connection
   */
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  },

  /**
   * Updates user profile information
   * @param {Object} data - Contains new profile data
   */
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  /**
   * Establishes WebSocket connection
   * - Only connects if user is authenticated
   * - Prevents duplicate connections
   */
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id, // Send user ID for socket association
      },
    });

    socket.connect();
    set({ socket });

    // Update online users list in real-time
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  /**
   * Cleans up WebSocket connection
   * Prevents memory leaks on logout
   */
  disconnectSocket: () => {
    if (get().socket?.connected) {
      get().socket.disconnect();
    }
  },
}));