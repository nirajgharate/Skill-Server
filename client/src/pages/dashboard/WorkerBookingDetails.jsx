import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Phone, MessageSquare } from "lucide-react";
import BookingDetailsCard from "../../components/dashboard/BookingDetailsCard";
import { bookingService } from "../../services/api.service";

const formatBooking = (booking) => {
  if (!booking) return null;

  const formattedStatus = booking.status
    ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1)
    : "Pending";

  return {
    ...booking,
    status: formattedStatus,
    service: booking.serviceId?.name || booking.serviceName || "Service",
    amount: booking.amount ?? booking.price ?? 0,
    workerName: booking.workerId?.name || "Professional",
    workerImage:
      booking.workerId?.photo ||
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Worker",
    userName: booking.userId?.name || "Customer",
    date: booking.date
      ? new Date(booking.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Not scheduled",
    time: booking.date
      ? new Date(booking.date).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      : "Not scheduled",
    location: booking.address || "Not provided",
    phone: booking.userId?.phone || booking.workerId?.phone || "",
  };
};

export default function WorkerBookingDetails() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);

  const normalizeStatus = (status) => String(status || "").toLowerCase();

  const loadBooking = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getBookingDetails(bookingId);
      setBooking(formatBooking(response.data));
    } catch (err) {
      console.error("Error loading booking details:", err);
      setError("Unable to load booking details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bookingId) {
      loadBooking();
    }
  }, [bookingId]);

  const handleCall = () => {
    if (!booking?.phone) {
      window.alert("Phone number not available.");
      return;
    }
    window.open(`tel:${booking.phone}`, "_self");
  };

  const handleMessage = () => {
    if (!booking?.phone) {
      window.alert("Phone number not available.");
      return;
    }
    window.open(`sms:${booking.phone}`, "_blank");
  };

  const handleMarkDone = async () => {
    setActionError(null);
    setActionLoading(true);
    try {
      await bookingService.markWorkDone(bookingId, { role: "worker" });
      await loadBooking();
    } catch (err) {
      console.error("Mark work done error:", err);
      setActionError(
        err.response?.data?.message ||
          "Unable to mark work complete. Please try again.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-slate-300 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-200 text-center">
          <p className="text-slate-900 text-lg font-bold mb-4">
            Unable to load booking
          </p>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={loadBooking}
            className="px-5 py-3 bg-indigo-600 text-white rounded-2xl font-semibold hover:bg-indigo-700 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 pb-12">
      <div className="relative z-40 backdrop-blur-md bg-white/95 border-b border-slate-200/80 mt-24">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/worker-dashboard")}
              className="p-2 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all"
            >
              <ArrowLeft size={24} className="text-slate-600" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-slate-900">
                Booking Details
              </h1>
              <p className="text-xs font-semibold text-slate-500">
                Professional booking overview and contact options.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleCall}
              className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-all"
            >
              <Phone size={16} /> Call
            </button>
            <button
              onClick={handleMessage}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition-all"
            >
              <MessageSquare size={16} /> Message
            </button>
            {["accepted", "in-progress"].includes(
              normalizeStatus(booking.status),
            ) && (
              <button
                onClick={handleMarkDone}
                disabled={actionLoading}
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-all disabled:opacity-60"
              >
                {actionLoading ? "Updating..." : "Work Done"}
              </button>
            )}
          </div>
          {actionError && (
            <div className="mt-3 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-700">
              {actionError}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[36px] overflow-hidden shadow-2xl border border-slate-200 bg-white"
        >
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-10 text-white">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="max-w-3xl">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-200/80">
                  Worker booking
                </p>
                <h2 className="mt-4 text-4xl font-black tracking-tight">
                  {booking.service}
                </h2>
                <p className="mt-3 text-sm text-slate-200/90 leading-7">
                  {booking.userName} has requested this job. Review the
                  schedule, contact details, and booking status here.
                </p>
              </div>
              <div className="space-y-3 text-right">
                <span className="inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white">
                  {booking.status}
                </span>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-200/70">
                  Booking amount
                </p>
                <p className="text-3xl font-black text-white">
                  ₹{booking.amount.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-3xl bg-white/10 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-200/70">
                  Date
                </p>
                <p className="mt-3 text-lg font-semibold">{booking.date}</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-200/70">
                  Time
                </p>
                <p className="mt-3 text-lg font-semibold">{booking.time}</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-200/70">
                  Location
                </p>
                <p className="mt-3 text-lg font-semibold">{booking.location}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr] p-8 bg-slate-50">
            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-black text-slate-900 mb-4">
                  Booking overview
                </h3>
                <BookingDetailsCard booking={booking} />
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-black text-slate-900 mb-4">
                  Customer details
                </h3>
                <div className="space-y-4 text-slate-700">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                      Name
                    </p>
                    <p className="font-semibold text-slate-900">
                      {booking.userId?.name || booking.userName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                      Email
                    </p>
                    <p className="font-medium">
                      {booking.userId?.email || booking.email || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                      Phone
                    </p>
                    <p className="font-medium">
                      {booking.phone || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-black text-slate-900 mb-4">
                  Booking reference
                </h3>
                <div className="space-y-4 text-slate-700">
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                      Reference
                    </p>
                    <p className="font-semibold text-slate-900">
                      {booking._id?.substring(0, 14)}
                    </p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                      Status
                    </p>
                    <p className="font-semibold text-slate-900">
                      {booking.status}
                    </p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                      Payment method
                    </p>
                    <p className="font-semibold text-slate-900">
                      {booking.paymentMethod || "Not available"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <h3 className="text-xl font-black text-slate-900 mb-4">
                  Support actions
                </h3>
                <div className="grid gap-3">
                  <button
                    onClick={handleCall}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-all"
                  >
                    <Phone size={16} /> Call customer
                  </button>
                  <button
                    onClick={handleMessage}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition-all"
                  >
                    <MessageSquare size={16} /> Send message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
