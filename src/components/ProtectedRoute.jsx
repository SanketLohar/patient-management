/**
 * ProtectedRoute.jsx
 *
 * Reads auth state from AuthContext — no Firebase listener here.
 * Shows a loader only while isAppReady is false (first page load).
 * After that, navigation never triggers a loader.
 */
import { Navigate } from "react-router-dom";
import { Spin } from "antd";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, role, isAppReady } = useAuth();

  // Only show spinner on very first app load while Firebase resolves
  if (!isAppReady) {
    return (
      <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f8fafc" }}>
        <Spin size="large" />
      </div>
    );
  }

  // Not logged in → send to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role → redirect to own dashboard
  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === "Admin")  return <Navigate to="/dashboard/admin"  replace />;
    if (role === "Nurse")  return <Navigate to="/dashboard/nurse"  replace />;
    return <Navigate to="/dashboard/doctor" replace />;
  }

  return children;
}
