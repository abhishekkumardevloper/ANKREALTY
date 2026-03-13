import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

// ---------- Page Imports ----------
import HomePage from "./pages/HomePage";
import PropertyListingPage from "./pages/PropertyListingPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import PostPropertyPage from "./pages/PostPropertyPage"; // This acts as our premium Sell Page
import UserDashboard from "./pages/UserDashboard";
import AuthPage from "./pages/AuthPage";

import AboutPage from "./pages/about";
import ContactPage from "./pages/contact";

import BuyPage from "./pages/buy";
import RentPage from "./pages/rent";

// 🔥 Premium Pages Imports
import BlogPage from "./pages/blog";
import VideosPage from "./pages/videos";
import InsightsPage from "./pages/insight";
import CareersPage from "./pages/career";

// ---------- ADMIN & BROKER PORTAL ----------
import AdminPanel from "./admin/AdminPanel";

// ---------- Context ----------
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import "./App.css";

// ================= Protected Route (For normal users) =================
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-10 text-center flex justify-center items-center h-screen">Loading...</div>;

  if (!user) return <Navigate to="/auth" replace />;

  return children;
}

// ================= Portal Route (For Admins AND Brokers) =================
function PortalRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-10 text-center flex justify-center items-center h-screen">Loading Portal...</div>;

  if (!user) return <Navigate to="/auth" replace />;

  // Allow access if the user is an admin OR a broker
  if (user.role !== "admin" && user.role !== "broker") {
    return <Navigate to="/" replace />;
  }

  return children;
}

// ================= Main App Routing =================
function AppRoutes() {
  return (
    <Routes>

      {/* -------- PUBLIC ROUTES -------- */}
      <Route path="/" element={<HomePage />} />
      <Route path="/buy" element={<BuyPage />} />
      <Route path="/rent" element={<RentPage />} />
      
      {/* Point both /sell and /post-property directly to our premium PostPropertyPage */}
      <Route path="/sell" element={<PostPropertyPage />} /> 
      <Route path="/post-property" element={<PostPropertyPage />} /> 
      
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      
      {/* Premium Public Content Routes */}
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/videos" element={<VideosPage />} />
      <Route path="/insights" element={<InsightsPage />} />
      <Route path="/careers" element={<CareersPage />} />

      <Route path="/properties" element={<PropertyListingPage />} />
      
      {/* Dynamic Route for individual property details */}
      <Route path="/property/:id" element={<PropertyDetailPage />} /> 

      <Route path="/auth" element={<AuthPage />} />

      {/* -------- PROTECTED (Normal Users) -------- */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      {/* -------- ADMIN / BROKER PORTAL -------- */}
      {/* Map both /admin and /agent-dashboard to the AdminPanel component */}
      <Route
        path="/admin"
        element={
          <PortalRoute>
            <AdminPanel />
          </PortalRoute>
        }
      />
      <Route
        path="/agent-dashboard"
        element={
          <PortalRoute>
            <AdminPanel />
          </PortalRoute>
        }
      />

    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App selection:bg-red-200">
          <AppRoutes />
          <Toaster position="top-right" richColors />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;