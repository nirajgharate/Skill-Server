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

export default function NotificationPage() {
  const navigate = useNavigate();
  const { registerUser, on, off } = useSocket();

  const [notifications, setNotifications] = useState([]);

  const saveNotifications = (items) => {
    localStorage.setItem("skillserverNotifications", JSON.stringify(items));
    setNotifications(items);
  };

  const addNotification = useCallback((notification) => {
    setNotifications((prev) => {
      const next = [notification, ...prev].slice(0, 50);
      localStorage.setItem("skillserverNotifications", JSON.stringify(next));
      return next;
    });
  }, []);

  useEffect(() => {
    const stored = JSON.parse(
      localStorage.getItem("skillserverNotifications") || "[]",
    );
    if (stored.length) {
      setNotifications(stored);
      return;
    }

    const initial = [
      {
        id: 1,
        type: "job_request",
        title: "New Job Request",
        message: "Aditi Verma requested electrical repair service",
        time: "5 mins ago",
        read: false,
        icon: Briefcase,
        color: "bg-blue-100 text-blue-600",
      },
      {
        id: 2,
        type: "job_accepted",
        title: "Job Accepted",
        message: "Your electrical repair job on Apr 18 has been confirmed",
        time: "1 hour ago",
        read: false,
        icon: CheckCircle2,
        color: "bg-green-100 text-green-600",
      },
      {
        id: 3,
        type: "payment",
        title: "Payment Received",
        message: "₹500 has been added to your wallet from completed job",
        time: "2 hours ago",
        read: true,
        icon: Zap,
        color: "bg-amber-100 text-amber-600",
      },
      {
        id: 4,
        type: "review",
        title: "New Review",
        message: "Rahul Singh left you a 5-star review: Excellent work!",
        time: "3 hours ago",
        read: true,
        icon: Star,
        color: "bg-purple-100 text-purple-600",
      },
      {
        id: 5,
        type: "system",
        title: "Profile Incomplete",
        message:
          "Complete your profile to increase visibility in worker listings",
        time: "Yesterday",
        read: true,
        icon: AlertCircle,
        color: "bg-slate-100 text-slate-600",
      },
      {
        id: 6,
        type: "message",
        title: "New Message",
        message: "Priya Sharma sent you a message about plumbing services",
        time: "Yesterday",
        read: true,
        icon: MessageSquare,
        color: "bg-indigo-100 text-indigo-600",
      },
    ];
    saveNotifications(initial);
  }, [saveNotifications]);

  useEffect(() => {
    const stored = localStorage.getItem("skillserverUser");
    if (!stored) return;

    const user = JSON.parse(stored);
    registerUser(user._id, user.role || "user");

    const handleBookingAccepted = (data) => {
      if (data.userId !== user._id) return;
      addNotification({
        id: `${Date.now()}-accepted`,
        type: "job_accepted",
        title: "Worker Accepted Your Booking",
        message: `${data.workerName} accepted your booking for ${data.serviceName}.`,
        time: "Just now",
        read: false,
        icon: CheckCircle2,
        color: "bg-green-100 text-green-600",
      });
    };

    const handleBookingRejected = (data) => {
      if (data.userId !== user._id) return;
      addNotification({
        id: `${Date.now()}-rejected`,
        type: "job_rejected",
        title: "Booking Rejected",
        message: data.message || "Your booking was rejected.",
        time: "Just now",
        read: false,
        icon: AlertCircle,
        color: "bg-red-100 text-red-600",
      });
    };

    on("booking_accepted", handleBookingAccepted);
    on("booking_rejected", handleBookingRejected);

    return () => {
      off("booking_accepted", handleBookingAccepted);
      off("booking_rejected", handleBookingRejected);
    };
  }, [addNotification, off, on, registerUser]);

  const removeNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 pt-20 pb-12">
      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200/50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/worker-dashboard")}
              className="p-2 hover:bg-slate-100 rounded-lg transition-all"
            >
              <ArrowLeft size={24} className="text-slate-600" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-slate-900">
                Notifications
              </h1>
              <p className="text-xs font-semibold text-slate-500">
                {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
              </p>
            </div>
          </div>

          {unreadCount > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={markAllRead}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-all"
            >
              Mark All Read
            </motion.button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {notifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-12 border border-slate-200 shadow-lg text-center"
          >
            <div className="flex justify-center mb-4">
              <div className="p-6 bg-slate-100 rounded-full">
                <Bell size={48} className="text-slate-400" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">
              All Caught Up!
            </h3>
            <p className="text-slate-600">
              You have no notifications at the moment
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {notifications.map((notification, idx) => {
                const Icon = notification.icon;
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`bg-white rounded-2xl p-6 border ${
                      notification.read
                        ? "border-slate-200"
                        : "border-indigo-300 bg-indigo-50/30"
                    } shadow-lg hover:shadow-xl transition-all`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div
                        className={`p-3 rounded-xl flex-shrink-0 ${notification.color}`}
                      >
                        <Icon size={24} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h3
                            className={`font-black ${
                              notification.read
                                ? "text-slate-600"
                                : "text-slate-900"
                            }`}
                          >
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full flex-shrink-0 mt-1.5" />
                          )}
                        </div>

                        <p
                          className={`text-sm mb-3 ${
                            notification.read
                              ? "text-slate-500"
                              : "text-slate-700"
                          }`}
                        >
                          {notification.message}
                        </p>

                        <p className="text-xs font-semibold text-slate-400">
                          {notification.time}
                        </p>
                      </div>

                      {/* Action */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => removeNotification(notification.id)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-all flex-shrink-0"
                      >
                        <X size={20} className="text-slate-400" />
                      </motion.button>
                    </div>

                    {/* Quick Action */}
                    {notification.type === "job_request" && (
                      <div className="flex gap-3 mt-4 pl-14">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-all"
                        >
                          Accept Job
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-semibold text-sm hover:bg-slate-200 transition-all"
                        >
                          Decline
                        </motion.button>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
