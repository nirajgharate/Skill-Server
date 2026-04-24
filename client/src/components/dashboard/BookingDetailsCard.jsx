import React from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  IndianRupee,
  CheckCircle2,
  AlertCircle,
  User,
  Phone,
  MessageSquare,
  FileText,
  Shield,
} from "lucide-react";

export default function BookingDetailsCard({ booking }) {
  const getStatusColor = (status) => {
    const colors = {
      Active: {
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
      "In Progress": {
        bg: "from-indigo-600 to-indigo-700",
        text: "indigo",
        badge: "bg-indigo-100 text-indigo-700",
      },
      Completed: {
        bg: "from-emerald-600 to-emerald-700",
        text: "emerald",
        badge: "bg-emerald-100 text-emerald-700",
      },
      Cancelled: {
        bg: "from-red-600 to-red-700",
        text: "red",
        badge: "bg-red-100 text-red-700",
      },
    };
    return colors[status] || colors["Pending"];
  };

  const statusColor = getStatusColor(booking?.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br ${statusColor.bg} rounded-3xl p-8 text-white shadow-2xl overflow-hidden relative`}
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />

      <div className="relative z-10">
        {/* Header Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 pb-8 border-b border-white/20">
          {/* Worker Info */}
          <div className="md:col-span-1">
            <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-4">
              Professional Expert
            </p>
            <div className="flex items-start gap-4">
              <div className="relative">
                <img
                  src={
                    booking?.workerImage ||
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=Worker"
                  }
                  alt={booking?.workerName}
                  className="w-16 h-16 rounded-xl border-2 border-white/30 shadow-lg object-cover"
                />
                <div className="absolute -bottom-2 -right-2 bg-white p-1 rounded-lg shadow-lg">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                </div>
              </div>
              <div>
                <h3 className="font-black text-lg mb-1">
                  {booking?.workerName}
                </h3>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={
                        i < Math.floor(booking?.rating || 0)
                          ? "text-amber-300"
                          : "text-white/40"
                      }
                    >
                      ★
                    </span>
                  ))}
                  <span className="text-xs font-bold ml-2">
                    {booking?.rating || 0}/5
                  </span>
                </div>
                <p className="text-xs font-semibold text-white/70">
                  Verified Professional
                </p>
              </div>
            </div>
          </div>

          {/* Service & Status */}
          <div className="md:col-span-1">
            <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-4">
              Service Information
            </p>
            <div>
              <h4 className="font-black text-lg mb-3">{booking?.service}</h4>
              <div
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/20 ${statusColor.badge}`}
              >
                {booking?.status === "Completed" ? (
                  <CheckCircle2 size={14} />
                ) : booking?.status === "Pending" ? (
                  <AlertCircle size={14} />
                ) : (
                  <Clock size={14} />
                )}
                <span className="text-xs font-black uppercase tracking-widest">
                  {booking?.status}
                </span>
              </div>
            </div>
          </div>

          {/* Amount & Payment */}
          <div className="md:col-span-1">
            <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-4">
              Payment Amount
            </p>
            <div>
              <div className="flex items-baseline gap-1 mb-3">
                <IndianRupee size={20} />
                <span className="text-3xl font-black">
                  {booking?.amount?.toLocaleString() || "0"}
                </span>
              </div>
              <p className="text-xs font-semibold text-white/70 flex items-center gap-1">
                <Shield size={12} />
                Payment Verified
              </p>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Date & Time */}
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="p-2.5 rounded-lg bg-white/20">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-white/70 text-xs font-bold uppercase tracking-tighter mb-1">
                  Booking Date
                </p>
                <p className="font-black text-sm">{booking?.date}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="p-2.5 rounded-lg bg-white/20">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-white/70 text-xs font-bold uppercase tracking-tighter mb-1">
                  Scheduled Time
                </p>
                <p className="font-black text-sm">{booking?.time}</p>
              </div>
            </div>
          </div>

          {/* Location & Reference */}
          <div className="space-y-3">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="p-2.5 rounded-lg bg-white/20 flex-shrink-0">
                <MapPin size={18} />
              </div>
              <div className="flex-1">
                <p className="text-white/70 text-xs font-bold uppercase tracking-tighter mb-1">
                  Service Location
                </p>
                <p className="font-black text-sm line-clamp-2">
                  {booking?.location}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="p-2.5 rounded-lg bg-white/20">
                <FileText size={18} />
              </div>
              <div>
                <p className="text-white/70 text-xs font-bold uppercase tracking-tighter mb-1">
                  Booking ID
                </p>
                <p className="font-black text-sm font-mono">
                  {booking?._id?.substring(0, 12)}...
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Notes */}
        {booking?.notes && (
          <div className="mb-8 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
            <p className="text-white/70 text-xs font-bold uppercase tracking-tighter mb-2">
              Additional Notes
            </p>
            <p className="text-sm font-semibold text-white/90">
              {booking?.notes}
            </p>
          </div>
        )}

        {/* Contact Information */}
        <div className="flex gap-3 mb-8">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 px-4 py-3 bg-white text-gray-900 font-black rounded-lg text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
          >
            <Phone size={14} />
            Call Professional
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 px-4 py-3 bg-white/20 text-white font-black rounded-lg text-xs uppercase tracking-widest flex items-center justify-center gap-2 border border-white/30 hover:bg-white/30 transition-all shadow-lg"
          >
            <MessageSquare size={14} />
            Send Message
          </motion.button>
        </div>

        {/* Timeline / Progress */}
        <div>
          <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-4">
            Booking Timeline
          </p>
          <div className="space-y-3">
            {[
              { label: "Booking Created", completed: true },
              {
                label: "Professional Assigned",
                completed: booking?.status !== "Pending",
              },
              {
                label: "Service In Progress",
                completed: ["In Progress", "Completed"].includes(
                  booking?.status,
                ),
              },
              {
                label: "Service Completed",
                completed: booking?.status === "Completed",
              },
            ].map((step, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${step.completed ? "bg-white" : "bg-white/30"}`}
                />
                <p
                  className={`text-xs font-semibold ${step.completed ? "text-white" : "text-white/60"}`}
                >
                  {step.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
