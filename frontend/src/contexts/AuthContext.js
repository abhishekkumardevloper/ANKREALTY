import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  /**
   * ✅ FIX:
   * Wrap fetchUser inside useCallback
   * so React Hook dependency rule is satisfied
   */
  const fetchUser = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/auth/me`);
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  }, []); // no changing dependencies here

  /**
   * ✅ FIX:
   * Add fetchUser inside dependency array
   */
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token, fetchUser]);

  const login = async (email, password) => {
    const response = await axios.post(`${API}/auth/login`, { email, password });
    const { token: newToken, user: userData } = response.data;

    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);

    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    return userData;
  };

  const register = async (name, email, password, phone, role = 'user') => {
    const response = await axios.post(`${API}/auth/register`, {
      name,
      email,
      password,
      phone,
      role
    });

    const { token: newToken, user: userData } = response.data;

    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);

    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    return userData;
  };

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  }, []);

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
