import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export default function ProtectedRoute({ children }) {
  const { loggedIn } = useAuth();
  if (!loggedIn) return <Navigate to="/login" replace />;
  return children;
}
