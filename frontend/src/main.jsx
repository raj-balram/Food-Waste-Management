import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import "leaflet/dist/leaflet.css";
import { SocketProvider } from "./context/SocketContext";
import { Toaster } from "react-hot-toast"; // 🆕 ADD THIS

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <SocketProvider>
        {/* 🆕 ADD TOASTER — works globally across all pages */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: "12px",
              fontWeight: "500",
            },
            success: {
              style: { background: "#22c55e", color: "#fff" },
              iconTheme: { primary: "#fff", secondary: "#22c55e" },
            },
            error: {
              style: { background: "#ef4444", color: "#fff" },
              iconTheme: { primary: "#fff", secondary: "#ef4444" },
            },
          }}
        />
        <App />
      </SocketProvider>
    </AuthProvider>
  </React.StrictMode>
);