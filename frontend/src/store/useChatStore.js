import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

/**
 * Chat Store:
 * - Manages chat state (messages, users, selected user)
 * - Handles API communication for chat operations
 * - Manages real-time message subscriptions
 */
export const useChatStore = create((set, get) => ({
  // State
  messages: [],          // Current conversation messages
  users: [],            // List of available users
  selectedUser: null,   // Currently active chat user
  isUsersLoading: false, // Loading state for users list
  isMessagesLoading: false, // Loading state for messages

  // Actions

  /**
   * Fetches all available users for sidebar
   * Updates loading state during operation
   */
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  /**
   * Loads conversation with specific user
   * @param {string} userId - Target user's ID
   */
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  /**
   * Sends new message to currently selected user
   * @param {object} messageData - Contains text/image content
   */
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Message failed to send");
    }
  },

  /**
   * Subscribes to real-time messages for current chat
   * Filters messages to only include from selected user
   */
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isRelevantMessage = newMessage.senderId === selectedUser._id;
      if (!isRelevantMessage) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  /**
   * Cleans up message subscription
   * Prevents duplicate listeners
   */
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  // Simple state setter
  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));