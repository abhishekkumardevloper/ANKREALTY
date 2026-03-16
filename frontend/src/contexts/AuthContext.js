import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

/* ✅ IMPORTANT: Pointing to the live Render backend */
const API_BASE = "https://ankrealty.onrender.com/api";

/* ✅ Create axios instance */
const api = axios.create({
  baseURL: API_BASE
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // ---------------- SET TOKEN ----------------
  const setAuthToken = useCallback((newToken) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
      api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    } else {
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
    }
    setToken(newToken);
  }, []);

  // ---------------- LOGOUT ----------------
  const logout = useCallback(() => {
    setAuthToken(null);
    setUser(null);
  }, [setAuthToken]);

  // ---------------- FETCH CURRENT USER ----------------
  const fetchUser = useCallback(async () => {
    try {
      const response = await api.get("/auth/me");
      setUser(response.data);
    } catch (error) {
      console.error("Fetch user failed:", error.response?.data);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  // ---------------- INITIAL LOAD ----------------
  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        setAuthToken(token); // ✅ Set the header globally before fetching
        await fetchUser();
      } else {
        setLoading(false);
      }
    };

    initializeAuth();
    // ✅ Removed 'user' from dependencies to prevent infinite loops
  }, [token, fetchUser, setAuthToken]);

  // ---------------- LOGIN ----------------
  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const newToken = response.data.token || response.data.access_token;

      if (!newToken) throw new Error("Token missing from backend");

      setAuthToken(newToken);
      setUser(response.data.user);

      return response.data.user;
    } catch (error) {
      console.error("Login error:", error.response?.data);
      throw error;
    }
  };

  // ---------------- REGISTER ----------------
  const register = async (name, email, password, phone, role = "user") => {
    try {
      const response = await api.post("/auth/register", { name, email, password, phone, role });
      const newToken = response.data.token || response.data.access_token;

      if (!newToken) throw new Error("Token missing from backend");

      setAuthToken(newToken);
      setUser(response.data.user);

      return response.data.user;
    } catch (error) {
      console.error("Register error:", error.response?.data);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading, api }}>
      {children}
    </AuthContext.Provider>
  );
}
