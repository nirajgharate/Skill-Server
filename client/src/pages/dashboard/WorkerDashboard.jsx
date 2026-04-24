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
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  BarChart3,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api/api";
import { useAuth } from "../../hooks/useAuth";
import { useSocket } from "../../hooks/useSocket";
import { workerService } from "../../services/api.service";
import EditProfileWorker from "./EditProfileWorker";

export default function WorkerDashboard() {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const { registerUser, on, off } = useSocket();

  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [isAvailable, setIsAvailable] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [workerBookings, setWorkerBookings] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(true);
  const [activeJobs] = useState([
    {
      id: 1,
      customer: "Aditi Verma",
      service: "Electrical Repair",
      location: "Sector 45, Gurugram",
      time: "Today, 2:00 PM",
      amount: "₹500",
      status: "confirmed",
      rating: null,
    },
    {
      id: 2,
      customer: "Rahul Singh",
      service: "Plumbing Work",
      location: "Sector 50, Gurugram",
      time: "Tomorrow, 10:00 AM",
      amount: "₹600",
      status: "pending",
      rating: null,
    },
  ]);

  const [pendingRequests] = useState([
    {
      id: 1,
      customer: "Priya Sharma",
      service: "Home Cleaning",
      location: "DLF Phase 2, Gurugram",
      distance: "2.4 km away",
      amount: "₹800",
      urgency: "high",
    },
    {
      id: 2,
      customer: "Vikram Patel",
      service: "AC Repair",
      location: "MG Road, Gurugram",
      distance: "1.8 km away",
      amount: "₹1,200",
      urgency: "medium",
    },
  ]);

  const [earnings] = useState({
    today: 1250,
    thisWeek: 8400,
    thisMonth: 45230,
    total: 245670,
  });

  useEffect(() => {
    // Load from localStorage immediately
    const stored = localStorage.getItem("skillserverUser");
    if (stored) {
      const userData = JSON.parse(stored);
      setWorker(userData);
      setProfileCompletion(userData.profileCompletionPercentage || 75);
      setLoading(false); // Show UI immediately
    }
    loadWorkerBookings();
  }, [authUser]);

  useEffect(() => {
    const stored = localStorage.getItem("skillserverUser");
    if (stored) {
      const userData = JSON.parse(stored);
      registerUser(userData._id, "worker");

      const handleUpdate = (data) => {
        console.log("📡 Dashboard updated:", data);
        if (data.worker?._id === userData._id) {
          setWorker((prev) => ({ ...prev, ...data.worker }));
          setProfileCompletion(data.worker.profileCompletionPercentage || 0);
        }
      };

      on("worker_updated", handleUpdate);
      return () => off("worker_updated", handleUpdate);
    }
  }, [registerUser, on, off]);

  const loadWorkerData = async () => {
    try {
      setLoading(true);
      const stored = localStorage.getItem("skillserverUser");
      if (stored) {
        const userData = JSON.parse(stored);
        setWorker(userData);
        setProfileCompletion(userData.profileCompletionPercentage || 75);

        // Don't fetch again if we already have the data
        // Use service layer for any additional data if needed
      }
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadWorkerBookings = async () => {
    try {
      setBookingLoading(true);
      const response = await API.get("/bookings/worker/me");
      setWorkerBookings(response.data?.data || []);
    } catch (err) {
      console.error("Error loading worker bookings:", err);
      setWorkerBookings([]);
    } finally {
      setBookingLoading(false);
    }
  };

  const activeWorkerJobs = (workerBookings.length ? workerBookings : activeJobs)
    .filter((job) => {
      const status = (job.status || "pending").toLowerCase();
      return [
        "pending",
        "accepted",
        "in-progress",
        "confirmed",
        "active",
        "paid",
      ].includes(status);
    })
    .map((job) => ({
      id: job._id || job.id,
      customer: job.userId?.name || job.customer,
      service:
        job.serviceId?.name || job.service || job.serviceName || "Service",
      location: job.address || job.location || "",
      time: job.date
        ? new Date(job.date).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })
        : job.time,
      amount: job.price ? `₹${job.price}` : job.amount,
      status: (job.status || "pending").toLowerCase(),
      raw: job,
    }));

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadWorkerData();
    await loadWorkerBookings();
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

  if (!worker) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <p className="text-slate-600 font-semibold mb-4">
            Error loading dashboard
          </p>
          <button
            onClick={loadWorkerData}
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
                onClick={() => navigate("/worker-profile")}
              >
                <img
                  src={
                    worker.profilePhoto ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${worker.name}`
                  }
                  alt={worker.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </motion.div>
              <div>
                <p className="text-slate-900 font-bold text-sm md:text-base">
                  {worker.name}
                </p>
                <p className="text-slate-500 text-xs">Professional Portal</p>
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
                onClick={() => setShowEditProfile(true)}
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
              {/* Status */}
              <div>
                <p className="text-indigo-100 text-sm font-semibold mb-2">
                  CURRENT STATUS
                </p>
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setIsAvailable(!isAvailable)}
                    className={`relative w-14 h-8 rounded-full transition-all ${
                      isAvailable ? "bg-emerald-400" : "bg-slate-600"
                    }`}
                  >
                    <motion.div
                      animate={{ x: isAvailable ? 24 : 4 }}
                      className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full"
                    />
                  </motion.button>
                  <span className="text-white font-bold">
                    {isAvailable ? "Online & Active" : "Offline"}
                  </span>
                </div>
              </div>

              {/* Today's Earnings */}
              <div>
                <p className="text-indigo-100 text-sm font-semibold mb-2">
                  TODAY'S EARNINGS
                </p>
                <p className="text-4xl font-black text-white">
                  ₹{earnings.today}
                </p>
              </div>

              {/* Response Rate */}
              <div>
                <p className="text-indigo-100 text-sm font-semibold mb-2">
                  RESPONSE TIME
                </p>
                <div className="flex items-center gap-2">
                  <Zap size={20} className="text-yellow-300" />
                  <span className="text-white font-black text-2xl">8 min</span>
                </div>
              </div>
            </div>

            {/* Profile Completion Bar */}
            <div className="pt-6 border-t border-white/20">
              <div className="flex items-center justify-between mb-3">
                <p className="text-indigo-100 text-sm font-semibold">
                  Profile Completion
                </p>
                <p className="text-white font-bold">{profileCompletion}%</p>
              </div>
              <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${profileCompletion}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-white rounded-full"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats Grid - Enhanced with Trend Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Active Jobs",
              value: activeWorkerJobs.length,
              icon: Briefcase,
              color: "from-indigo-500 to-blue-500",
              trend: "+3",
              trendUp: true,
            },
            {
              label: "This Week",
              value: `₹${earnings.thisWeek}`,
              icon: TrendingUp,
              color: "from-emerald-500 to-teal-500",
              trend: "+18%",
              trendUp: true,
            },
            {
              label: "Completed",
              value: "127",
              icon: CheckCircle2,
              color: "from-purple-500 to-pink-500",
              trend: "+12",
              trendUp: true,
            },
            {
              label: "Rating",
              value: "4.8★",
              icon: Star,
              color: "from-amber-500 to-orange-500",
              trend: "+0.2",
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

        {/* Main Grid - Active Jobs & Requests */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Jobs Section */}
          <motion.div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <Activity size={16} className="text-indigo-600" />
                  </div>
                  <h2 className="text-slate-900 font-black text-2xl">
                    Active Jobs
                  </h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  View All <ChevronRight size={14} />
                </motion.button>
              </div>

              <div className="space-y-4">
                {activeWorkerJobs.map((job, idx) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-indigo-200 transition-all group cursor-pointer overflow-hidden relative"
                  >
                    {/* Status Indicator Bar */}
                    <div
                      className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
                        job.status === "confirmed"
                          ? "from-emerald-500 to-teal-500"
                          : "from-amber-500 to-yellow-500"
                      }`}
                    />

                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <UserIcon size={24} className="text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-slate-900 font-bold text-lg">
                              {job.customer}
                            </p>
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ repeat: Infinity, duration: 2 }}
                              className={`w-2 h-2 rounded-full ${
                                job.status === "confirmed"
                                  ? "bg-emerald-500"
                                  : "bg-amber-500"
                              }`}
                            />
                          </div>
                          <p className="text-slate-500 text-sm">
                            {job.service}
                          </p>
                        </div>
                      </div>
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                          ["accepted", "in-progress", "confirmed"].includes(
                            job.status,
                          )
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200 animate-pulse"
                        }`}
                      >
                        {["accepted", "in-progress", "confirmed"].includes(
                          job.status,
                        )
                          ? "✓ Confirmed"
                          : "⏳ Pending"}
                      </motion.span>
                    </div>

                    <div className="space-y-2 mb-4 pl-0">
                      <div className="flex items-center gap-3 text-slate-600">
                        <MapPin
                          size={18}
                          className="text-indigo-600 flex-shrink-0"
                        />
                        <span className="text-sm">{job.location}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-600">
                        <Clock
                          size={18}
                          className="text-indigo-600 flex-shrink-0"
                        />
                        <span className="text-sm">{job.time}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-600">
                          Job Progress
                        </span>
                        <span className="text-xs font-bold text-indigo-600">
                          {job.status === "confirmed" ? "50%" : "25%"}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: "0%" }}
                          animate={{
                            width: job.status === "confirmed" ? "50%" : "25%",
                          }}
                          transition={{ duration: 0.8 }}
                          className="h-full bg-gradient-to-r from-indigo-500 to-blue-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <p className="text-slate-900 font-black text-xl">
                        {job.amount}
                      </p>
                      <motion.button
                        whileHover={{ x: 4 }}
                        className="text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-2 transition-all"
                      >
                        Details <ChevronRight size={18} />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  title: "Schedule",
                  icon: Calendar,
                  link: "/worker/schedule",
                  color: "from-indigo-500 to-blue-500",
                },
                {
                  title: "Earnings",
                  icon: Wallet,
                  link: "/worker/earnings",
                  color: "from-emerald-500 to-teal-500",
                },
                {
                  title: "Profile",
                  icon: UserIcon,
                  link: "/worker-profile",
                  color: "from-purple-500 to-pink-500",
                },
              ].map((action, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ y: -5 }}
                  onClick={() => navigate(action.link)}
                  className="bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-lg transition-all text-left group"
                >
                  <div
                    className={`p-3 rounded-lg bg-gradient-to-br ${action.color} w-fit mb-3 group-hover:shadow-lg transition-all`}
                  >
                    <action.icon size={20} className="text-white" />
                  </div>
                  <p className="text-slate-900 font-bold">{action.title}</p>
                  <p className="text-slate-500 text-xs mt-1">
                    Manage your work
                  </p>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Sidebar - Earnings & Requests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Earnings Summary Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 h-fit sticky top-40 hover:border-emerald-200 transition-all">
              <h3 className="text-slate-900 font-black text-xl mb-4 flex items-center gap-2">
                <DollarSign size={20} className="text-emerald-500" />
                Earnings
              </h3>

              <div className="space-y-3">
                {/* Today's Earning */}
                <motion.div
                  whileHover={{ y: -2 }}
                  className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl"
                >
                  <p className="text-xs font-bold text-emerald-600 uppercase mb-1">
                    Today
                  </p>
                  <p className="text-2xl font-black text-slate-900">
                    ₹{earnings.today}
                  </p>
                </motion.div>

                {/* This Week */}
                <motion.div
                  whileHover={{ y: -2 }}
                  className="p-4 bg-blue-50 border border-blue-200 rounded-xl"
                >
                  <p className="text-xs font-bold text-blue-600 uppercase mb-1">
                    This Week
                  </p>
                  <p className="text-2xl font-black text-slate-900">
                    ₹{earnings.thisWeek}
                  </p>
                </motion.div>

                {/* This Month */}
                <motion.div
                  whileHover={{ y: -2 }}
                  className="p-4 bg-purple-50 border border-purple-200 rounded-xl"
                >
                  <p className="text-xs font-bold text-purple-600 uppercase mb-1">
                    This Month
                  </p>
                  <p className="text-2xl font-black text-slate-900">
                    ₹{earnings.thisMonth}
                  </p>
                </motion.div>

                {/* Total Earnings */}
                <motion.div
                  whileHover={{ y: -2 }}
                  className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl"
                >
                  <p className="text-xs font-bold text-amber-600 uppercase mb-1">
                    Total Earned
                  </p>
                  <p className="text-2xl font-black text-slate-900">
                    ₹{earnings.total}
                  </p>
                </motion.div>
              </div>

              <motion.button
                whileHover={{ x: 5 }}
                onClick={() => navigate("/worker/earnings")}
                className="w-full mt-4 flex items-center justify-center gap-2 p-2.5 bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 rounded-lg transition-all border border-emerald-200 hover:border-emerald-300 text-sm font-semibold text-emerald-700"
              >
                View Detailed Earnings <ChevronRight size={14} />
              </motion.button>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 h-fit sticky top-96 hover:border-indigo-200 transition-all">
              <h3 className="text-slate-900 font-black text-xl mb-4 flex items-center gap-2">
                <Activity size={20} className="text-indigo-500" />
                Recent Jobs
              </h3>

              <div className="space-y-3">
                {activeJobs.slice(0, 3).map((job, idx) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-3 bg-slate-50 hover:bg-indigo-50 rounded-xl transition-all border border-slate-100 hover:border-indigo-200 group"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {job.customer}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {job.service}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-slate-900">
                          {job.amount}
                        </p>
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded inline-block mt-0.5 ${
                            job.status === "confirmed"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {job.status === "confirmed" ? "✓ Done" : "⏳ Wait"}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600">{job.time}</p>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ x: 5 }}
                className="w-full mt-4 flex items-center justify-center gap-2 p-2.5 bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 rounded-lg transition-all border border-indigo-200 hover:border-indigo-300 text-sm font-semibold text-indigo-700"
              >
                View All Jobs <ChevronRight size={14} />
              </motion.button>
            </div>

            {/* Job Requests */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 h-fit sticky top-72">
              <h3 className="text-slate-900 font-black text-xl mb-4 flex items-center gap-2">
                <Zap size={20} className="text-amber-500" />
                New Requests
              </h3>

              <div className="space-y-4">
                {pendingRequests.map((req, idx) => (
                  <motion.div
                    key={req.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-amber-300 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-slate-900 font-bold text-sm">
                          {req.customer}
                        </p>
                        <p className="text-slate-500 text-xs">{req.service}</p>
                      </div>
                      {req.urgency === "high" && (
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse mt-1"></span>
                      )}
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-slate-600 text-xs">
                        <MapPin size={14} className="text-slate-400" />
                        {req.distance}
                      </div>
                      <p className="text-emerald-600 font-bold">{req.amount}</p>
                    </div>

                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-all"
                      >
                        Accept
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="flex-1 py-2 bg-slate-300 hover:bg-slate-400 text-slate-900 text-xs font-bold rounded-lg transition-all"
                      >
                        Decline
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ y: -2 }}
                className="w-full mt-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
              >
                View All Requests
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showEditProfile && worker && (
          <EditProfileWorker
            worker={worker}
            onClose={() => setShowEditProfile(false)}
            onSave={(updatedWorker) => {
              setWorker(updatedWorker);
              localStorage.setItem(
                "skillserverUser",
                JSON.stringify(updatedWorker),
              );
              setShowEditProfile(false);
              setProfileCompletion(
                updatedWorker.profileCompletionPercentage || 75,
              );
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
