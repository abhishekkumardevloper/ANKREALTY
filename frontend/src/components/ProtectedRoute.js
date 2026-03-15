import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Aapke actual AuthContext ka path

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  // Agar auth state abhi load ho rahi hai
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Agar user logged in hi nahi hai, toh login page par bhejo
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Agar user logged in hai par uska role match nahi karta (e.g., wo sirf 'user' hai, 'admin' nahi)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Agar sab sahi hai, toh usko CRM Dashboard dikhao
  return children;
}
