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

  // ✅ FETCH USER (AUTO LOGIN)
  const fetchUser = useCallback(async () => {
    try {
      const response = await apiClient.get('/auth/me');
      setUser(response.data);

      if (response.data?.role) {
        localStorage.setItem('role', response.data.role);
      }
    } catch (error) {
      console.error('Fetch user failed:', error.response?.data || error.message);
      
      // 🔥 THE FIX: Only log out if the backend strictly rejects the token (401)
      // This prevents the 2-second flash-logout race condition!
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

    // 2. NEW: Listen for Supabase OAuth redirects (Google Login)
    // When Google redirects back to the app, this listener catches the new session.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const newToken = session.access_token;
        // Fetch profile from public users table or fallback to Google metadata
        const userData = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || 'Google User',
          role: session.user.user_metadata?.role || 'client' // Fallback to client if not set
        };
        
        setAuthToken(newToken, userData);
        setUser(userData);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [token, fetchUser, setAuthToken]);

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

  // ✅ NEW: GOOGLE LOGIN
  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Redirects back to the current page or specific dashboard
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
