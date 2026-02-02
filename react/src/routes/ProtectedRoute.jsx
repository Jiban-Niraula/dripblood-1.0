// src/routes/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("admin_token"); // Check if token exists
  if (!token) {
    return <Navigate to="/login" replace />; // redirect if not logged in
  }
  return children;
}