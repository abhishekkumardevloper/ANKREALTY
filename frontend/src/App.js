import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';

// ---------- Page Imports ----------
import HomePage from './pages/HomePage';
import PropertyListingPage from './pages/PropertyListingPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import PostPropertyPage from './pages/PostPropertyPage';
import UserDashboard from './pages/UserDashboard';
import AgentDashboard from './pages/AgentDashboard';
import AuthPage from './pages/AuthPage';

// ⚠️ IMPORTANT — Same names as your files
import AboutPage from './pages/about';
import ContactPage from './pages/contact';   // ← your file is contact.js

import BuyPage from './pages/buy';           // ← buy.js
import SellPage from './pages/sell';         // ← sell.js
import RentPage from './pages/rent';         // ← rent.js

// ---------- Context ----------
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.css';


// ---------- Protected Route ----------
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return user ? children : <Navigate to="/auth" />;
}


// ---------- Main App ----------
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>

            {/* -------- PUBLIC ROUTES -------- */}
            <Route path="/" element={<HomePage />} />

            {/* Navbar Pages */}
            <Route path="/buy" element={<BuyPage />} />
            <Route path="/sell" element={<SellPage />} />
            <Route path="/rent" element={<RentPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Property Pages */}
            <Route path="/properties" element={<PropertyListingPage />} />
            <Route path="/properties/:id" element={<PropertyDetailPage />} />

            <Route path="/auth" element={<AuthPage />} />


            {/* -------- PROTECTED ROUTES -------- */}
            <Route
              path="/post-property"
              element={
                <ProtectedRoute>
                  <PostPropertyPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/agent-dashboard"
              element={
                <ProtectedRoute>
                  <AgentDashboard />
                </ProtectedRoute>
              }
            />

          </Routes>

          {/* Toast Notifications */}
          <Toaster position="top-right" />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
