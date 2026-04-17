import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api';
import { supabase } from '@/lib/supabase'; 

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // ✅ SET TOKEN + ROLE
  const setAuthToken = useCallback((newToken, userData = null) => {
    if (newToken) {
      localStorage.setItem('token', newToken);
      apiClient.defaults.headers.common.Authorization = `Bearer ${newToken}`;
    } else {
      localStorage.removeItem('token');
      delete apiClient.defaults.headers.common.Authorization;
    }

    // ✅ ROLE STORE
    if (userData?.role) {
      localStorage.setItem('role', userData.role);
    } else if (!newToken) {
      localStorage.removeItem('role');
    }

    setToken(newToken);
  }, []);

  const logout = useCallback(async () => {
    // Also sign out from Supabase client to clear local session
    await supabase.auth.signOut();
    setAuthToken(null);
    setUser(null);
  }, [setAuthToken]);

  // ✅ FETCH USER (AUTO LOGIN / PAGE REFRESH)
  const fetchUser = useCallback(async () => {
    try {
      const response = await apiClient.get('/auth/me');
      
      // 🔥 FIX 1: Safely extract user object to prevent payload mismatch on refresh
      const userData = response.data.user || response.data;
      setUser(userData);

      if (userData?.role) {
        localStorage.setItem('role', userData.role);
      }
    } catch (error) {
      console.error('Fetch user failed:', error.response?.data || error.message);
      
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    // 1. Initialize standard auth from local storage
    const initializeAuth = async () => {
      if (token) {
        setAuthToken(token);
        await fetchUser();
      } else {
        setLoading(false);
      }
    };
    initializeAuth();

    // 2. Listen for Supabase OAuth redirects (Google Login)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const newToken = session.access_token;
        
        // Set token immediately so the API call below is authorized
        setAuthToken(newToken); 

        try {
          // 🔥 FIX 3: Fetch the real role from your backend instead of defaulting to "client"
          const response = await apiClient.get('/auth/me');
          const realUserData = response.data.user || response.data;
          
          setAuthToken(newToken, realUserData);
          setUser(realUserData);
        } catch (err) {
          console.error("Failed to fetch user after Google Login", err);
          // Fallback if the user doesn't exist in the backend DB yet
          const fallbackData = {
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || 'Google User',
            role: session.user.user_metadata?.role || 'client' 
          };
          setAuthToken(newToken, fallbackData);
          setUser(fallbackData);
        } finally {
          setLoading(false);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
    // 🔥 FIX 2: Removed 'token' from dependency array to prevent infinite re-renders
  }, [fetchUser, setAuthToken]); 

  // ✅ LOGIN (Email/Password)
  const login = async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });

    const newToken = response.data.token || response.data.access_token;
    const userData = response.data.user;

    if (!newToken) throw new Error('Token missing from backend');

    setAuthToken(newToken, userData);
    setUser(userData);

    return userData;
  };

  // ✅ REGISTER (Email/Password)
  const register = async (name, email, password, phone, role = 'client') => {
    const response = await apiClient.post('/auth/register', {
      name,
      email,
      password,
      phone,
      role
    });

    const newToken = response.data.token || response.data.access_token;
    const userData = response.data.user;

    if (!newToken) throw new Error('Token missing from backend');

    setAuthToken(newToken, userData);
    setUser(userData);

    return userData;
  };

  // ✅ GOOGLE LOGIN
  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/' 
      }
    });

    if (error) {
      console.error('Google Auth Error:', error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        loginWithGoogle,
        logout,
        loading,
        api: apiClient
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
