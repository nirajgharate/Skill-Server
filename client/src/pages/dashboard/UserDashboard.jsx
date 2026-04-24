import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  MapPin,
  Star,
  Calendar,
  Wallet,
  Bell,
  LogOut,
  Edit3,
  TrendingUp,
  Zap,
  Award,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Phone,
  MessageSquare,
  RefreshCw,
  Home,
  User as UserIcon,
  MoreVertical,
  Briefcase,
  DollarSign,
  Wrench,
  Search,
  Sparkles,
  ShieldCheck,
  Settings,
  ArrowUpRight,
  ArrowDownRight,
  TrendingDown,
  BarChart3,
  Activity,
  Zap as ZapIcon,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api/api";
import { useAuth } from "../../hooks/useAuth";
import { useSocket } from "../../hooks/useSocket";
import { userService } from "../../services/api.service";

export default function UserDashboard() {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const { registerUser, on, off } = useSocket();

  const [user, setUser] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({
    totalBookings: 0,
    completedBookings: 0,
    totalSpent: 0,
    averageRating: 0,
    activeBookings: [],
    recentBookings: [],
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Load from localStorage immediately
    const stored = localStorage.getItem("skillserverUser");
    if (stored) {
      const userData = JSON.parse(stored);
      setUser(userData);
      // Show user immediately, then load stats in background
      setLoading(false);
    }
    // Load full data
    loadUserData();
  }, [authUser]);

  useEffect(() => {
    const stored = localStorage.getItem("skillserverUser");
    if (stored) {
      const userData = JSON.parse(stored);
      registerUser(userData._id, "user");

      const handleBookingUpdate = (data) => {
        console.log("📡 Booking status changed:", data);
        if (data.userId === userData._id) {
          loadUserData(); // Refresh dashboard data
        }
      };

      const handleUserUpdate = (data) => {
        console.log("📡 User profile updated:", data);
        if (data.userId === userData._id) {
          setUser((prev) => ({ ...prev, ...data.updates }));
        }
      };

      on("booking_status_changed", handleBookingUpdate);
      on("user_profile_updated", handleUserUpdate);

      return () => {
        off("booking_status_changed", handleBookingUpdate);
        off("user_profile_updated", handleUserUpdate);
      };
    }
  }, [registerUser, on, off]);

  const loadUserData = async () => {
    try {
      const stored = localStorage.getItem("skillserverUser");
      if (stored) {
        const userData = JSON.parse(stored);
        setUser(userData);

        if (authUser?._id) {
          try {
            // Load dashboard stats using service file - background load
            const statsResponse = await userService.getDashboardStats();
            setDashboardStats(statsResponse.data);
          } catch (err) {
            console.log("Using default stats");
            // Set default stats from stored data
            setDashboardStats({
              totalBookings: 0,
              completedBookings: 0,
              totalSpent: 0,
              averageRating: 0,
              activeBookings: [],
              recentBookings: [],
            });
          }
        }
      }
    } catch (err) {
      console.error("Error loading data:", err);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadUserData(); // Only load stats, not full data
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-16 h-16 border-4 border-slate-300 border-t-indigo-600 rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <p className="text-slate-600 font-semibold mb-4">
            Error loading dashboard
          </p>
          <button
            onClick={loadUserData}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Enhanced Header */}
      <div className="relative z-40 backdrop-blur-lg bg-white/80 border-b border-slate-200/50 mt-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left Section */}
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center cursor-pointer"
                onClick={() => navigate("/user-profile")}
              >
                <img
                  src={
                    user.profilePhoto ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`
                  }
                  alt={user.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </motion.div>
              <div>
                <p className="text-slate-900 font-bold text-sm md:text-base">
                  {user.name}
                </p>
                <p className="text-slate-500 text-xs">Customer Portal</p>
              </div>
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-full transition-all disabled:opacity-50"
              >
                <RefreshCw
                  size={18}
                  className={`text-slate-600 ${refreshing ? "animate-spin" : ""}`}
                />
              </motion.button>

              <Link
                to="/notifications"
                className="relative p-2.5 bg-slate-100 hover:bg-slate-200 rounded-full transition-all group"
              >
                <Bell size={18} className="text-slate-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </Link>

              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate("/user-profile")}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg font-semibold text-sm hover:shadow-lg hover:shadow-indigo-500/30 transition-all hidden sm:block"
              >
                Edit Profile
              </motion.button>

              <button
                onClick={() => {
                  localStorage.removeItem("skillserverUser");
                  navigate("/login");
                }}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-full transition-all text-slate-600"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-6">
        {/* Hero Section - Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-600 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden relative"
        >
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/5 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* Welcome Message */}
              <div>
                <p className="text-indigo-100 text-sm font-semibold mb-2">
                  WELCOME BACK
                </p>
                <p className="text-white font-black text-2xl">
                  Ready to book services?
                </p>
              </div>

              {/* Total Spent */}
              <div>
                <p className="text-indigo-100 text-sm font-semibold mb-2">
                  TOTAL SPENT
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-4xl font-black text-white">
                    ₹{dashboardStats.totalSpent}
                  </p>
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-emerald-300"
                  >
                    <TrendingUp size={24} />
                  </motion.div>
                </div>
              </div>

              {/* Active Bookings */}
              <div>
                <p className="text-indigo-100 text-sm font-semibold mb-2">
                  ACTIVE BOOKINGS
                </p>
                <div className="flex items-center gap-2">
                  <Briefcase size={20} className="text-yellow-300" />
                  <span className="text-white font-black text-2xl">
                    {dashboardStats.activeBookings.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-6 border-t border-white/20">
              <div className="flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => navigate("/services")}
                  className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transition-all flex items-center gap-2 border border-white/30"
                >
                  <Wrench size={18} />
                  Book Service
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => navigate("/dashboard")}
                  className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transition-all flex items-center gap-2 border border-white/30"
                >
                  <Calendar size={18} />
                  My Bookings
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats Grid - Enhanced with Trend Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Total Bookings",
              value: dashboardStats.totalBookings,
              icon: Briefcase,
              color: "from-indigo-500 to-blue-500",
              trend: "+12%",
              trendUp: true,
            },
            {
              label: "Completed",
              value: dashboardStats.completedBookings,
              icon: CheckCircle2,
              color: "from-emerald-500 to-teal-500",
              trend: "+8%",
              trendUp: true,
            },
            {
              label: "Total Spent",
              value: `₹${dashboardStats.totalSpent}`,
              icon: DollarSign,
              color: "from-purple-500 to-pink-500",
              trend: "+25%",
              trendUp: true,
            },
            {
              label: "Avg Rating",
              value:
                dashboardStats.averageRating > 0
                  ? `${dashboardStats.averageRating}★`
                  : "N/A",
              icon: Star,
              color: "from-amber-500 to-orange-500",
              trend: "+2.5%",
              trendUp: true,
            },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-lg hover:border-indigo-200 transition-all group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-slate-600 text-xs font-semibold uppercase tracking-wider">
                    {stat.label}
                  </p>
                  {stat.trend && (
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs font-bold text-emerald-600">
                        {stat.trend}
                      </span>
                      {stat.trendUp ? (
                        <ArrowUpRight size={12} className="text-emerald-600" />
                      ) : (
                        <ArrowDownRight size={12} className="text-red-600" />
                      )}
                    </div>
                  )}
                </div>
                <div
                  className={`p-2.5 rounded-lg bg-gradient-to-br ${stat.color} shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <stat.icon size={16} className="text-white" />
                </div>
              </div>
              <p className="text-slate-900 font-black text-2xl">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Main Grid - Active Bookings & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Bookings Section */}
          <motion.div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-slate-900 font-black text-2xl mb-4">
                Active Bookings
              </h2>

              <div className="space-y-4">
                {dashboardStats.activeBookings.length > 0 ? (
                  dashboardStats.activeBookings.map((booking, idx) => (
                    <motion.div
                      key={booking._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-indigo-200 transition-all group cursor-pointer overflow-hidden relative"
                      onClick={() => navigate("/bookings")}
                    >
                      {/* Status Indicator Bar */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-blue-500" />

                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 rounded-xl bg-indigo-50 flex items-center justify-center overflow-hidden border border-indigo-100 group-hover:border-indigo-300 transition-all">
                            <img
                              src={
                                booking.serviceId?.image ||
                                "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=200"
                              }
                              className="w-full h-full object-cover"
                              alt="Service"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-slate-900 font-bold text-lg">
                                {booking.serviceId?.name || "Service"}
                              </h3>
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="w-2 h-2 rounded-full bg-emerald-500"
                              />
                            </div>
                            <p className="text-slate-600 text-sm mb-2">
                              {booking.workerId?.name || "Worker"}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                              <div className="flex items-center gap-1">
                                <MapPin size={12} />
                                {booking.address}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar size={12} />
                                {new Date(booking.date).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock size={12} />
                                {new Date(booking.date).toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-slate-900 font-black text-xl mb-2">
                            ₹{booking.price}
                          </p>
                          <motion.span
                            whileHover={{ scale: 1.05 }}
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all ${
                              booking.status === "completed"
                                ? "bg-emerald-50 text-emerald-600"
                                : booking.status === "pending"
                                  ? "bg-yellow-50 text-yellow-600 animate-pulse"
                                  : booking.status === "confirmed" ||
                                      booking.status === "accepted"
                                    ? "bg-blue-50 text-blue-600"
                                    : "bg-slate-50 text-slate-600"
                            }`}
                          >
                            {booking.status}
                          </motion.span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-slate-600">
                            Progress
                          </span>
                          <span className="text-xs font-bold text-indigo-600">
                            {booking.status === "completed"
                              ? "100%"
                              : booking.status === "in-progress"
                                ? "75%"
                                : booking.status === "accepted"
                                  ? "50%"
                                  : "25%"}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: "0%" }}
                            animate={{
                              width:
                                {
                                  completed: "100%",
                                  "in-progress": "75%",
                                  accepted: "50%",
                                  confirmed: "50%",
                                  pending: "25%",
                                }[booking.status] || "25%",
                            }}
                            transition={{ duration: 0.8 }}
                            className={`h-full bg-gradient-to-r ${
                              booking.status === "completed"
                                ? "from-emerald-500 to-teal-500"
                                : "from-indigo-500 to-blue-500"
                            }`}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white border border-slate-200 rounded-2xl p-8 text-center"
                  >
                    <Wrench size={48} className="text-slate-300 mx-auto mb-4" />
                    <h3 className="text-slate-900 font-bold text-lg mb-2">
                      No Active Bookings
                    </h3>
                    <p className="text-slate-600 mb-4">
                      Ready to book a service? Browse our available services.
                    </p>
                    <button
                      onClick={() => navigate("/services")}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition-all"
                    >
                      Browse Services
                    </button>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Recent Bookings */}
            {dashboardStats.recentBookings.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <Activity size={16} className="text-indigo-600" />
                    </div>
                    <h2 className="text-slate-900 font-black text-2xl">
                      Recent Bookings
                    </h2>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => navigate("/bookings")}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                  >
                    View All <ChevronRight size={14} />
                  </motion.button>
                </div>
                <div className="space-y-2">
                  {dashboardStats.recentBookings.map((booking, idx) => (
                    <motion.div
                      key={booking._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ x: 5 }}
                      className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group"
                      onClick={() => navigate("/bookings")}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-all">
                            <Wrench size={16} className="text-indigo-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-slate-900 font-semibold text-sm">
                              {booking.serviceId?.name || "Service"}
                            </p>
                            <p className="text-slate-500 text-xs">
                              {new Date(booking.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-slate-900 font-bold">
                            ₹{booking.price}
                          </p>
                          <motion.span
                            whileHover={{ scale: 1.05 }}
                            className={`text-xs px-2 py-1 rounded-full font-semibold inline-block transition-all ${
                              booking.status === "completed"
                                ? "bg-emerald-50 text-emerald-600"
                                : booking.status === "pending"
                                  ? "bg-yellow-50 text-yellow-600"
                                  : "bg-blue-50 text-blue-600"
                            }`}
                          >
                            {booking.status}
                          </motion.span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Quick Actions */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-indigo-200 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <Zap size={16} className="text-indigo-600" />
                </div>
                <h3 className="text-slate-900 font-bold text-lg">
                  Quick Actions
                </h3>
              </div>
              <div className="space-y-2">
                <motion.button
                  whileHover={{ x: 5 }}
                  onClick={() => navigate("/services")}
                  className="w-full flex items-center gap-3 p-3 bg-gradient-to-br from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 rounded-xl transition-all group border border-indigo-100 hover:border-indigo-300"
                >
                  <div className="p-2 rounded-lg bg-white group-hover:bg-indigo-600 transition-all">
                    <Wrench
                      size={16}
                      className="text-indigo-600 group-hover:text-white transition-all"
                    />
                  </div>
                  <span className="text-slate-900 font-semibold text-sm flex-1 text-left">
                    Book Service
                  </span>
                  <ChevronRight
                    size={16}
                    className="text-slate-400 group-hover:text-indigo-600 transition-all"
                  />
                </motion.button>
                <motion.button
                  whileHover={{ x: 5 }}
                  onClick={() => navigate("/bookings")}
                  className="w-full flex items-center gap-3 p-3 bg-gradient-to-br from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 rounded-xl transition-all group border border-slate-200 hover:border-slate-300"
                >
                  <div className="p-2 rounded-lg bg-white group-hover:bg-slate-600 transition-all">
                    <Calendar
                      size={16}
                      className="text-slate-600 group-hover:text-white transition-all"
                    />
                  </div>
                  <span className="text-slate-900 font-semibold text-sm flex-1 text-left">
                    My Bookings
                  </span>
                  <ChevronRight
                    size={16}
                    className="text-slate-400 group-hover:text-slate-600 transition-all"
                  />
                </motion.button>
                <motion.button
                  whileHover={{ x: 5 }}
                  onClick={() => navigate("/user-profile")}
                  className="w-full flex items-center gap-3 p-3 bg-gradient-to-br from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 rounded-xl transition-all group border border-slate-200 hover:border-slate-300"
                >
                  <div className="p-2 rounded-lg bg-white group-hover:bg-slate-600 transition-all">
                    <UserIcon
                      size={16}
                      className="text-slate-600 group-hover:text-white transition-all"
                    />
                  </div>
                  <span className="text-slate-900 font-semibold text-sm flex-1 text-left">
                    Profile
                  </span>
                  <ChevronRight
                    size={16}
                    className="text-slate-400 group-hover:text-slate-600 transition-all"
                  />
                </motion.button>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-indigo-200 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <DollarSign size={16} className="text-green-600" />
                </div>
                <h3 className="text-slate-900 font-bold text-lg">
                  Transactions
                </h3>
              </div>
              <div className="space-y-3">
                {dashboardStats.recentBookings &&
                dashboardStats.recentBookings.length > 0 ? (
                  dashboardStats.recentBookings
                    .slice(0, 4)
                    .map((booking, idx) => (
                      <motion.div
                        key={booking._id || idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all border border-slate-100 hover:border-green-200 group"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate">
                              {booking.serviceId?.name ||
                                booking.serviceName ||
                                "Service"}
                            </p>
                            <p className="text-xs text-slate-500">
                              {new Date(
                                booking.createdAt || booking.date,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-sm font-bold text-slate-900">
                              ₹{booking.price || booking.amount || 0}
                            </p>
                            <span
                              className={`text-xs font-semibold px-2 py-0.5 rounded inline-block mt-0.5 ${
                                booking.status === "completed"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : booking.status === "pending"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : booking.status === "confirmed" ||
                                        booking.status === "accepted"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {booking.status}
                            </span>
                          </div>
                        </div>
                        {booking.workerId?.name && (
                          <p className="text-xs text-slate-600">
                            Worker: {booking.workerId.name}
                          </p>
                        )}
                      </motion.div>
                    ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-slate-500">
                      No transactions yet
                    </p>
                  </div>
                )}
              </div>
              <motion.button
                whileHover={{ x: 5 }}
                onClick={() => navigate("/bookings")}
                className="w-full mt-4 flex items-center justify-center gap-2 p-2.5 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-lg transition-all group border border-green-200 hover:border-green-300 text-sm font-semibold text-green-700"
              >
                View All Transactions <ChevronRight size={14} />
              </motion.button>
            </div>

            {/* Service Recommendations */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-indigo-200 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Sparkles size={16} className="text-amber-600" />
                </div>
                <h3 className="text-slate-900 font-bold text-lg">
                  Popular Services
                </h3>
              </div>
              <div className="space-y-2">
                {[
                  {
                    name: "Plumbing",
                    icon: Wrench,
                    color: "text-blue-600",
                    bg: "bg-blue-50",
                  },
                  {
                    name: "Electrical",
                    icon: ZapIcon,
                    color: "text-yellow-600",
                    bg: "bg-yellow-50",
                  },
                  {
                    name: "Cleaning",
                    icon: Sparkles,
                    color: "text-purple-600",
                    bg: "bg-purple-50",
                  },
                  {
                    name: "AC Repair",
                    icon: Settings,
                    color: "text-green-600",
                    bg: "bg-green-50",
                  },
                ].map((service, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ x: 5 }}
                    onClick={() => navigate("/services")}
                    className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-all group"
                  >
                    <div className={`p-2 rounded-lg ${service.bg}`}>
                      <service.icon size={16} className={service.color} />
                    </div>
                    <span className="text-slate-900 font-semibold text-sm flex-1 text-left">
                      {service.name}
                    </span>
                    <ChevronRight
                      size={16}
                      className="text-slate-400 group-hover:translate-x-1 transition-all"
                    />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Stats Summary Card */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded-2xl p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-200/20 rounded-full -mr-20 -mt-20 blur-3xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 size={20} className="text-indigo-600" />
                  <h3 className="text-slate-900 font-bold">Your Stats</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 font-medium">
                      Total Services
                    </span>
                    <span className="text-lg font-bold text-indigo-600">
                      {dashboardStats.totalBookings}
                    </span>
                  </div>
                  <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-gradient-to-r from-indigo-500 to-blue-500" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 font-medium">
                      Success Rate
                    </span>
                    <span className="text-lg font-bold text-emerald-600">
                      {dashboardStats.totalBookings > 0
                        ? Math.round(
                            (dashboardStats.completedBookings /
                              dashboardStats.totalBookings) *
                              100,
                          )
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
