import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api';

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

    // ✅ ROLE STORE (IMPORTANT FIX)
    if (userData?.role) {
      localStorage.setItem('role', userData.role);
    } else if (!newToken) {
      localStorage.removeItem('role');
    }

    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    setAuthToken(null);
    setUser(null);
  }, [setAuthToken]);

  // ✅ FETCH USER (AUTO LOGIN)
  const fetchUser = useCallback(async () => {
    try {
      const response = await apiClient.get('/auth/me');
      setUser(response.data);

      // ensure role sync
      if (response.data?.role) {
        localStorage.setItem('role', response.data.role);
      }

    } catch (error) {
      console.error('Fetch user failed:', error.response?.data || error.message);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        setAuthToken(token);
        await fetchUser();
      } else {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [token, fetchUser, setAuthToken]);

  // ✅ LOGIN FIXED (STEP 3 APPLIED HERE)
  const login = async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });

    const newToken = response.data.token || response.data.access_token;
    const userData = response.data.user;

    if (!newToken) throw new Error('Token missing from backend');

    // 🔥 MAIN FIX
    setAuthToken(newToken, userData);
    setUser(userData);

    return userData;
  };

  // ✅ REGISTER FIXED
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

    // 🔥 SAME FIX HERE
    setAuthToken(newToken, userData);
    setUser(userData);

    return userData;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        loading,
        api: apiClient
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
