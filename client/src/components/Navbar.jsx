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
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

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
    { name: "About", path: "/#about" },
  ];

  // 2. SMART DASHBOARD ROUTING
  const dashboardPath =
    user?.role === "worker" ? "/worker-dashboard" : "/user-dashboard";

  return (
    <div className="fixed top-4 md:top-6 left-0 right-0 z-50 px-4 md:px-8 flex justify-center">
      <nav className="w-full max-w-7xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-[2.5rem] transition-all duration-500">
        <div className="flex items-center justify-between px-8 md:px-10 h-20">
          {/* Brand Section */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2.5 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100 group-hover:rotate-6 transition-transform duration-300">
              <Wrench className="text-white" size={20} strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase font-sans">
              Synapthire
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-600 transition-colors duration-300"
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
                    ? "text-indigo-600 border-b-2 border-indigo-600 pb-1"
                    : "text-slate-400 hover:text-indigo-600"
                }`}
              >
                <LayoutDashboard size={14} /> Dashboard
              </Link>
            )}
          </div>

          {/* Premium Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {!user ? (
              <div className="flex items-center gap-6">
                <Link
                  to="/login"
                  className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  Login
                </Link>
                <button
                  onClick={() => navigate("/signup")}
                  className="px-8 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-white bg-slate-900 hover:bg-indigo-600 rounded-[1.5rem] shadow-xl shadow-slate-200 transition-all active:scale-95"
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
                        ? "bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-300"
                        : "bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-600 hover:from-indigo-100 hover:to-blue-100 border border-indigo-200/50"
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
                  className="relative group flex items-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-400 flex items-center justify-center border-2 border-white shadow-md hover:shadow-lg transition-all overflow-hidden text-white font-black text-xs uppercase cursor-pointer"
                  >
                    {user.name?.charAt(0) || <User size={16} />}
                  </motion.div>

                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-3 py-2 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {user.name || "Profile"}
                  </div>
                </Link>

                {/* Logout Button */}
                <motion.button
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all duration-300"
                  title="Logout"
                >
                  <LogOut size={18} strokeWidth={2} />
                </motion.button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-3 text-slate-900 hover:bg-slate-50 rounded-2xl transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>
    </div>
  );
}
