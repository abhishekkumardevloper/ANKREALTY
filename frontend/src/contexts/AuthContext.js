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

  const setAuthToken = useCallback((newToken) => {
    if (newToken) {
      localStorage.setItem('token', newToken);
      apiClient.defaults.headers.common.Authorization = `Bearer ${newToken}`;
    } else {
      localStorage.removeItem('token');
      delete apiClient.defaults.headers.common.Authorization;
    }
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    setAuthToken(null);
    setUser(null);
  }, [setAuthToken]);

  const fetchUser = useCallback(async () => {
    try {
      const response = await apiClient.get('/auth/me');
      setUser(response.data);
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

  const login = async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    const newToken = response.data.token || response.data.access_token;
    if (!newToken) throw new Error('Token missing from backend');
    setAuthToken(newToken);
    setUser(response.data.user);
    return response.data.user;
  };

  const register = async (name, email, password, phone, role = 'client') => {
    const response = await apiClient.post('/auth/register', { name, email, password, phone, role });
    const newToken = response.data.token || response.data.access_token;
    if (!newToken) throw new Error('Token missing from backend');
    setAuthToken(newToken);
    setUser(response.data.user);
    return response.data.user;
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading, api: apiClient }}>
      {children}
    </AuthContext.Provider>
  );
}