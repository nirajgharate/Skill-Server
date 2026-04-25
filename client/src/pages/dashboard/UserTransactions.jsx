import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  Search,
  User as UserIcon,
  RefreshCw,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { userService } from "../../services/api.service";

const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatTime = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown time";
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const normalizeStatus = (status) => String(status || "").toLowerCase();

export default function UserTransactions() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getUserBookings();
      const bookingList = Array.isArray(response)
        ? response
        : response?.data || [];
      setTransactions(
        bookingList
          .map((booking) => ({
            ...booking,
            date: booking.date || booking.createdAt,
          }))
          .sort((a, b) => new Date(b.date) - new Date(a.date)),
      );
    } catch (err) {
      console.error("Error loading transactions:", err);
      setError("Unable to load transactions. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTransactions();
    setRefreshing(false);
  };

  const filteredTransactions = transactions.filter((booking) => {
    const label =
      `${booking.serviceId?.name || booking.serviceName || ""}`.toLowerCase();
    return label.includes(query.toLowerCase());
  });

  const totalAmount = transactions.reduce(
    (sum, booking) => sum + (booking.price ?? booking.amount ?? 0),
    0,
  );

  const completedCount = transactions.filter(
    (booking) => normalizeStatus(booking.status) === "completed",
  ).length;

  const activeCount = transactions.filter((booking) =>
    ["pending", "confirmed", "accepted", "in-progress", "active"].includes(
      normalizeStatus(booking.status),
    ),
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 pb-12">
      <div className="relative z-40 backdrop-blur-lg bg-white/80 border-b border-slate-200/50 mt-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between gap-4">
          <button
            onClick={() => navigate("/user-dashboard")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all"
          >
            <ArrowLeft size={18} /> Back
          </button>
          <div>
            <p className="text-slate-500 text-xs uppercase tracking-[0.25em] font-semibold">
              Payments & Bookings
            </p>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900">
              Transaction History
            </h1>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all disabled:opacity-60"
          >
            <RefreshCw size={16} />
            {refreshing ? "Refreshing" : "Refresh"}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[
            {
              label: "Total Transactions",
              value: transactions.length,
              icon: CheckCircle2,
              color: "from-indigo-500 to-blue-500",
            },
            {
              label: "Total Paid",
              value: `₹${totalAmount.toLocaleString()}`,
              icon: DollarSign,
              color: "from-emerald-500 to-teal-500",
            },
            {
              label: "Active Transactions",
              value: activeCount,
              icon: Calendar,
              color: "from-amber-500 to-orange-500",
            },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-3xl font-black text-slate-900">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-2xl bg-gradient-to-br ${stat.color} text-white`}
                >
                  <stat.icon size={22} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 border-b border-slate-200">
            <div>
              <p className="text-slate-600 text-sm font-semibold uppercase tracking-wider">
                Recent Transactions
              </p>
              <p className="text-slate-900 font-black text-xl mt-1">
                Latest payments and booking activity
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-72">
                <Search
                  size={16}
                  className="absolute left-3 top-3 text-slate-400"
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search services"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <button
                onClick={() => navigate("/dashboard")}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 transition-all"
              >
                <UserIcon size={16} /> My Dashboard
              </button>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-14 h-14 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
              </div>
            ) : error ? (
              <div className="text-center py-16 text-sm text-red-600">
                {error}
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="text-center py-16 text-slate-600">
                <AlertTriangle
                  size={36}
                  className="mx-auto mb-4 text-slate-400"
                />
                <p className="font-bold text-slate-900">
                  No transactions found
                </p>
                <p className="text-sm text-slate-500 mt-2">
                  Try a different search query or refresh the page.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTransactions.map((booking, idx) => (
                  <motion.div
                    key={booking._id || idx}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="rounded-3xl border border-slate-200 bg-slate-50 p-5 hover:border-indigo-200 hover:bg-white transition-all"
                  >
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-3xl bg-indigo-100 flex items-center justify-center">
                            <Calendar size={18} className="text-indigo-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-lg font-bold text-slate-900 truncate">
                              {booking.serviceId?.name ||
                                booking.serviceName ||
                                "Service"}
                            </p>
                            <p className="text-sm text-slate-500 truncate">
                              {booking.workerId?.name || "Assigned worker"}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                          <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 border border-slate-200">
                            <Clock size={12} /> {formatTime(booking.date)}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 border border-slate-200">
                            <MapPin size={12} />{" "}
                            {booking.address || "No location"}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 border border-slate-200">
                            <Calendar size={12} /> {formatDate(booking.date)}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-start sm:items-end gap-3 text-right">
                        <p className="text-xl font-black text-slate-900">
                          ₹
                          {(
                            booking.price ??
                            booking.amount ??
                            0
                          ).toLocaleString()}
                        </p>
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${
                            normalizeStatus(booking.status) === "completed"
                              ? "bg-emerald-100 text-emerald-700"
                              : normalizeStatus(booking.status) === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : normalizeStatus(booking.status) ===
                                      "confirmed" ||
                                    normalizeStatus(booking.status) ===
                                      "accepted"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
