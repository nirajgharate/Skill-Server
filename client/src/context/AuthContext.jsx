import React, { createContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import authService from "../services/auth.service";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🛡️ Centralized Logout
  const logout = useCallback(() => {
    localStorage.removeItem("skillserverToken");
    localStorage.removeItem("skillserverUser");
    setUser(null);
    window.location.href = "/login"; // Force reset to clean state
  }, []);

  // 🛡️ JWT Expiry Checker
  const checkTokenExpiry = useCallback(
    (token) => {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          logout();
          return false;
        }
        return true;
      } catch (e) {
        logout();
        return false;
      }
    },
    [logout],
  );

  // 🛡️ Initialize Auth on App Load
  useEffect(() => {
    const token = localStorage.getItem("skillserverToken");
    const storedUser = localStorage.getItem("skillserverUser");

    if (token && storedUser) {
      const isValid = checkTokenExpiry(token);
      if (isValid) {
        setUser(JSON.parse(storedUser));
      }
    }
    setLoading(false);
  }, [checkTokenExpiry]);

  // 🛡️ Login Action
  const login = async (email, password) => {
    const data = await authService.login({ email, password });
    localStorage.setItem("skillserverToken", data.token);
    localStorage.setItem("skillserverUser", JSON.stringify(data));
    setUser(data);
    return data;
  };

  // 🛡️ Signup Action (for both users and workers)
  const signup = (userData) => {
    localStorage.setItem("skillserverToken", userData.token);
    localStorage.setItem(
      "skillserverUser",
      JSON.stringify({
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
      }),
    );
    setUser({
      _id: userData._id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
    });
    return userData;
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};
