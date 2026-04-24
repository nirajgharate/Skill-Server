import React from "react";
import {
  MapPin,
  MessageSquare,
  Navigation,
  Phone,
  Calendar,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Zap,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function ProfileBookings() {
  const navigate = useNavigate();

  // Sample active booking data - replace with real data from API
  const activeBooking = {
    workerName: "Arjun (Pro Electrician)",
    workerId: "12345",
    status: "In Progress",
    statusColor: "blue",
    serviceType: "Electrical Wiring",
    amount: 3500,
    date: "April 23, 2026",
    time: "10:00 AM - 12:00 PM",
    location: "Bandra West, Mumbai",
    workerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Worker",
    rating: 4.8,
    reviews: 245,
    eta: "12 mins",
    status_stage: 2,
    total_stages: 4,
  };

  const getStatusColor = (status) => {
    const colors = {
      "In Progress": {
        bg: "from-blue-600 to-blue-700",
        text: "blue",
        badge: "bg-blue-100 text-blue-700",
      },
      Confirmed: {
        bg: "from-emerald-600 to-emerald-700",
        text: "emerald",
        badge: "bg-emerald-100 text-emerald-700",
      },
      Pending: {
        bg: "from-amber-600 to-amber-700",
        text: "amber",
        badge: "bg-amber-100 text-amber-700",
      },
    };
    return colors[status] || colors["Pending"];
  };

  const colors = getStatusColor(activeBooking.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between px-2 mb-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">
          Your Active Booking
        </h3>
        <motion.button
          whileHover={{ x: 4 }}
          onClick={() => navigate("/dashboard")}
          className="text-[10px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest flex items-center gap-1.5"
        >
          View All <ChevronRight size={14} />
        </motion.button>
      </div>

      {/* Main Booking Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-br ${colors.bg} rounded-3xl p-8 text-white shadow-2xl shadow-${colors.text}-500/20 relative overflow-hidden`}
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16" />

        <div className="relative z-10">
          {/* Worker Header */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-start gap-4">
              <div className="relative">
                <img
                  src={activeBooking.workerImage}
                  className="w-16 h-16 bg-white/20 rounded-2xl border-2 border-white/30 shadow-lg"
                  alt={activeBooking.workerName}
                />
                <div className="absolute -bottom-2 -right-2 bg-white p-1 rounded-lg shadow-lg">
                  <CheckCircle2
                    size={18}
                    className={`text-${colors.text}-600`}
                  />
                </div>
              </div>
              <div>
                <h4 className="font-black text-white text-lg mb-1">
                  {activeBooking.workerName}
                </h4>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-amber-300">
                      ★
                    </span>
                  ))}
                  <span className="text-white/80 font-bold text-xs ml-1">
                    {activeBooking.rating} ({activeBooking.reviews} reviews)
                  </span>
                </div>
                <p className="text-white/80 text-xs font-bold uppercase tracking-widest">
                  ETA: {activeBooking.eta}
                </p>
              </div>
            </div>

            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30"
            >
              <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-1">
                Status
              </p>
              <p className="text-white font-black text-sm">
                {activeBooking.status}
              </p>
            </motion.div>
          </div>

          {/* Service Details Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-white/20">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm">
                <Zap size={18} className="text-white" />
              </div>
              <div>
                <p className="text-white/70 text-xs font-bold uppercase tracking-tighter mb-1">
                  Service
                </p>
                <p className="text-white font-black">
                  {activeBooking.serviceType}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm">
                <Clock size={18} className="text-white" />
              </div>
              <div>
                <p className="text-white/70 text-xs font-bold uppercase tracking-tighter mb-1">
                  Scheduled
                </p>
                <p className="text-white font-black">{activeBooking.time}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 col-span-2">
              <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm">
                <MapPin size={18} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white/70 text-xs font-bold uppercase tracking-tighter mb-1">
                  Location
                </p>
                <p className="text-white font-black">
                  {activeBooking.location}
                </p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <p className="text-white/80 text-xs font-bold uppercase tracking-widest">
                Service Progress
              </p>
              <p className="text-white font-black text-sm">
                Stage {activeBooking.status_stage} of{" "}
                {activeBooking.total_stages}
              </p>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${(activeBooking.status_stage / activeBooking.total_stages) * 100}%`,
                }}
                transition={{ duration: 1.2, delay: 0.3 }}
                className="h-full bg-white rounded-full shadow-lg"
              />
            </div>
          </div>

          {/* Amount Display */}
          <div className="mb-8 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">
              Service Amount
            </p>
            <p className="text-white font-black text-2xl">
              ₹{activeBooking.amount.toLocaleString()}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {}}
              className="flex-1 px-6 py-3 bg-white text-blue-700 font-black text-sm uppercase tracking-widest rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Navigation size={16} />
              Track Live
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-white/20 backdrop-blur-sm text-white rounded-xl border border-white/30 hover:bg-white/30 transition-all"
            >
              <Phone size={18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-white/20 backdrop-blur-sm text-white rounded-xl border border-white/30 hover:bg-white/30 transition-all"
            >
              <MessageSquare size={18} />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Booking Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-3"
      >
        <div className="bg-white/50 backdrop-blur-sm border border-slate-200 rounded-xl p-4 text-center">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter mb-2">
            Date
          </p>
          <p className="text-sm font-black text-slate-900">
            {activeBooking.date}
          </p>
        </div>
        <div className="bg-white/50 backdrop-blur-sm border border-slate-200 rounded-xl p-4 text-center">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter mb-2">
            Payment Status
          </p>
          <p className="text-sm font-black text-emerald-600">Confirmed</p>
        </div>
        <div className="bg-white/50 backdrop-blur-sm border border-slate-200 rounded-xl p-4 text-center">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter mb-2">
            Time Left
          </p>
          <p className="text-sm font-black text-amber-600">
            {activeBooking.eta}
          </p>
        </div>
      </motion.div>

      {/* Quick Action to View All Bookings */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate("/dashboard")}
        className="w-full p-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all uppercase tracking-widest text-sm"
      >
        <Calendar size={18} />
        View All Bookings
      </motion.button>
    </div>
  );
}
