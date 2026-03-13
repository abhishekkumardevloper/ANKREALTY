import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from "react";
import axios from "axios";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

/* ✅ IMPORTANT:
   NO trailing slash at end
*/
const API_BASE = "http://127.0.0.1:8000/api";

/* ✅ Create axios instance */
const api = axios.create({
  baseURL: API_BASE
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() =>
    localStorage.getItem("token")
  );
  const [loading, setLoading] = useState(true);

  // ---------------- SET TOKEN ----------------
  const setAuthToken = (newToken) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
      api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    } else {
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
    }
    setToken(newToken);
  };

  // ---------------- LOGOUT ----------------
  const logout = useCallback(() => {
    setAuthToken(null);
    setUser(null);
  }, []);

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
 // ---------------- INITIAL LOAD ----------------
  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        // Agar user state mein pehle se hai (jaise login ke baad), toh dobara fetch mat karo
        if (!user) {
          await fetchUser();
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [token, fetchUser, user]);

  // ---------------- LOGIN ----------------
  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password
      });

      const newToken =
        response.data.token || response.data.access_token;

      if (!newToken) {
        throw new Error("Token missing from backend");
      }

      setAuthToken(newToken);
      setUser(response.data.user);

      return response.data.user;
    } catch (error) {
      console.error("Login error:", error.response?.data);
      throw error;
    }
  };

  // ---------------- REGISTER ----------------
  const register = async (
    name,
    email,
    password,
    phone,
    role = "user"
  ) => {
    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
        phone,
        role
      });

      const newToken =
        response.data.token || response.data.access_token;

      if (!newToken) {
        throw new Error("Token missing from backend");
      }

      setAuthToken(newToken);
      setUser(response.data.user);

      return response.data.user;
    } catch (error) {
      console.error("Register error:", error.response?.data);
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
        logout,
        loading,
        api   // 🔥 export api for other pages
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}