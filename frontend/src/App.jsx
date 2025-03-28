import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

/**
 * Main Application Component:
 * - Manages authentication state and theme
 * - Handles protected routes and redirects
 * - Shows loading state during auth check
 */
const App = () => {
  // Auth state management
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  // Theme state management
  const { theme } = useThemeStore();

  // Check auth status on mount and theme change
  useEffect(() => {
    checkAuth();
  }, [checkAuth, theme]);

  // Show loading spinner during initial auth check
  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div data-theme={theme}>
      {/* Persistent navigation bar */}
      <Navbar />

      {/* Protected route configuration */}
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route path="/settings" element={<SettingsPage />} />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>

      {/* Global notification system */}
      <Toaster />
    </div>
  );
};

export default App;