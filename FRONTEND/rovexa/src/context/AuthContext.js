// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchMe() {
    try {
      // 1) Check tokens first – if none, DO NOT hit /me
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (!accessToken) {
        console.log("fetchMe: no accessToken, treating as logged out");
        setUser(null);
        setLoading(false);
        return;
      }

      // optional: if you also want refreshToken to exist
      if (!refreshToken) {
        console.log("fetchMe: no refreshToken, treating as logged out");
        setUser(null);
        setLoading(false);
        return;
      }

      // 2) Actually call /me only when we *have* tokens
      const data = await authService.getMe();
      // expected: { authenticated: true, user: {...} }
      if (data?.authenticated && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      const status = err?.response?.status;
      const respData = err?.response?.data;

      if (status === 401 || err?.message === "No refreshToken stored") {
        console.log("fetchMe: not authenticated (401 from /me or no refresh)");
        setUser(null);
      } else {
        console.error(
          "fetchMe error",
          status || "no-status",
          respData || err.message || err
        );
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }

  // On app mount, try to load user only if we have tokens
  useEffect(() => {
    fetchMe();
  }, []);

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("logout error", err);
    } finally {
      setUser(null);
      // make sure tokens are cleared if backend call failed
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  };

  const sendOtp = async (email, opts = {}) => {
    return authService.sendOtp(email, opts.purpose || "login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        logout,
        refreshUser: fetchMe,
        sendOtp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
