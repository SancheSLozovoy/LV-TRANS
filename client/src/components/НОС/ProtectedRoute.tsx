import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { useAuth } from "../../composales/useAuth.ts";

export const ProtectedRoute: React.FC = () => {
  const token = Cookies.get("accessToken");
  const { user } = useAuth();
  const location = useLocation();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin = user.role_id === 1;
  const isUser = user.role_id === 2;
  const pathname = location.pathname;

  if (isAdmin) {
    if (pathname !== "/" && !pathname.startsWith("/admin")) {
      return <Navigate to="/admin" replace />;
    }
  }

  if (isUser) {
    if (pathname.startsWith("/admin")) {
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
};
