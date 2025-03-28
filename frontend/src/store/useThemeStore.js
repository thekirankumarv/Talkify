import { create } from "zustand";

/**
 * Theme Store:
 * - Manages application theme state (light/dark)
 * - Persists theme preference in localStorage
 * - Provides setter function for theme switching
 */
export const useThemeStore = create((set) => ({
  // Initialize theme from localStorage or default to 'light'
  theme: localStorage.getItem("chat-theme") || "light",

  /**
   * Updates theme in state and localStorage
   * @param {string} theme - The new theme ('light' or 'dark')
   */
  setTheme: (theme) => {
    console.log("Changing theme to:", theme);  // Optional debug log
    localStorage.setItem("chat-theme", theme); // Persist preference
    set({ theme });                           // Update Zustand state
  },
}));