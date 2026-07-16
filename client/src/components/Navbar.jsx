import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wrench,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Sparkles,
  ClipboardList,
  Sun,
  Moon,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  // 1. DYNAMIC SESSION TRACKING
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("skillserverUser");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    checkAuth();
    // Re-check when the user changes pages or storage updates
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("skillserverUser");
    setUser(null);
    navigate("/");
    setIsOpen(false);
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "About", path: "/About" },
  ];

  // 2. SMART DASHBOARD ROUTING
  const dashboardPath =
    user?.role === "worker" ? "/worker-dashboard" : "/user-dashboard";

  return (
    <div className="fixed top-4 md:top-6 left-0 right-0 z-50 px-4 md:px-8 flex justify-center">
      <nav className="w-full max-w-7xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-[2.5rem] overflow-hidden transition-all duration-500">
        <div className="flex items-center justify-between px-8 md:px-10 h-20">
          {/* Brand Section */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2.5 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100 dark:shadow-none group-hover:rotate-6 transition-transform duration-300">
              <Wrench className="text-white" size={20} strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase font-sans transition-colors duration-300">
              Synapthire
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300"
              >
                {item.name}
              </Link>
            ))}

            {/* Dashboard Link */}
            {user && (
              <Link
                to={dashboardPath}
                className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                  location.pathname.includes("dashboard")
                    ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 pb-1"
                    : "text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                }`}
              >
                <LayoutDashboard size={14} /> Dashboard
              </Link>
            )}
          </div>

          {/* Premium Auth & Theme Section */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle Button */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-3 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 rounded-2xl shadow-sm hover:shadow-md cursor-pointer flex items-center justify-center transition-all duration-300"
              title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            >
              {theme === "light" ? (
                <Moon size={18} strokeWidth={2.5} className="text-indigo-600 dark:text-indigo-400" />
              ) : (
                <Sun size={18} strokeWidth={2.5} className="text-amber-500" />
              )}
            </motion.button>

            {!user ? (
              <div className="flex items-center gap-6">
                <Link
                  to="/login"
                  className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-600 hover:text-indigo-600 dark:hover:text-indigo-450 transition-colors"
                >
                  Login
                </Link>
                <button
                  onClick={() => navigate("/signup")}
                  className="px-8 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-white dark:text-slate-900 bg-slate-900 dark:bg-white hover:bg-indigo-600 dark:hover:bg-indigo-500 dark:hover:text-white rounded-[1.5rem] shadow-xl shadow-slate-200 dark:shadow-none transition-all active:scale-95"
                >
                  Join Us
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {/* My Bookings Button - Only for Users */}
                {user?.role !== "worker" && (
                  <motion.button
                    whileHover={{ scale: 1.08, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/dashboard")}
                    className={`relative p-2.5 rounded-xl transition-all duration-300 flex items-center justify-center group ${
                      location.pathname === "/dashboard"
                        ? "bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-300 dark:shadow-none"
                        : "bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-800 dark:to-slate-800 text-indigo-600 dark:text-indigo-450 hover:from-indigo-100 hover:to-blue-100 dark:hover:from-slate-700 dark:hover:to-slate-700 border border-indigo-200/50 dark:border-slate-750"
                    }`}
                    title="My Bookings"
                  >
                    <ClipboardList size={18} strokeWidth={2} />
                    {location.pathname === "/dashboard" && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                    )}
                  </motion.button>
                )}

                {/* Profile Avatar Button */}
                <Link
                  to={user?.role === "worker" ? "/worker-profile" : "/profile"}
                  className="relative group flex items-center gap-2.5"
                >
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-400 flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-md hover:shadow-lg transition-all overflow-hidden text-white font-black text-xs uppercase cursor-pointer shrink-0"
                  >
                    {user?.profilePhoto ? (
                      <img
                        src={user.profilePhoto}
                        alt={user.name || "Profile"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user.name?.charAt(0) || <User size={16} />
                    )}
                  </motion.div>

                  <span className="hidden lg:inline text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 select-none">
                    {user.name}
                  </span>

                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3 py-2 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {user.name || "Profile"}
                  </div>
                </Link>

                {/* Logout Button */}
                <motion.button
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="p-2.5 text-slate-500 dark:text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-all duration-300"
                  title="Logout"
                >
                  <LogOut size={18} strokeWidth={2} />
                </motion.button>
              </div>
            )}
          </div>

          {/* Theme Toggle & Mobile Menu Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2.5 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 rounded-xl"
              title="Toggle Theme"
            >
              {theme === "light" ? (
                <Moon size={16} className="text-indigo-600" />
              ) : (
                <Sun size={16} className="text-amber-400" />
              )}
            </button>
            <button
              className="p-2.5 text-slate-900 dark:text-slate-100 hover:bg-slate-55 dark:hover:bg-slate-800 rounded-2xl transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/20 dark:border-slate-800/40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl"
            >
              <div className="px-8 py-6 space-y-4">
                {/* Mobile User Header */}
                {user && (
                  <div className="flex items-center gap-3 pb-5 border-b border-slate-100 dark:border-slate-800/80 mb-5">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-400 flex items-center justify-center border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden text-white font-black text-xs uppercase shrink-0">
                      {user.profilePhoto ? (
                        <img src={user.profilePhoto} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        user.name?.charAt(0) || <User size={16} />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800 dark:text-slate-100 leading-none">{user.name}</p>
                      <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-1">{user.role}</p>
                    </div>
                  </div>
                )}
                {/* Navigation Links */}
                {navLinks.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className="block text-base font-semibold text-slate-700 dark:text-slate-350 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors py-2"
                  >
                    {item.name}
                  </Link>
                ))}

                {/* Dashboard Link */}
                {user && (
                  <Link
                    to={dashboardPath}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 text-base font-semibold text-slate-700 dark:text-slate-350 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors py-2"
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Link>
                )}

                <div className="border-t border-slate-200 dark:border-slate-800 pt-4 mt-4">
                  {!user ? (
                    <div className="space-y-3">
                      <Link
                        to="/login"
                        onClick={() => setIsOpen(false)}
                        className="block w-full text-center py-3 text-base font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        Login
                      </Link>
                      <button
                        onClick={() => {
                          navigate("/signup");
                          setIsOpen(false);
                        }}
                        className="w-full py-3 text-base font-semibold text-white dark:text-slate-900 bg-slate-900 dark:bg-white hover:bg-indigo-600 dark:hover:bg-indigo-500 rounded-xl transition-colors"
                      >
                        Join Us
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* My Bookings - Only for Users */}
                      {user?.role !== "worker" && (
                        <button
                          onClick={() => {
                            navigate("/dashboard");
                            setIsOpen(false);
                          }}
                          className="flex items-center gap-3 w-full py-3 text-base font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        >
                          <ClipboardList size={18} />
                          My Bookings
                        </button>
                      )}

                      {/* Profile */}
                      <Link
                        to={
                          user?.role === "worker"
                            ? "/worker-profile"
                            : "/profile"
                        }
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 py-3 text-base font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        <User size={18} />
                        Profile
                      </Link>

                      {/* Logout */}
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full py-3 text-base font-semibold text-slate-700 dark:text-slate-300 hover:text-rose-600 transition-colors"
                      >
                        <LogOut size={18} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
}
