import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";

/**
 * React Application Bootstrap:
 * - Initializes React 18's concurrent root
 * - Wraps app with StrictMode for development checks
 * - Provides client-side routing via BrowserRouter
 */
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);