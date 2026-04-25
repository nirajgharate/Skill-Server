import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Star,
  ShieldCheck,
  Clock,
  ChevronLeft,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { bookingService, userService } from "../services/api.service";

const normalizeStatus = (status) => String(status || "").toLowerCase();

const formatDateTime = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "TBD";
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const getStepIndex = (status) => {
  switch (normalizeStatus(status)) {
    case "completed":
      return 5;
    case "in-progress":
      return 4;
    case "active":
      return 3;
    case "confirmed":
    case "accepted":
    case "paid":
      return 2;
    case "pending":
      return 1;
    default:
      return 1;
  }
};

const defaultBooking = {
  worker: {
    name: "Amit Sharma",
    role: "Master Electrician",
    rating: "4.9",
    img: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?q=80&w=400",
  },
  service: "Circuit Diagnostics",
  address: "B-402, Sunshine Heights, Andheri West",
  date: "Feb 18, 2026",
  id: "SKL-982312",
  status: "confirmed",
  phone: "",
};

const steps = [
  { title: "Booking Confirmed", desc: "We've received your request." },
  { title: "Expert Assigned", desc: "Your expert has accepted the booking." },
  { title: "En Route", desc: "Your professional is heading to your location." },
  { title: "Arrived", desc: "The expert has reached the service address." },
  { title: "Service In Progress", desc: "Work is underway at your location." },
  { title: "Completed", desc: "Service finished and verified." },
];

export default function TrackingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingState = location.state || {};

  const [booking, setBooking] = useState(bookingState.booking || null);
  const [loading, setLoading] = useState(
    !booking && Boolean(bookingState.bookingId),
  );
  const [error, setError] = useState(null);

  const activeStatuses = [
    "pending",
    "paid",
    "active",
    "accepted",
    "confirmed",
    "in-progress",
  ];

  const getBookingData = (raw) => {
    if (!raw) return defaultBooking;
    return {
      _id: raw._id || raw.id,
      service:
        raw.serviceId?.name ||
        raw.serviceName ||
        raw.service ||
        raw.serviceTitle ||
        "Service",
      worker: {
        name:
          raw.workerId?.name ||
          raw.worker?.name ||
          raw.expert ||
          "Service Professional",
        role: raw.workerId?.role || raw.worker?.role || "Service Expert",
        rating:
          raw.workerId?.rating || raw.worker?.rating || raw.rating || "4.8",
        img:
          raw.workerId?.photo ||
          raw.worker?.img ||
          raw.expertImage ||
          "https://images.pexels.com/photos/3771084/pexels-photo-3771084.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      address: raw.address || raw.location || "Location not available",
      date: raw.date || raw.createdAt || raw.bookingDate || "TBD",
      status: raw.status || raw.bookingStatus || "pending",
      phone:
        raw.workerId?.phone ||
        raw.worker?.phone ||
        raw.phone ||
        raw.contact ||
        "",
      id: raw._id || raw.id || raw.bookingCode || "SKL-000000",
    };
  };

  const loadBookingDetails = async (bookingId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await bookingService.getBookingDetails(bookingId);
      if (response?.data) {
        setBooking(response.data);
      } else {
        setError("Unable to load booking details.");
      }
    } catch (err) {
      console.error("Tracking load error:", err);
      setError("Unable to fetch booking details.");
    } finally {
      setLoading(false);
    }
  };

  const loadFallbackBooking = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await userService.getUserBookings();
      const bookingList = response?.data || response || [];
      const activeBooking = bookingList.find((item) =>
        activeStatuses.includes(normalizeStatus(item.status)),
      );
      if (activeBooking) {
        setBooking(activeBooking);
      } else if (Array.isArray(bookingList) && bookingList.length > 0) {
        setBooking(bookingList[0]);
      } else {
        setError("No booking found to track.");
      }
    } catch (err) {
      console.error("Fallback tracking error:", err);
      setError("Unable to load booking information.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bookingState.bookingId) {
      loadBookingDetails(bookingState.bookingId);
    } else if (!booking) {
      loadFallbackBooking();
    }
  }, [bookingState.bookingId]);

  const currentBooking = getBookingData(booking);
  const stepIndex = getStepIndex(currentBooking.status);
  const statusLabel = steps[stepIndex]?.title || steps[0].title;
  const etaText =
    stepIndex >= 4
      ? "Service is currently in progress."
      : stepIndex === 3
        ? "Your expert has arrived."
        : "Estimated arrival in 12 mins";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] pt-36 pb-24 px-4 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] pt-36 pb-24 px-4 flex items-center justify-center">
        <div className="max-w-lg w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-200 text-center">
          <p className="text-slate-900 text-lg font-bold mb-4">
            Unable to load tracking
          </p>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => {
              if (bookingState.bookingId)
                loadBookingDetails(bookingState.bookingId);
              else loadFallbackBooking();
            }}
            className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-semibold hover:bg-indigo-700 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const currentStatus = stepIndex;
  const bookingTitle = statusLabel;
  const bookingDescription = etaText;

  return (
    /* 🛠️ FIX: Increased pt-32 to pt-40 for desktop and added responsive padding */
    <div className="min-h-screen bg-[#FDFDFD] pt-36 md:pt-49 pb-24 px-4 relative overflow-hidden">
      {/* 1. ATMOSPHERE: Decorative Glow adjusted to stay below navbar area */}
      <div className="absolute top-20 right-[-10%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-40 left-[-10%] w-[400px] h-[400px] bg-blue-400/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-xl mx-auto space-y-8 relative z-10">
        {/* 🧭 HEADER */}
        <div className="flex items-center justify-between px-2">
          <button
            onClick={() => navigate(-1)}
            className="p-3 bg-white rounded-2xl shadow-sm border border-black/5 text-slate-400 hover:text-indigo-600 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
              Tracking ID
            </p>
            <p className="text-sm font-bold text-slate-900">
              {currentBooking.id}
            </p>
          </div>
        </div>

        {/* 🚨 LIVE STATUS HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              Live Tracking
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight">
            {bookingTitle}
          </h1>
          <p className="text-sm font-medium text-slate-400">
            {bookingDescription}
          </p>
        </motion.div>

        {/* 👤 WORKER MINI CARD */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="p-6 bg-white/80 backdrop-blur-xl border border-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={currentBooking.worker.img}
                className="w-16 h-16 rounded-2xl object-cover shadow-sm"
                alt={currentBooking.worker.name}
              />
              <div className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 text-white rounded-lg border-2 border-white">
                <ShieldCheck size={12} />
              </div>
            </div>
            <div>
              <h3 className="font-black text-slate-900 tracking-tight">
                {currentBooking.worker.name}
              </h3>
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <Star size={12} className="fill-amber-400 text-amber-400" />{" "}
                {currentBooking.worker.rating} • {currentBooking.worker.role}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <a
              href={
                currentBooking.phone ? `tel:${currentBooking.phone}` : "tel:+"
              }
              className="p-4 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100 hover:scale-105 transition-transform"
            >
              <Phone size={20} />
            </a>
            <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 transition-colors">
              <MessageSquare size={20} />
            </button>
          </div>
        </motion.div>

        {/* 📍 PROGRESS TIMELINE */}
        <div className="p-10 bg-white rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="space-y-12 relative">
            <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-slate-50" />

            {steps.map((step, i) => (
              <div key={i} className="flex gap-8 relative z-10">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                    currentStatus >= i
                      ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100"
                      : "bg-white border-2 border-slate-100 text-transparent"
                  }`}
                >
                  {currentStatus >= i && <CheckCircle2 size={16} />}
                </div>
                <div
                  className={currentStatus >= i ? "opacity-100" : "opacity-30"}
                >
                  <h4 className="text-sm font-black text-slate-900 tracking-tight uppercase">
                    {step.title}
                  </h4>
                  <p className="text-xs font-medium text-slate-400 mt-1">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 📋 BOOKING INFO SUMMARY */}
        <div className="p-8 bg-slate-900 rounded-[3rem] shadow-2xl shadow-slate-200 text-white space-y-6 relative overflow-hidden">
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-white/10 rounded-2xl text-indigo-400">
              <MapPin size={20} />
            </div>
            <p className="text-xs font-bold opacity-80 leading-relaxed tracking-tight">
              {currentBooking.address}
            </p>
          </div>
          <div className="flex items-center gap-4 pt-6 border-t border-white/5 relative z-10">
            <div className="p-3 bg-white/10 rounded-2xl text-indigo-400">
              <Clock size={20} />
            </div>
            <p className="text-xs font-bold opacity-80 uppercase tracking-widest">
              {formatDateTime(currentBooking.date)} • {currentBooking.service}
            </p>
          </div>
          {/* Subtle background glow for dark card */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
        </div>

        {/* 📞 HELP AREA */}
        <div className="text-center p-10 border-2 border-dashed border-slate-100 rounded-[3rem] bg-slate-50/30">
          <AlertCircle size={24} className="mx-auto text-slate-200 mb-4" />
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
            Need Assistance?
          </h4>
          <p className="text-[11px] font-medium text-slate-400 leading-loose">
            Contact support for rescheduling or safety queries.
            <br />
            <span className="text-indigo-600 font-black cursor-pointer underline underline-offset-4">
              Open Support Portal
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
