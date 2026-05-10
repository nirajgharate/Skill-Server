import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Phone,
  MessageSquare,
  Clock,
  Calendar,
  MapPin,
  ShieldCheck,
  FileText,
  CheckCircle2,
  Wrench,
  Map,
} from "lucide-react";
import BookingDetailsCard from "../../components/dashboard/BookingDetailsCard";
import { bookingService } from "../../services/api.service";
import { getAvatarUrl } from "../../utils/avatar.util";
import MapComponent from "../../components/MapComponent";

const parseBookingNotes = (notes) => {
  if (!notes) return null;
  if (typeof notes === "string") {
    try {
      return JSON.parse(notes);
    } catch {
      return { description: notes };
    }
  }
  if (typeof notes === "object") return notes;
  return null;
};

const formatCurrency = (value) => {
  const amount = Number(value || 0);
  return `₹${amount.toLocaleString("en-US")}`;
};

const formatBooking = (booking) => {
  if (!booking) return null;

  const parsedNotes = parseBookingNotes(booking.notes);
  const noteTime = parsedNotes?.time || parsedNotes?.scheduledTime;
  const bookingDate = booking.date ? new Date(booking.date) : null;
  const formattedDate = bookingDate
    ? bookingDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Not scheduled";

  return {
    ...booking,
    status: booking.status
      ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1)
      : "Pending",
    service: booking.serviceId?.name || booking.serviceName || "Service",
    amount: booking.amount ?? booking.serviceId?.price ?? 0,
    workerName: booking.workerId?.name || "Professional",
    workerImage: getAvatarUrl({
      profilePhoto: booking.workerId?.profilePhoto,
      name: booking.workerId?.name,
      id: booking.workerId?._id,
      fallbackSeed: "Worker",
    }),
    userName: booking.userId?.name || "You",
    noteTime,
    date: formattedDate,
    time: noteTime
      ? noteTime
      : bookingDate
        ? bookingDate.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })
        : "Not scheduled",
    location: booking.address || "Not provided",
    phone: booking.workerId?.phone || "",
    notes: parsedNotes || booking.notes,
  };
};

export default function UserBookingDetails() {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);

  const loadBooking = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getBookingDetails(bookingId);
      setBooking(formatBooking(data));
      setError(null);
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
    navigate(`/messages/${bookingId}`);
  };

  const handleMarkDone = async () => {
    setActionError(null);
    setActionLoading(true);
    try {
      await bookingService.markWorkDone(bookingId, { role: "user" });
      await loadBooking();
    } catch (err) {
      console.error("Mark work done error:", err);
      setActionError(
        err.response?.data?.message ||
          "Unable to mark work as done. Please try again.",
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

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-200 text-center">
          <p className="text-slate-900 text-lg font-bold mb-4">
            Unable to load booking
          </p>
          <p className="text-slate-600 mb-6">{error || "Booking not found."}</p>
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/user-dashboard")}
              className="p-2 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all"
            >
              <ArrowLeft size={24} className="text-slate-600" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-slate-900">
                Booking Details
              </h1>
              <p className="text-xs font-semibold text-slate-500">
                Professional booking overview and contact details.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
            <button
              onClick={handleCall}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-all"
            >
              <Phone size={16} /> Call Worker
            </button>
            <button
              onClick={() => navigate(`/messages/${bookingId}`)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition-all"
            >
              <MessageSquare size={16} /> Message
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[36px] overflow-hidden shadow-2xl border border-slate-200 bg-white"
        >
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-8 sm:px-8 sm:py-10 text-white">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="max-w-3xl">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-200/80">
                  Your booking
                </p>
                <h2 className="mt-4 text-4xl font-black tracking-tight">
                  {booking.service}
                </h2>
                <p className="mt-3 text-sm text-slate-200/90 leading-7">
                  {booking.workerName} will handle this booking. Review the
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
                  {formatCurrency(booking.amount)}
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

          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr] p-6 sm:p-8 bg-slate-50">
            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-black text-slate-900 mb-4">
                  Booking overview
                </h3>
                <BookingDetailsCard
                  booking={booking}
                  onCall={handleCall}
                  onMessage={() => navigate(`/messages/${bookingId}`)}
                />
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-black text-slate-900 mb-4">
                  Worker details
                </h3>
                <div className="space-y-4 text-slate-700">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                      Name
                    </p>
                    <p className="font-semibold text-slate-900">
                      {booking.workerName}
                    </p>
                  </div>
                  {booking.workerId?.email && (
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                        Email
                      </p>
                      <p className="font-medium text-slate-900">
                        {booking.workerId.email}
                      </p>
                    </div>
                  )}
                  {booking.workerId?.phone && (
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                        Phone
                      </p>
                      <p className="font-medium text-slate-900">
                        {booking.workerId.phone}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Map Section */}
              {(booking.userId?.location?.coordinates ||
                booking.workerId?.location?.coordinates) && (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                    <Map size={20} className="text-indigo-600" />
                    Location Map
                  </h3>
                  <div className="h-64 rounded-2xl overflow-hidden border border-slate-200">
                    <MapComponent
                      center={
                        booking.workerId?.location?.coordinates
                          ? [
                              booking.workerId.location.coordinates[0],
                              booking.workerId.location.coordinates[1],
                            ]
                          : booking.userId?.location?.coordinates
                            ? [
                                booking.userId.location.coordinates[0],
                                booking.userId.location.coordinates[1],
                              ]
                            : [77.209, 28.6139] // Default to Delhi
                      }
                      zoom={13}
                      markers={[
                        ...(booking.userId?.location?.coordinates
                          ? [
                              {
                                position: [
                                  booking.userId.location.coordinates[0],
                                  booking.userId.location.coordinates[1],
                                ],
                                title: "Your Location",
                                description: booking.userName,
                                icon: "user",
                              },
                            ]
                          : []),
                        ...(booking.workerId?.location?.coordinates
                          ? [
                              {
                                position: [
                                  booking.workerId.location.coordinates[0],
                                  booking.workerId.location.coordinates[1],
                                ],
                                title: "Worker Location",
                                description: booking.workerName,
                                icon: "worker",
                              },
                            ]
                          : []),
                      ]}
                      paths={
                        booking.userId?.location?.coordinates &&
                        booking.workerId?.location?.coordinates
                          ? [
                              {
                                positions: [
                                  [
                                    booking.userId.location.coordinates[0],
                                    booking.userId.location.coordinates[1],
                                  ],
                                  [
                                    booking.workerId.location.coordinates[0],
                                    booking.workerId.location.coordinates[1],
                                  ],
                                ],
                                color: "blue",
                                weight: 3,
                              },
                            ]
                          : []
                      }
                    />
                  </div>
                  {booking.userId?.location?.coordinates &&
                    booking.workerId?.location?.coordinates && (
                      <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                        <p className="text-sm font-semibold text-slate-700">
                          Distance:{" "}
                          {(() => {
                            const toRadians = (deg) => deg * (Math.PI / 180);
                            const [lon1, lat1] =
                              booking.userId.location.coordinates;
                            const [lon2, lat2] =
                              booking.workerId.location.coordinates;
                            const dLat = toRadians(lat2 - lat1);
                            const dLon = toRadians(lon2 - lon1);
                            const a =
                              Math.sin(dLat / 2) ** 2 +
                              Math.cos(toRadians(lat1)) *
                                Math.cos(toRadians(lat2)) *
                                Math.sin(dLon / 2) ** 2;
                            const c =
                              2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                            const distance = 6371 * c;
                            return `${distance.toFixed(1)} km`;
                          })()}
                        </p>
                      </div>
                    )}
                </div>
              )}
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
                    <Phone size={16} /> Call worker
                  </button>
                  <button
                    onClick={handleMessage}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition-all"
                  >
                    <MessageSquare size={16} /> Send message
                  </button>
                  {[
                    "pending",
                    "accepted",
                    "confirmed",
                    "active",
                    "in-progress",
                    "paid",
                  ].includes(String(booking.status || "").toLowerCase()) && (
                    <button
                      onClick={() =>
                        navigate("/tracking", {
                          state: { bookingId: booking._id, booking },
                        })
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-all"
                    >
                      <Map size={16} /> Track booking
                    </button>
                  )}

                  {/* Location Information */}
                  {(booking.userId?.location?.coordinates ||
                    booking.workerId?.location?.coordinates) && (
                    <div className="rounded-2xl bg-white border border-slate-200 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin size={16} className="text-indigo-600" />
                        <span className="text-sm font-semibold text-slate-900">
                          Location Info
                        </span>
                      </div>
                      <div className="space-y-2 text-xs text-slate-600">
                        {booking.workerId?.location?.coordinates && (
                          <div>
                            <span className="font-medium">Worker:</span>{" "}
                            {booking.workerId.location.coordinates[1].toFixed(
                              4,
                            )}
                            ,{" "}
                            {booking.workerId.location.coordinates[0].toFixed(
                              4,
                            )}
                          </div>
                        )}
                        {booking.userId?.location?.coordinates && (
                          <div>
                            <span className="font-medium">Your location:</span>{" "}
                            {booking.userId.location.coordinates[1].toFixed(4)},{" "}
                            {booking.userId.location.coordinates[0].toFixed(4)}
                          </div>
                        )}
                        {booking.userId?.location?.coordinates &&
                          booking.workerId?.location?.coordinates && (
                            <div className="pt-2 border-t border-slate-200">
                              <span className="font-semibold text-slate-900">
                                Distance:{" "}
                                {(() => {
                                  const toRadians = (deg) =>
                                    deg * (Math.PI / 180);
                                  const [lon1, lat1] =
                                    booking.userId.location.coordinates;
                                  const [lon2, lat2] =
                                    booking.workerId.location.coordinates;
                                  const dLat = toRadians(lat2 - lat1);
                                  const dLon = toRadians(lon2 - lon1);
                                  const a =
                                    Math.sin(dLat / 2) ** 2 +
                                    Math.cos(toRadians(lat1)) *
                                      Math.cos(toRadians(lat2)) *
                                      Math.sin(dLon / 2) ** 2;
                                  const c =
                                    2 *
                                    Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                                  const distance = 6371 * c;
                                  return `${distance.toFixed(1)} km`;
                                })()}
                              </span>
                            </div>
                          )}
                      </div>
                    </div>
                  )}

                  {booking.workerId?.location?.coordinates && (
                    <button
                      onClick={() =>
                        navigate("/map", {
                          state: {
                            focusWorker: booking.workerId,
                            bookingContext: booking,
                          },
                        })
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700 transition-all"
                    >
                      <MapPin size={16} /> View on Map
                    </button>
                  )}
                  {[
                    "pending",
                    "accepted",
                    "confirmed",
                    "active",
                    "in-progress",
                    "paid",
                  ].includes(String(booking.status || "").toLowerCase()) && (
                    <button
                      onClick={handleMarkDone}
                      disabled={actionLoading}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-all disabled:opacity-60"
                    >
                      <CheckCircle2 size={16} />
                      {actionLoading ? "Updating..." : "Mark Work Done"}
                    </button>
                  )}
                </div>
                {actionError && (
                  <div className="mt-4 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-700">
                    {actionError}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
