import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  MapPin,
  User,
  CheckCircle2,
  XCircle,
  RefreshCcw,
  Phone,
  MessageSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { bookingService } from "../../services/api.service";

const formatDateTime = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "TBD";
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const normalizeStatus = (status) => String(status || "pending").toLowerCase();

const badgeClass = (status) => {
  const normalized = normalizeStatus(status);
  if (normalized === "completed") return "bg-emerald-100 text-emerald-700";
  if (normalized === "confirmed" || normalized === "accepted")
    return "bg-blue-100 text-blue-700";
  if (normalized === "pending") return "bg-amber-100 text-amber-700";
  if (normalized === "cancelled" || normalized === "rejected")
    return "bg-red-100 text-red-700";
  return "bg-slate-100 text-slate-700";
};

export default function WorkerBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  const activeStatuses = [
    "pending",
    "accepted",
    "in-progress",
    "confirmed",
    "active",
    "paid",
  ];
  const markDoneStatuses = ["accepted", "in-progress"];
  const cancelledStatuses = ["cancelled", "rejected"];

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getWorkerBookings();
      setBookings(data);
      setError(null);
    } catch (err) {
      console.error("Error loading worker bookings:", err);
      setError("Unable to load your bookings. Please try again.");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleAccept = async (bookingId) => {
    setActionLoading((prev) => ({ ...prev, [bookingId]: true }));
    try {
      await bookingService.acceptBooking(bookingId);
      await loadBookings();
    } catch (err) {
      console.error("Accept booking error:", err);
      window.alert(err.response?.data?.message || "Unable to accept booking.");
    } finally {
      setActionLoading((prev) => ({ ...prev, [bookingId]: false }));
    }
  };

  const handleReject = async (bookingId) => {
    const reason = window.prompt(
      "Please enter a reason for rejecting this booking (optional):",
    );
    if (reason === null) return;
    setActionLoading((prev) => ({ ...prev, [bookingId]: true }));
    try {
      await bookingService.rejectBooking(bookingId, reason);
      await loadBookings();
    } catch (err) {
      console.error("Reject booking error:", err);
      window.alert(err.response?.data?.message || "Unable to reject booking.");
    } finally {
      setActionLoading((prev) => ({ ...prev, [bookingId]: false }));
    }
  };

  const handleMarkDone = async (bookingId) => {
    setActionLoading((prev) => ({ ...prev, [bookingId]: true }));
    try {
      await bookingService.markWorkDone(bookingId, { role: "worker" });
      await loadBookings();
    } catch (err) {
      console.error("Mark work done error:", err);
      window.alert(
        err.response?.data?.message || "Unable to update booking status.",
      );
    } finally {
      setActionLoading((prev) => ({ ...prev, [bookingId]: false }));
    }
  };

  const getBookingPhone = (booking) =>
    booking.userId?.phone || booking.phone || "";

  const getBookingEmail = (booking) =>
    booking.userId?.email || booking.email || "";

  const handleCall = (booking) => {
    const phone = getBookingPhone(booking);
    if (!phone) {
      window.alert("Phone number not available.");
      return;
    }
    window.open(`tel:${phone}`, "_self");
  };

  const handleMessage = (booking) => {
    const phone = getBookingPhone(booking);
    if (!phone) {
      window.alert("Phone number not available.");
      return;
    }
    window.open(`sms:${phone}`, "_blank");
  };

  const totals = {
    all: bookings.length,
    active: bookings.filter((job) =>
      activeStatuses.includes(normalizeStatus(job.status)),
    ).length,
    completed: bookings.filter(
      (job) => normalizeStatus(job.status) === "completed",
    ).length,
    cancelled: bookings.filter((job) =>
      cancelledStatuses.includes(normalizeStatus(job.status)),
    ).length,
  };

  const filteredBookings = bookings.filter((booking) => {
    const status = normalizeStatus(booking.status);
    if (activeTab === "All") return true;
    if (activeTab === "Active") return activeStatuses.includes(status);
    if (activeTab === "Completed") return status === "completed";
    if (activeTab === "Cancelled") return cancelledStatuses.includes(status);
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 pb-12">
      <div className="relative z-40 backdrop-blur-md bg-white/80 border-b border-slate-200/50 mt-24">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/worker-dashboard")}
              className="p-2 hover:bg-slate-100 rounded-lg transition-all"
            >
              <ArrowLeft size={24} className="text-slate-600" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-slate-900">
                My Bookings
              </h1>
              <p className="text-xs font-semibold text-slate-500">
                Review all current bookings assigned to you.
              </p>
            </div>
          </div>

          <button
            onClick={loadBookings}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-all"
          >
            <RefreshCcw size={16} /> Refresh
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              label: "Total Bookings",
              value: totals.all,
              color: "from-slate-500 to-slate-700",
            },
            {
              label: "Active Requests",
              value: totals.active,
              color: "from-indigo-500 to-blue-500",
            },
            {
              label: "Completed",
              value: totals.completed,
              color: "from-emerald-500 to-teal-500",
            },
            {
              label: "Cancelled",
              value: totals.cancelled,
              color: "from-rose-500 to-pink-500",
            },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm"
            >
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3">
                {stat.label}
              </p>
              <div className={`flex items-center justify-between gap-4`}>
                <p className="text-3xl font-black text-slate-900">
                  {stat.value}
                </p>
                <div
                  className={`w-11 h-11 rounded-3xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white`}
                >
                  <CheckCircle2 size={18} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          {[
            { label: "All", count: totals.all },
            { label: "Active", count: totals.active },
            { label: "Completed", count: totals.completed },
            { label: "Cancelled", count: totals.cancelled },
          ].map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className={`rounded-2xl border px-5 py-3 text-sm font-semibold transition-all ${
                activeTab === tab.label
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200/30"
                  : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
              }`}
            >
              {tab.label}
              <span className="ml-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-16 h-16 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-red-700 shadow-sm">
            <p className="font-bold mb-2">Unable to load bookings</p>
            <p className="text-sm mb-6">{error}</p>
            <button
              onClick={loadBookings}
              className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 transition-all"
            >
              Retry
            </button>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <p className="text-lg font-bold text-slate-900 mb-2">
              No bookings found for {activeTab}
            </p>
            <p className="text-sm text-slate-500">
              Switch tabs to see Active, Completed, Cancelled, or all your
              bookings.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking, idx) => (
              <motion.div
                key={booking._id || idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-slate-50 p-3 text-slate-800">
                        <User size={18} />
                      </div>
                      <div>
                        <h2 className="font-black text-slate-900 text-xl">
                          {booking.serviceId?.name ||
                            booking.service ||
                            booking.serviceName ||
                            "Service"}
                        </h2>
                        <p className="text-sm text-slate-500">
                          {booking.userId?.name || "Customer"}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-600 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        {formatDateTime(booking.date || booking.createdAt)}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        {booking.address ||
                          booking.location ||
                          "Location not provided"}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">Amount:</span>₹
                        {Number(
                          booking.amount ?? booking.price ?? 0,
                        ).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 items-start sm:items-end">
                    <span
                      className={`rounded-full px-4 py-2 text-xs font-bold ${badgeClass(booking.status)}`}
                    >
                      {normalizeStatus(booking.status).replace(/\b\w/g, (c) =>
                        c.toUpperCase(),
                      )}
                    </span>
                    <button
                      onClick={() =>
                        navigate(`/worker/bookings/${booking._id}`)
                      }
                      className="rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-all"
                    >
                      View Details
                    </button>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
                  {normalizeStatus(booking.status) === "pending" && (
                    <>
                      <button
                        onClick={() => handleAccept(booking._id)}
                        disabled={actionLoading[booking._id]}
                        className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-all disabled:opacity-60"
                      >
                        {actionLoading[booking._id] ? "Accepting..." : "Accept"}
                      </button>
                      <button
                        onClick={() => handleReject(booking._id)}
                        disabled={actionLoading[booking._id]}
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition-all disabled:opacity-60"
                      >
                        {actionLoading[booking._id]
                          ? "Processing..."
                          : "Reject"}
                      </button>
                    </>
                  )}
                  {markDoneStatuses.includes(
                    normalizeStatus(booking.status),
                  ) && (
                    <button
                      onClick={() => handleMarkDone(booking._id)}
                      disabled={actionLoading[booking._id]}
                      className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-all disabled:opacity-60"
                    >
                      {actionLoading[booking._id] ? "Updating..." : "Work Done"}
                    </button>
                  )}
                  {normalizeStatus(booking.status) === "completed" && (
                    <div className="rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
                      Completed on{" "}
                      {formatDateTime(booking.date || booking.updatedAt)}
                    </div>
                  )}
                  {normalizeStatus(booking.status) === "cancelled" && (
                    <div className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">
                      Request declined
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
