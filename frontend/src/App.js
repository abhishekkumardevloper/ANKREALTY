import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';

// Page Imports
import HomePage from './pages/HomePage';
import PropertyListingPage from './pages/PropertyListingPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import PostPropertyPage from './pages/PostPropertyPage';
import UserDashboard from './pages/UserDashboard';
import AgentDashboard from './pages/AgentDashboard';
import AuthPage from './pages/AuthPage';
import AboutPage from './pages/AboutPage';     // <-- Added
import ContactPage from './pages/ContactPage'; // <-- Added

// Context Imports
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.css';

// Protected Route Component
// This ensures only logged-in users can access specific pages
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  // Optional: Add a loading state check if your AuthContext has one
  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return user ? children : <Navigate to="/auth" />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>
            {/* --- Public Routes --- */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />       {/* <-- New Route */}
            <Route path="/contact" element={<ContactPage />} />   {/* <-- New Route */}
            <Route path="/properties" element={<PropertyListingPage />} />
            <Route path="/properties/:id" element={<PropertyDetailPage />} />
            <Route path="/auth" element={<AuthPage />} />

            {/* --- Protected Routes (Require Login) --- */}
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
