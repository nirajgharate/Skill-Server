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
  Sparkles,
} from "lucide-react";
import API from "../api/api";
import { bookingService } from "../services/api.service";
import { useBooking } from "../hooks/useBooking";
import { useAuth } from "../hooks/useAuth";
import { getAvatarUrl } from "../utils/avatar.util";

export default function MyBookingsDashboard() {
  const navigate = useNavigate();
  const { selectedWorker } = useBooking();
  const { user: authUser } = useAuth();
  const [activeTab, setActiveTab] = useState("All");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

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
      const response = await bookingService.markWorkDone(bookingId, {
        role: "user",
      });
      const updatedBooking = response.data || response;
      if (
        updatedBooking &&
        String(updatedBooking.status || "").toLowerCase() === "completed"
      ) {
        openReviewModal(updatedBooking);
      }
      fetchBookings();
    } catch (err) {
      console.error("Failed to mark work done:", err);
      window.alert(
        err.response?.data?.message ||
          "Unable to complete booking. Please refresh and try again.",
      );
    }
  };

  const openReviewModal = (booking) => {
    setSelectedBooking(booking);
    setReviewRating(booking.review?.rating || 5);
    setReviewComment(booking.review?.comment || "");
    setReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setReviewModalOpen(false);
    setSelectedBooking(null);
    setReviewRating(5);
    setReviewComment("");
  };

  const getBookingAvatarUrl = (booking) => {
    const bookingWorkerId =
      booking.workerId?._id || booking.workerId || booking._id;
    const selectedWorkerId = selectedWorker?._id || selectedWorker;
    const profilePhoto =
      selectedWorker && bookingWorkerId === selectedWorkerId
        ? selectedWorker.profilePhoto || selectedWorker.img
        : booking.workerId?.profilePhoto || booking.workerId?.img;

    return getAvatarUrl({
      profilePhoto,
      name: booking.workerId?.name || booking.expert || "Expert",
      id: bookingWorkerId,
      fallbackSeed:
        booking.workerId?._id ||
        booking._id ||
        booking.workerId?.name ||
        booking.expert ||
        "expert-profile",
    });
  };

  const handleSubmitReview = async () => {
    if (!selectedBooking) return;
    if (reviewRating < 1 || reviewRating > 5) {
      window.alert("Please select a rating between 1 and 5.");
      return;
    }

    try {
      setReviewSubmitting(true);
      await bookingService.submitBookingReview(
        selectedBooking._id,
        reviewRating,
        reviewComment.trim(),
      );
      closeReviewModal();
      fetchBookings();
    } catch (err) {
      console.error("Submit review failed:", err);
      window.alert(
        err.response?.data?.message ||
          "Failed to submit review. Please try again.",
      );
    } finally {
      setReviewSubmitting(false);
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

  const normalizeDateValue = (value) => {
    if (!value) return null;
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return new Date(`${value}T00:00:00`);
    }
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  };

  const formatDate = (value) => {
    const date = normalizeDateValue(value);
    if (!date) return "TBD";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (value) => {
    if (
      value &&
      typeof value === "string" &&
      /^(\d{1,2})(:\d{2})?\s*(AM|PM)$/i.test(value.trim())
    ) {
      return value.trim();
    }
    const date = normalizeDateValue(value);
    if (!date) return "TBD";
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getBookingDate = (booking) => {
    if (booking?.date) return booking.date;
    return booking?.createdAt || "";
  };

  const getBookingTime = (booking) => {
    if (booking?.time) return booking.time;
    return booking?.date || booking?.createdAt || "";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-[#070B16] dark:via-slate-950 dark:to-slate-900 pb-12 transition-colors duration-500">
      <div className="relative z-40 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-800/80 mt-24 transition-colors">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={getAvatarUrl({
                  profilePhoto: authUser?.profilePhoto,
                  name: authUser?.name || "User",
                  id: authUser?._id,
                  fallbackSeed: "user-bookings-avatar",
                })}
                alt={authUser?.name || "User"}
                className="w-14 h-14 rounded-3xl object-cover border border-slate-200 dark:border-slate-800"
              />
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-indigo-650 dark:text-indigo-405 shadow-sm">
                <Sparkles size={14} />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                My Bookings
              </h1>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Track all your orders and service requests.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <button
              onClick={fetchBookings}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-900 transition-all cursor-pointer"
            >
              <RotateCcw size={16} /> Refresh
            </button>
            <button
              onClick={() => navigate("/services")}
              className="inline-flex items-center gap-2 rounded-2xl bg-indigo-650 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-200/40 dark:shadow-none hover:bg-indigo-700 transition-all cursor-pointer"
            >
              <Plus size={16} /> New Booking
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Bookings",
              value: bookings.length,
              color: "from-slate-500 to-slate-700",
              icon: Calendar,
            },
            {
              label: "Active",
              value: bookings.filter((b) =>
                activeStatuses.includes(normalizeStatus(b.status)),
              ).length,
              color: "from-indigo-500 to-blue-500",
              icon: Clock,
            },
            {
              label: "Completed",
              value: bookings.filter(
                (b) => normalizeStatus(b.status) === "completed",
              ).length,
              color: "from-emerald-500 to-teal-500",
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
                className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition-colors"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400 mb-2">
                      {stat.label}
                    </p>
                    <p className="text-4xl font-black text-slate-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}
                  >
                    <Icon size={22} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-10 flex gap-3 flex-wrap"
          >
            {["All", "Active", "Completed", "Cancelled"].map((tab) => {
              const tabCount = bookings.filter((b) => {
                const status = String(b.status || "").toLowerCase();
                if (tab === "All") return true;
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
                  className={`px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-widest transition-all cursor-pointer ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-200/50 dark:shadow-none"
                      : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800/80 hover:border-indigo-300 hover:bg-slate-50 dark:hover:bg-slate-955"
                  }`}
                >
                  {tab}
                  <span
                    className={`ml-2 px-3 py-0.5 rounded-md text-xs font-black ${
                      activeTab === tab ? "bg-white/20" : "bg-slate-100 dark:bg-slate-800"
                    }`}
                  >
                    {tabCount}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>
        </div>

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
            className="text-center py-24 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-lg transition-colors"
          >
            <div className="inline-block p-4 bg-slate-100 dark:bg-slate-950 rounded-xl mb-6">
              <Calendar size={48} className="text-slate-400 dark:text-slate-500" />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white mb-3">
              No {activeTab.toLowerCase()} bookings
            </p>
            <p className="text-slate-655 dark:text-slate-400 font-medium mb-8 max-w-sm mx-auto">
              Start booking professional services to see them appear here
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate("/services")}
              className="px-8 py-3 bg-gradient-to-r from-indigo-650 to-indigo-700 text-white rounded-lg font-bold shadow-lg shadow-indigo-200/50 dark:shadow-none hover:shadow-xl transition-all cursor-pointer"
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
                    className={`group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-[2rem] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden`}
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
                                src={getBookingAvatarUrl(booking)}
                                alt={
                                  booking.workerId?.name ||
                                  booking.expert ||
                                  "Expert"
                                }
                                className="w-16 h-16 rounded-xl object-cover shadow-lg group-hover:shadow-2xl transition-shadow"
                              />
                              <div
                                className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center ${colors.badge} ${colors.icon} shadow-lg bg-white dark:bg-slate-900`}
                              >
                                {getStatusIcon(booking.status)}
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="font-black text-slate-900 dark:text-white mb-1 line-clamp-1">
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
                                          : "text-slate-300 dark:text-slate-700"
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
                              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                                Professional Expert
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* SERVICE DETAILS */}
                        <div className="md:col-span-3 space-y-3">
                          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                            Service Details
                          </p>
                          <div>
                            <p className="text-lg font-black text-slate-900 dark:text-white mb-3">
                              {booking.serviceId?.name ||
                                booking.service ||
                                "Service"}
                            </p>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-sm">
                              <div className="p-3 rounded-2xl bg-indigo-100 dark:bg-indigo-950/40">
                                <Calendar
                                  size={16}
                                  className="text-indigo-650 dark:text-indigo-400"
                                />
                              </div>
                              <div>
                                <p className="text-xs text-slate-500 dark:text-slate-500 font-bold uppercase tracking-widest">
                                  Date
                                </p>
                                <span className="font-black text-slate-800 dark:text-slate-200">
                                  {formatDate(getBookingDate(booking))}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-sm">
                              <div className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-950/40">
                                <Clock size={16} className="text-blue-600 dark:text-blue-400" />
                              </div>
                              <div>
                                <p className="text-xs text-slate-500 dark:text-slate-500 font-bold uppercase tracking-widest">
                                  Time
                                </p>
                                <span className="font-black text-slate-800 dark:text-slate-200">
                                  {formatTime(getBookingTime(booking))}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-sm">
                              <div className="p-3 rounded-2xl bg-sky-100 dark:bg-sky-950/40">
                                <MapPin size={16} className="text-sky-600 dark:text-sky-400" />
                              </div>
                              <div className="flex-1">
                                <p className="text-xs text-slate-500 dark:text-slate-500 font-bold uppercase tracking-widest">
                                  Location
                                </p>
                                <span className="font-black line-clamp-1 text-sm text-slate-800 dark:text-slate-200">
                                  {booking.address ||
                                    booking.location ||
                                    "Location not provided"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* AMOUNT & STATUS */}
                        <div className="md:col-span-2 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-5 transition-colors">
                          <p className="text-xs font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest mb-3">
                            Payment
                          </p>
                          <p className="text-3xl font-black text-slate-900 dark:text-white mb-4 flex items-baseline gap-1">
                            <IndianRupee
                              size={22}
                              className="text-indigo-700 dark:text-indigo-405"
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
                            <p className="text-xs text-slate-655 dark:text-slate-400 font-semibold">
                              Status updated automatically
                            </p>
                          </div>
                        </div>

                        {/* ACTION BUTTONS */}
                        <div className="md:col-span-4 flex flex-col gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                              navigate(`/user/bookings/${booking._id}`)
                            }
                            className="w-full px-4 py-3 bg-slate-900 dark:bg-slate-800 text-white font-black rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-slate-200/30 dark:shadow-none hover:bg-slate-800 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2 border border-slate-800/30 dark:border-slate-700/55 cursor-pointer"
                          >
                            <ChevronRight size={14} />
                            <span>View Details</span>
                          </motion.button>
                          {activeStatuses.includes(
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
                                className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-black rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-indigo-200/60 dark:shadow-none hover:shadow-xl transition-all flex items-center justify-center gap-2 border border-indigo-300/30 dark:border-indigo-850/50 cursor-pointer"
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
                                  className="px-2 py-2.5 sm:px-3 sm:py-3 bg-white dark:bg-slate-950 text-slate-705 dark:text-slate-300 font-black rounded-lg text-[10px] sm:text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-900 transition-all flex items-center justify-center gap-1 border border-slate-300 dark:border-slate-800 shadow-sm cursor-pointer"
                                >
                                  <Phone size={12} className="shrink-0" />
                                  <span>Call</span>
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.05, y: -2 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() =>
                                    navigate(
                                      `/messages/${booking._id || booking.id}`,
                                    )
                                  }
                                  className="px-2 py-2.5 sm:px-3 sm:py-3 bg-white dark:bg-slate-950 text-slate-705 dark:text-slate-300 font-black rounded-lg text-[10px] sm:text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-900 transition-all flex items-center justify-center gap-1 border border-slate-300 dark:border-slate-800 shadow-sm cursor-pointer"
                                >
                                  <MessageSquare size={12} className="shrink-0" />
                                  <span>Message</span>
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.05, y: -2 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() =>
                                    handleMarkWorkDone(booking._id)
                                  }
                                  className="px-2 py-2.5 sm:px-3 sm:py-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-707 dark:text-emerald-400 font-black rounded-lg text-[10px] sm:text-xs uppercase tracking-widest hover:bg-emerald-100 dark:hover:bg-emerald-900/20 transition-all flex items-center justify-center gap-1 border border-emerald-300 dark:border-emerald-850/40 shadow-sm cursor-pointer"
                                >
                                  <CheckCircle2 size={12} className="shrink-0" />
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
                                onClick={() =>
                                  !booking.review && openReviewModal(booking)
                                }
                                className={`w-full px-4 py-3 font-black rounded-xl text-xs uppercase tracking-widest shadow-lg transition-all flex items-center justify-center gap-2 border cursor-pointer ${
                                  booking.review
                                    ? "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-700 cursor-not-allowed"
                                    : "bg-gradient-to-r from-emerald-650 to-emerald-700 text-white border-emerald-300/30 hover:shadow-emerald-200/60 hover:shadow-xl dark:shadow-none"
                                }`}
                                disabled={Boolean(booking.review)}
                              >
                                <Star size={16} />
                                <span>
                                  {booking.review ? "Reviewed" : "Leave Review"}
                                </span>
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate("/services")}
                                className="w-full px-4 py-3 bg-white dark:bg-slate-950 text-indigo-755 dark:text-indigo-400 font-black rounded-xl text-xs uppercase tracking-widest hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-all flex items-center justify-center gap-2 border border-indigo-300 dark:border-indigo-900/50 shadow-sm cursor-pointer"
                              >
                                <RotateCcw size={14} />
                                <span>Book Again</span>
                              </motion.button>
                              {booking.review && (
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
                                  Review submitted: "
                                  {booking.review.comment?.slice(0, 50)}"
                                </p>
                              )}
                            </>
                          ) : (
                            <motion.button
                              whileHover={{ scale: 1.05, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => navigate("/services")}
                              className="w-full px-4 py-3 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-755 dark:text-indigo-400 font-black rounded-xl text-xs uppercase tracking-widest hover:bg-indigo-100 dark:hover:bg-indigo-900/20 transition-all flex items-center justify-center gap-2 border border-indigo-300 dark:border-indigo-900/50 shadow-sm cursor-pointer"
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
      <AnimatePresence>
        {reviewModalOpen && selectedBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="w-full max-w-2xl overflow-hidden rounded-[2rem] bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    {selectedBooking.review ? "Edit Review" : "Leave a Review"}
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Review{" "}
                    {selectedBooking.workerId?.name ||
                      selectedBooking.expert ||
                      "the worker"}{" "}
                    for booking on {formatDate(selectedBooking.date)}.
                  </p>
                </div>
                <button
                  onClick={closeReviewModal}
                  className="text-slate-400 hover:text-slate-700"
                >
                  Close
                </button>
              </div>
              <div className="px-6 py-6 space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">
                    Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setReviewRating(value)}
                        className={`px-4 py-3 rounded-full border text-sm font-black transition ${
                          reviewRating === value
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-slate-50 text-slate-700 border-slate-200"
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">
                    Review comment
                  </label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={5}
                    className="w-full rounded-3xl border border-slate-200 px-4 py-3 text-sm text-slate-900 resize-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    placeholder="Tell us about your experience..."
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3 px-6 py-4 border-t border-slate-200 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeReviewModal}
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmitReview}
                  disabled={reviewSubmitting}
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-all disabled:cursor-not-allowed disabled:bg-emerald-300"
                >
                  {reviewSubmitting ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
