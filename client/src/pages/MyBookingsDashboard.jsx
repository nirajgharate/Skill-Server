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
      setError(
        err.response?.data?.message ||
          "Failed to load bookings. Please try again.",
      );
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
      window.alert(
        err.response?.data?.message ||
          "Unable to complete booking. Please refresh and try again.",
      );
    }
  };

  const normalizeStatus = (status) => String(status || "").toLowerCase();
  const activeStatuses = [
    "active",
    "accepted",
    "pending",
    "confirmed",
    "in-progress",
    "paid",
  ];

  const formatDate = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "TBD";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "TBD";
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusColor = (status) => {
    const normalized = normalizeStatus(status);
    switch (normalized) {
      case "confirmed":
      case "active":
      case "accepted":
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          icon: "text-blue-500",
          badge: "bg-blue-100",
        };
      case "completed":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          icon: "text-emerald-500",
          badge: "bg-emerald-100",
        };
      case "cancelled":
      case "rejected":
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          icon: "text-red-500",
          badge: "bg-red-100",
        };
      case "pending":
      case "cod_pending":
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
    const normalized = normalizeStatus(status);
    switch (normalized) {
      case "completed":
        return <CheckCircle2 size={18} />;
      case "cancelled":
      case "rejected":
        return <XCircle size={18} />;
      case "pending":
      case "cod_pending":
        return <AlertCircle size={18} />;
      default:
        return <Calendar size={18} />;
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const status = normalizeStatus(booking.status);
    if (activeTab === "Active")
      return [
        "active",
        "accepted",
        "pending",
        "confirmed",
        "in-progress",
        "paid",
      ].includes(status);
    if (activeTab === "Completed") return status === "completed";
    if (activeTab === "Cancelled")
      return ["cancelled", "rejected"].includes(status);
    return true;
  });

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-sky-50 to-slate-100 pt-32 pb-24 px-4 md:px-8">
      <div className="absolute -top-20 left-0 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      <div className="absolute top-24 right-0 h-64 w-64 rounded-full bg-sky-400/10 blur-3xl pointer-events-none" />
      <div className="max-w-7xl mx-auto">
        {/* HEADER SECTION */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 relative"
        >
          <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white/95 backdrop-blur-xl p-8 shadow-xl shadow-slate-200/10">
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
                  value: bookings.filter((b) =>
                    activeStatuses.includes(normalizeStatus(b.status)),
                  ).length,
                  color: "from-indigo-600 to-indigo-700",
                  icon: Clock,
                },
                {
                  label: "Completed",
                  value: bookings.filter(
                    (b) => normalizeStatus(b.status) === "completed",
                  ).length,
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
                    className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">
                          {stat.label}
                        </p>
                        <p className="text-4xl font-black text-slate-900">
                          {stat.value}
                        </p>
                      </div>
                      <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-200/30">
                        <Icon size={24} />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
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
              const status = String(b.status || "").toLowerCase();
              if (tab === "Active")
                return [
                  "active",
                  "accepted",
                  "pending",
                  "confirmed",
                  "in-progress",
                  "paid",
                ].includes(status);
              if (tab === "Completed") return status === "completed";
              if (tab === "Cancelled")
                return ["cancelled", "rejected"].includes(status);
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
                    className={`group bg-white border border-slate-200 rounded-[2rem] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden`}
                  >
                    {/* Status indicator bar */}
                    <div className={`h-1 ${colors.icon}`} />

                    <div className="px-7 py-6">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start md:items-center">
                        {/* Worker Info */}
                        <div className="md:col-span-3">
                          <div className="flex items-start gap-4">
                            <div className="relative">
                              <img
                                src={
                                  booking.expertImage ||
                                  booking.workerId?.photo ||
                                  "https://images.pexels.com/photos/5935858/pexels-photo-5935858.jpeg?auto=compress&cs=tinysrgb&w=400"
                                }
                                alt={
                                  booking.workerId?.name ||
                                  booking.expert ||
                                  "Expert"
                                }
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
                                {booking.workerId?.name ||
                                  booking.expert ||
                                  "Service Expert"}
                              </p>
                              <div className="flex items-center gap-1 mb-2">
                                <div className="flex gap-0.5">
                                  {[...Array(5)].map((_, i) => (
                                    <span
                                      key={i}
                                      className={
                                        i <
                                        Math.floor(
                                          booking.workerId?.rating ??
                                            booking.rating ??
                                            0,
                                        )
                                          ? "text-amber-400"
                                          : "text-slate-300"
                                      }
                                    >
                                      ★
                                    </span>
                                  ))}
                                </div>
                                <span className="text-xs font-bold text-amber-600 ml-1">
                                  {booking.workerId?.rating ??
                                    booking.rating ??
                                    "0.0"}
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
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                            Service Details
                          </p>
                          <div>
                            <p className="text-lg font-black text-slate-900 mb-3">
                              {booking.serviceId?.name ||
                                booking.service ||
                                "Service"}
                            </p>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 text-slate-700 text-sm">
                              <div className="p-3 rounded-2xl bg-indigo-100">
                                <Calendar
                                  size={16}
                                  className="text-indigo-600"
                                />
                              </div>
                              <div>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                                  Date
                                </p>
                                <span className="font-black">
                                  {formatDate(
                                    booking.date || booking.createdAt,
                                  )}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 text-slate-700 text-sm">
                              <div className="p-3 rounded-2xl bg-blue-100">
                                <Clock size={16} className="text-blue-600" />
                              </div>
                              <div>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                                  Time
                                </p>
                                <span className="font-black">
                                  {formatTime(
                                    booking.date || booking.createdAt,
                                  )}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 text-slate-700 text-sm">
                              <div className="p-3 rounded-2xl bg-sky-100">
                                <MapPin size={16} className="text-sky-600" />
                              </div>
                              <div className="flex-1">
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                                  Location
                                </p>
                                <span className="font-black line-clamp-1 text-sm">
                                  {booking.address ||
                                    booking.location ||
                                    "Location not provided"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* AMOUNT & STATUS */}
                        <div className="md:col-span-2 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                            Payment
                          </p>
                          <p className="text-3xl font-black text-slate-900 mb-4 flex items-baseline gap-1">
                            <IndianRupee
                              size={22}
                              className="text-indigo-700"
                            />
                            {(
                              (booking.amount ?? booking.price ?? 0) ||
                              0
                            ).toLocaleString()}
                          </p>
                          <div className="flex flex-col gap-3">
                            <div
                              className={`inline-flex px-3 py-2 rounded-full text-[11px] font-black uppercase tracking-widest ${colors.badge} ${colors.text} shadow-sm`}
                            >
                              {String(booking.status || "").replace(/_/g, " ")}
                            </div>
                            <p className="text-xs text-slate-600 font-semibold">
                              Status updated automatically
                            </p>
                          </div>
                        </div>

                        {/* ACTION BUTTONS */}
                        <div className="md:col-span-4 flex flex-col gap-2">
                          {["confirmed", "active", "in-progress"].includes(
                            normalizeStatus(booking.status),
                          ) ? (
                            <>
                              <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() =>
                                  navigate("/tracking", {
                                    state: { bookingId: booking._id },
                                  })
                                }
                                className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-black rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-indigo-200/60 hover:shadow-xl transition-all flex items-center justify-center gap-2 border border-indigo-300/30"
                              >
                                <Map size={16} />
                                <span>Track Booking</span>
                              </motion.button>
                              <div className="grid grid-cols-3 gap-2">
                                <motion.button
                                  whileHover={{ scale: 1.05, y: -2 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() =>
                                    window.open(`tel:${booking.phone}`, "_self")
                                  }
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
                                  onClick={() =>
                                    handleMarkWorkDone(booking._id)
                                  }
                                  className="px-3 py-3 bg-emerald-50 text-emerald-700 font-black rounded-lg text-xs uppercase tracking-widest hover:bg-emerald-100 transition-all flex items-center justify-center gap-1.5 border border-emerald-300 shadow-sm"
                                >
                                  <CheckCircle2 size={14} />
                                  <span>Work Done</span>
                                </motion.button>
                              </div>
                            </>
                          ) : normalizeStatus(booking.status) ===
                            "completed" ? (
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
