import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Bell,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  MessageSquare,
  Star,
  Zap,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../hooks/useSocket";
import { useAuth } from "../hooks/useAuth";
import { bookingService, userService } from "../services/api.service";

const safeParseJSON = (value, fallback) => {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch (error) {
    console.warn("Invalid JSON in localStorage, resetting value:", error);
    return fallback;
  }
};

export default function NotificationPage() {
  const navigate = useNavigate();
  const { registerUser, on, off } = useSocket();

  const { user: authUser } = useAuth();
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState("user");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const clearNotifications = () => {
    setNotifications([]);
  };

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const newNotifications = [];

      if (role === "worker") {
        // Load pending bookings for workers
        const bookings = await bookingService.getWorkerBookings();
        if (Array.isArray(bookings)) {
          const pendingBookings = bookings.filter((booking) =>
            ["pending"].includes(String(booking.status || "").toLowerCase()),
          );

          pendingBookings.forEach((booking) => {
            newNotifications.push({
              id: `booking-${booking._id}`,
              type: "booking",
              message: `You have a new booking request from ${booking.userId?.name || booking.customer || "a customer"}`,
              timestamp: new Date(booking.createdAt || Date.now()),
              data: booking,
            });
          });
        }
      } else {
        // Load accepted/cancelled bookings for users
        const bookings = await userService.getUserBookings();
        if (Array.isArray(bookings)) {
          const relevantBookings = bookings.filter((booking) =>
            ["Confirmed", "Cancelled"].includes(String(booking.status || "")),
          );

          relevantBookings.forEach((booking) => {
            const statusText =
              booking.status === "Confirmed"
                ? "accepted"
                : "cancelled/rejected";
            newNotifications.push({
              id: `booking-${booking._id}`,
              type: "booking",
              message: `Your booking with ${booking.workerId?.name || booking.worker || "a worker"} has been ${statusText}`,
              timestamp: new Date(booking.createdAt || Date.now()),
              data: booking,
            });
          });
        }
      }

      // Sort notifications by timestamp (newest first)
      newNotifications.sort((a, b) => b.timestamp - a.timestamp);
      setNotifications(newNotifications);
    } catch (err) {
      console.warn("Unable to load notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("skillserverUser");
    const storedUser = safeParseJSON(stored, null);
    const user = authUser || storedUser;
    if (!user) return;

    setCurrentUser(user);
    setRole(user.role || "user");
    registerUser(user._id, user.role || "user");

    const handleBookingCreated = (data) => {
      if (user.role !== "worker") return;
      if (data.workerId && String(data.workerId) !== String(user._id)) return;

      // Add new booking notification
      const newNotification = {
        id: `booking-${data._id || Date.now()}`,
        type: "booking",
        message: `You have a new booking request from ${data.customerName || "a customer"}`,
        timestamp: new Date(),
        data: data,
      };

      setNotifications((prev) => [newNotification, ...prev]);
    };

    const handleIncomingMessage = (data) => {
      // Only show messages not sent by current user
      if (data.senderId === user._id) return;

      // Validate message data
      if (!data.message || !data.senderName) {
        console.warn("Invalid message data received:", data);
        return;
      }

      const messageText =
        data.message.length > 100
          ? `${data.message.substring(0, 100)}...`
          : data.message;

      const newNotification = {
        id: `message-${Date.now()}-${Math.random()}`,
        type: "message",
        message: `${data.senderName} sent you a message: "${messageText}"`,
        timestamp: new Date(data.createdAt || Date.now()),
        data: data,
      };

      setNotifications((prev) => [newNotification, ...prev]);
    };

    on("booking_created", handleBookingCreated);
    on("message_sent", handleIncomingMessage);

    // Load initial notifications
    loadNotifications();

    return () => {
      off("booking_created", handleBookingCreated);
      off("message_sent", handleIncomingMessage);
    };
  }, [authUser, off, on, registerUser, role]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-28 md:pt-32 pb-12">
        <div className="max-w-5xl mx-auto px-6 py-12 flex items-center justify-center">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-400 rounded-full animate-spin animation-delay-150"></div>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-slate-700 mb-2">
                Loading your notifications
              </p>
              <p className="text-sm text-slate-500">
                Please wait while we fetch your latest updates...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-28 md:pt-32 pb-12">
      {/* Header */}
      <div className="sticky top-28 md:top-32 z-40 backdrop-blur-xl bg-white/90 border-b border-slate-200/60 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <button
                onClick={() =>
                  navigate(
                    role === "worker" ? "/worker-dashboard" : "/user-dashboard",
                  )
                }
                className="group p-3 hover:bg-slate-100 rounded-xl transition-all duration-200 hover:scale-105"
              >
                <ArrowLeft
                  size={22}
                  className="text-slate-600 group-hover:text-slate-800"
                />
              </button>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                  <Bell size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                    Notifications
                  </h1>
                  <p className="text-sm font-medium text-slate-600 mt-1">
                    {role === "worker"
                      ? "Stay updated with new requests and messages"
                      : "Track your booking updates and conversations"}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div
                      className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all duration-200 ${
                        notifications.length > 0
                          ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {notifications.length > 0
                        ? `${notifications.length} ${notifications.length === 1 ? "notification" : "notifications"}`
                        : "No new notifications"}
                    </div>
                    {notifications.length > 0 && (
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-lg"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {notifications.length > 0 && (
              <button
                onClick={clearNotifications}
                className="px-5 py-2.5 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white text-sm font-semibold rounded-xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-400 rounded-full animate-spin animation-delay-150"></div>
            </div>
            <p className="text-sm font-medium text-slate-600 mt-6 animate-pulse">
              Loading notifications...
            </p>
          </div>
        ) : notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`group bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 relative overflow-hidden ${
                  notification.type === "message"
                    ? "hover:border-blue-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-gradient-to-b before:from-blue-500 before:to-indigo-600"
                    : "hover:border-emerald-200 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-gradient-to-b before:from-emerald-500 before:to-green-600"
                }`}
                onClick={() => {
                  if (
                    notification.type === "message" &&
                    notification.data.bookingId
                  ) {
                    navigate(`/messages/${notification.data.bookingId}`);
                  } else if (notification.type === "booking") {
                    navigate(
                      role === "worker"
                        ? "/worker-dashboard"
                        : "/user-dashboard",
                    );
                  }
                }}
              >
                <div className="flex items-start gap-5">
                  <div
                    className={`flex-shrink-0 p-4 rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-300 ${
                      notification.type === "booking"
                        ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-blue-200"
                        : "bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-emerald-200"
                    }`}
                  >
                    {notification.type === "booking" ? (
                      <Briefcase size={24} />
                    ) : (
                      <MessageSquare size={24} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-slate-900 font-semibold leading-relaxed text-lg">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-3 mt-3">
                          <div
                            className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm ${
                              notification.type === "booking"
                                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                                : "bg-gradient-to-r from-emerald-500 to-green-600 text-white"
                            }`}
                          >
                            {notification.type === "booking"
                              ? "📋 Booking"
                              : "💬 Message"}
                          </div>
                          <span className="text-sm text-slate-500 font-medium flex items-center gap-2">
                            <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                            {notification.timestamp.toLocaleDateString()} at{" "}
                            {notification.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        {notification.type === "message" && (
                          <p className="text-sm text-blue-600 mt-2 font-medium flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                            Click to view conversation
                          </p>
                        )}
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="p-2 rounded-full bg-slate-100 group-hover:bg-slate-200 transition-colors">
                          <ArrowLeft
                            size={16}
                            className="text-slate-600 rotate-180"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-16 border border-slate-200/60 shadow-xl text-center max-w-2xl mx-auto"
          >
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full blur-2xl opacity-20"></div>
              <div className="relative p-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full w-fit mx-auto shadow-lg">
                <Bell size={64} className="text-slate-400" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">
              All Caught Up!
            </h3>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              {role === "worker"
                ? "No new booking requests or messages at the moment. We'll notify you when something arrives!"
                : "No booking updates or messages right now. Check back later for the latest updates!"}
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() =>
                  navigate(
                    role === "worker" ? "/worker-dashboard" : "/user-dashboard",
                  )
                }
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Go to Dashboard
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
