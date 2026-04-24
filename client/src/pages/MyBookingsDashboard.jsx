import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  MessageSquare,
  Star,
  XCircle,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Phone,
  ArrowRight,
  Map,
  User,
  IndianRupee,
} from "lucide-react";
import API from "../api/api";

export default function MyBookingsDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Active");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await API.get("/bookings/user/me");
      
      console.log("Bookings API Response:", response.data); // Debug log
      
      if (response.data && response.data.data) {
        setBookings(response.data.data);
      } else if (Array.isArray(response.data)) {
        setBookings(response.data);
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError(err.response?.data?.message || "Failed to load bookings. Please try again.");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // User action to mark an active booking as completed
  const handleMarkWorkDone = async (bookingId) => {
    try {
      await API.post(`/bookings/complete/${bookingId}`);
      fetchBookings();
    } catch (err) {
      console.error("Failed to mark work done:", err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
      case "Active":
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          icon: "text-blue-500",
          badge: "bg-blue-100",
        };
      case "Completed":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          icon: "text-emerald-500",
          badge: "bg-emerald-100",
        };
      case "Cancelled":
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          icon: "text-red-500",
          badge: "bg-red-100",
        };
      case "Pending":
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          icon: "text-amber-500",
          badge: "bg-amber-100",
        };
      default:
        return {
          bg: "bg-slate-50",
          text: "text-slate-700",
          icon: "text-slate-500",
          badge: "bg-slate-100",
        };
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle2 size={18} />;
      case "Cancelled":
        return <XCircle size={18} />;
      case "Pending":
        return <AlertCircle size={18} />;
      default:
        return <Calendar size={18} />;
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === "Active") return booking.status === "Active";
    if (activeTab === "Completed") return booking.status === "Completed";
    if (activeTab === "Cancelled") return booking.status === "Cancelled";
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 pt-32 pb-24 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER SECTION */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8">
            <div>
              <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-3">
                My Bookings
              </h1>
              <p className="text-lg text-slate-600 font-semibold">
                Track and manage all your professional service bookings
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/services")}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-black text-sm rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-200/50 hover:shadow-xl hover:shadow-indigo-300/60 transition-all uppercase tracking-widest"
            >
              <Plus size={18} />
              New Booking
            </motion.button>
          </div>

          {/* STATS BAR */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-5"
          >
            {[
              {
                label: "Total Bookings",
                value: bookings.length,
                color: "from-blue-600 to-blue-700",
                icon: Calendar,
              },
              {
                label: "Active",
                value: bookings.filter((b) => b.status === "Active").length,
                color: "from-indigo-600 to-indigo-700",
                icon: Clock,
              },
              {
                label: "Completed",
                value: bookings.filter((b) => b.status === "Completed").length,
                color: "from-emerald-600 to-emerald-700",
                icon: CheckCircle2,
              },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className={`bg-gradient-to-br ${stat.color} rounded-xl p-5 text-white shadow-lg shadow-${stat.color.split(" ")[0]}/20`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-2">
                        {stat.label}
                      </p>
                      <p className="text-4xl font-black">{stat.value}</p>
                    </div>
                    <Icon size={28} className="opacity-25" />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* TAB SELECTOR */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-10 flex gap-3 flex-wrap"
        >
          {["Active", "Completed", "Cancelled"].map((tab) => {
            const tabCount = bookings.filter((b) => {
              if (tab === "Active") return b.status === "Active";
              if (tab === "Completed") return b.status === "Completed";
              if (tab === "Cancelled") return b.status === "Cancelled";
              return false;
            }).length;

            return (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-widest transition-all ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-200/50"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
                }`}
              >
                {tab}
                <span
                  className={`ml-2 px-3 py-0.5 rounded-md text-xs font-black ${
                    activeTab === tab ? "bg-white/20" : "bg-slate-100"
                  }`}
                >
                  {tabCount}
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* BOOKINGS LIST */}
        {error ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 bg-red-50 rounded-2xl border border-red-200 shadow-lg"
          >
            <div className="inline-block p-4 bg-red-100 rounded-xl mb-6">
              <AlertCircle size={48} className="text-red-600" />
            </div>
            <p className="text-2xl font-black text-red-900 mb-3">
              Error Loading Bookings
            </p>
            <p className="text-red-600 font-medium mb-8 max-w-sm mx-auto">
              {error}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={fetchBookings}
              className="px-8 py-3 bg-red-600 text-white rounded-lg font-bold shadow-lg shadow-red-200/50 hover:shadow-xl transition-all"
            >
              Try Again
            </motion.button>
          </motion.div>
        ) : loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center py-32"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="inline-block"
              >
                <Loader2 size={48} className="text-indigo-600" />
              </motion.div>
              <p className="mt-6 text-slate-600 font-semibold">
                Loading your bookings...
              </p>
            </div>
          </motion.div>
        ) : filteredBookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 bg-white rounded-2xl border border-slate-200 shadow-lg"
          >
            <div className="inline-block p-4 bg-slate-100 rounded-xl mb-6">
              <Calendar size={48} className="text-slate-400" />
            </div>
            <p className="text-2xl font-black text-slate-900 mb-3">
              No {activeTab.toLowerCase()} bookings
            </p>
            <p className="text-slate-600 font-medium mb-8 max-w-sm mx-auto">
              Start booking professional services to see them appear here
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate("/services")}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg font-bold shadow-lg shadow-indigo-200/50 hover:shadow-xl transition-all"
            >
              Explore Services
            </motion.button>
          </motion.div>
        ) : (
          <motion.div layout className="space-y-6">
            <AnimatePresence mode="popLayout">
              {filteredBookings.map((booking, idx) => {
                const colors = getStatusColor(booking.status);
                return (
                  <motion.div
                    key={booking._id}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: idx * 0.08 }}
                    className={`group bg-gradient-to-br ${colors.bg} border border-slate-200 rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden`}
                  >
                    {/* Status indicator bar */}
                    <div className={`h-1 ${colors.icon}`} />

                    <div className="p-7">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start md:items-center">
                        {/* Worker Info */}
                        <div className="md:col-span-3">
                          <div className="flex items-start gap-4">
                            <div className="relative">
                              <img
                                src={booking.expertImage}
                                alt={booking.expert}
                                className="w-16 h-16 rounded-xl object-cover shadow-lg group-hover:shadow-2xl transition-shadow"
                              />
                              <div
                                className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center ${colors.badge} ${colors.icon} shadow-lg bg-white`}
                              >
                                {getStatusIcon(booking.status)}
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="font-black text-slate-900 mb-1 line-clamp-1">
                                {booking.expert}
                              </p>
                              <div className="flex items-center gap-1 mb-2">
                                <div className="flex gap-0.5">
                                  {[...Array(5)].map((_, i) => (
                                    <span
                                      key={i}
                                      className={
                                        i < Math.floor(booking.rating)
                                          ? "text-amber-400"
                                          : "text-slate-300"
                                      }
                                    >
                                      ★
                                    </span>
                                  ))}
                                </div>
                                <span className="text-xs font-bold text-amber-600 ml-1">
                                  {booking.rating}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 font-semibold">
                                Professional Expert
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* SERVICE DETAILS */}
                        <div className="md:col-span-3 space-y-3">
                          <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                            Service Details
                          </p>
                          <div>
                            <p className="text-lg font-black text-slate-900 mb-3">
                              {booking.service}
                            </p>
                          </div>
                          <div className="space-y-2.5">
                            <div className="flex items-center gap-3 text-slate-700 text-sm">
                              <div className="p-2 rounded-lg bg-indigo-100">
                                <Calendar
                                  size={14}
                                  className="text-indigo-600"
                                />
                              </div>
                              <div>
                                <p className="text-xs text-slate-500 font-bold">
                                  Date
                                </p>
                                <span className="font-black">
                                  {booking.date}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 text-slate-700 text-sm">
                              <div className="p-2 rounded-lg bg-blue-100">
                                <Clock size={14} className="text-blue-600" />
                              </div>
                              <div>
                                <p className="text-xs text-slate-500 font-bold">
                                  Time
                                </p>
                                <span className="font-black">
                                  {booking.time}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 text-slate-700 text-sm">
                              <div className="p-2 rounded-lg bg-purple-100">
                                <MapPin size={14} className="text-purple-600" />
                              </div>
                              <div className="flex-1">
                                <p className="text-xs text-slate-500 font-bold">
                                  Location
                                </p>
                                <span className="font-black line-clamp-1 text-xs">
                                  {booking.location}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* AMOUNT & STATUS */}
                        <div className="md:col-span-2 rounded-xl p-5 border-2 border-indigo-200 bg-gradient-to-br from-indigo-50/80 to-blue-50/80">
                          <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-3">
                            Payment
                          </p>
                          <p className="text-3xl font-black text-indigo-700 mb-4 flex items-baseline gap-1">
                            <IndianRupee size={22} />
                            {booking.amount?.toLocaleString()}
                          </p>
                          <div className="flex flex-col gap-2">
                            <div
                              className={`px-3 py-2 rounded-lg text-xs font-black uppercase tracking-widest w-fit ${colors.badge} ${colors.text} shadow-sm`}
                            >
                              {booking.status}
                            </div>
                            <p className="text-xs text-slate-600 font-semibold">
                              Payment Verified ✓
                            </p>
                          </div>
                        </div>

                        {/* ACTION BUTTONS */}
                        <div className="md:col-span-4 flex flex-col gap-2">
                          {booking.status === "Confirmed" ||
                          booking.status === "Active" ? (
                            <>
                              <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate("/tracking")}
                                className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-black rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-indigo-200/60 hover:shadow-xl transition-all flex items-center justify-center gap-2 border border-indigo-300/30"
                              >
                                <Map size={16} />
                                <span>Track Booking</span>
                              </motion.button>
                              <div className="grid grid-cols-3 gap-2">
                                <motion.button
                                  whileHover={{ scale: 1.05, y: -2 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => window.open(`tel:${booking.phone}`, '_self')}
                                  className="px-3 py-3 bg-white text-slate-700 font-black rounded-lg text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-1.5 border border-slate-300 shadow-sm"
                                >
                                  <Phone size={14} />
                                  <span>Call</span>
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.05, y: -2 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="px-3 py-3 bg-white text-slate-700 font-black rounded-lg text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-1.5 border border-slate-300 shadow-sm"
                                >
                                  <MessageSquare size={14} />
                                  <span>Message</span>
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.05, y: -2 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleMarkWorkDone(booking._id)}
                                  className="px-3 py-3 bg-emerald-50 text-emerald-700 font-black rounded-lg text-xs uppercase tracking-widest hover:bg-emerald-100 transition-all flex items-center justify-center gap-1.5 border border-emerald-300 shadow-sm"
                                >
                                  <CheckCircle2 size={14} />
                                  <span>Work Done</span>
                                </motion.button>
                              </div>
                            </>
                          ) : booking.status === "Completed" ? (
                            <>
                              <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-black rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-emerald-200/60 hover:shadow-xl transition-all flex items-center justify-center gap-2 border border-emerald-300/30"
                              >
                                <Star size={16} />
                                <span>Leave Review</span>
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate("/services")}
                                className="w-full px-4 py-3 bg-white text-indigo-700 font-black rounded-xl text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 border border-indigo-300 shadow-sm"
                              >
                                <RotateCcw size={14} />
                                <span>Book Again</span>
                              </motion.button>
                            </>
                          ) : (
                            <motion.button
                              whileHover={{ scale: 1.05, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => navigate("/services")}
                              className="w-full px-4 py-3 bg-indigo-50 text-indigo-700 font-black rounded-xl text-xs uppercase tracking-widest hover:bg-indigo-100 transition-all flex items-center justify-center gap-2 border border-indigo-300 shadow-sm"
                            >
                              <Plus size={14} />
                              <span>New Booking</span>
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
