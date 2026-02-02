// src/routes/PublicRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
  const token = localStorage.getItem("admin_token");
  if (token) {
    return <Navigate to="/dashboard" replace />; // redirect logged-in users
  }
  return children;
}
