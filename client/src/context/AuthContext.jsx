/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import authService from "../services/auth.service";
import { userService } from "../services/api.service";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
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
      } catch {
        logout();
        return false;
      }
    },
    [logout],
  );

  const loadDashboardStats = useCallback(async () => {
    try {
      const stats = await userService.getDashboardStats();
      const payload = stats?.data || stats;
      setDashboardStats({
        totalBookings: payload.totalBookings || 0,
        completedBookings: payload.completedBookings || 0,
        totalSpent: payload.totalSpent || 0,
        averageRating: payload.averageRating || 0,
      });
    } catch (error) {
      console.warn("Unable to load dashboard stats:", error);
      setDashboardStats({
        totalBookings: 0,
        completedBookings: 0,
        totalSpent: 0,
        averageRating: 0,
      });
    }
  }, []);

  // 🛡️ Initialize Auth on App Load
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("skillserverToken");
      const storedUser = localStorage.getItem("skillserverUser");

      if (token && storedUser) {
        const isValid = checkTokenExpiry(token);
        if (isValid) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);

          try {
            const profile = await userService.getProfile();
            setUser(profile);
            localStorage.setItem("skillserverUser", JSON.stringify(profile));
          } catch (error) {
            console.warn("Unable to refresh user profile:", error);
          }

          await loadDashboardStats();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [checkTokenExpiry, loadDashboardStats]);

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
        profilePhoto: userData.profilePhoto || "",
        location: userData.location || "",
        bio: userData.bio || "",
        profileCompletionPercentage: userData.profileCompletionPercentage || 0,
      }),
    );
    setUser({
      _id: userData._id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      profilePhoto: userData.profilePhoto || "",
      location: userData.location || "",
      bio: userData.bio || "",
      profileCompletionPercentage: userData.profileCompletionPercentage || 0,
    });
    return userData;
  };

  // 🛡️ Update local auth profile state and persist it
  const updateUser = (updates) => {
    setUser((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem("skillserverUser", JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authUser: user,
        dashboardStats,
        loadDashboardStats,
        loading,
        login,
        signup,
        logout,
        updateUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
