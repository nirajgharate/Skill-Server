import React from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Phone,
  MessageSquare,
  ArrowRight,
} from "lucide-react";

export default function BookingCard({
  workerName,
  service,
  date,
  time,
  status,
  image,
  location,
  amount,
  rating,
  onTrack,
  onCall,
  onMessage,
}) {
  // Status color mapping
  const getStatusStyles = (status) => {
    const statusMap = {
      Active: {
        bg: "bg-blue-50",
        text: "text-blue-700",
        badge: "bg-blue-100",
        icon: "text-blue-500",
      },
      Pending: {
        bg: "bg-amber-50",
        text: "text-amber-700",
        badge: "bg-amber-100",
        icon: "text-amber-500",
      },
      Confirmed: {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        badge: "bg-emerald-100",
        icon: "text-emerald-500",
      },
      Completed: {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        badge: "bg-emerald-100",
        icon: "text-emerald-500",
      },
      Cancelled: {
        bg: "bg-red-50",
        text: "text-red-700",
        badge: "bg-red-100",
        icon: "text-red-500",
      },
    };
    return statusMap[status] || statusMap["Pending"];
  };

  const statusStyles = getStatusStyles(status);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
      case "Confirmed":
        return <CheckCircle2 size={16} />;
      case "Pending":
        return <AlertCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -8, boxShadow: "0 30px 60px rgba(0, 0, 0, 0.08)" }}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden rounded-2xl border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 ${statusStyles.bg}`}
    >
      {/* Status indicator bar */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 ${statusStyles.text}`}
      />

      <div className="p-6 md:p-8">
        {/* Header: Worker Info + Status */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-start gap-4 flex-1">
            {/* Worker Image */}
            <div className="relative">
              <img
                src={image}
                className="w-16 h-16 rounded-xl object-cover shadow-md"
                alt={workerName}
              />
              <div
                className={`absolute -bottom-1 -right-1 p-1 rounded-lg shadow-lg bg-white ${statusStyles.icon}`}
              >
                <ShieldCheck size={14} />
              </div>
            </div>

            {/* Worker Details */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="text-lg font-black text-slate-900">
                  {workerName}
                </h4>
              </div>
              {rating && (
                <div className="flex items-center gap-1 mb-3">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={
                          i < Math.floor(rating)
                            ? "text-amber-400"
                            : "text-slate-300"
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-amber-600">
                    {rating.toFixed(1)}
                  </span>
                </div>
              )}
              <p className="text-sm font-semibold text-slate-600">{service}</p>
            </div>
          </div>

          {/* Status Badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest whitespace-nowrap flex items-center gap-1.5 ${statusStyles.badge} ${statusStyles.text}`}
          >
            {getStatusIcon(status)}
            {status}
          </motion.div>
        </div>

        {/* Booking Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-slate-300/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/40">
              <Calendar size={16} className={statusStyles.text} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">
                Date
              </p>
              <p className="text-sm font-black text-slate-900">{date}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/40">
              <Clock size={16} className={statusStyles.text} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">
                Time
              </p>
              <p className="text-sm font-black text-slate-900">{time}</p>
            </div>
          </div>

          {location && (
            <div className="flex items-center gap-3 col-span-2">
              <div className="p-2 rounded-lg bg-white/40">
                <MapPin size={16} className={statusStyles.text} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">
                  Location
                </p>
                <p className="text-sm font-bold text-slate-900 line-clamp-1">
                  {location}
                </p>
              </div>
            </div>
          )}

          {amount && (
            <div className="col-span-2 flex items-center justify-between p-3 rounded-lg bg-white/50 border border-slate-300/20">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">
                Service Amount
              </p>
              <p className="text-lg font-black text-slate-900">
                ₹{amount.toLocaleString()}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-3">
          {onTrack && (
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={onTrack}
              className={`px-4 py-3 rounded-lg font-black text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 ${statusStyles.badge} ${statusStyles.text} hover:brightness-90 transition-all shadow-md`}
            >
              <ArrowRight size={14} />
              Track
            </motion.button>
          )}

          {onCall && (
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCall}
              className="px-4 py-3 rounded-lg font-black text-xs uppercase tracking-widest bg-white text-slate-700 hover:bg-slate-100 transition-all shadow-md border border-slate-200 flex items-center justify-center gap-1.5"
            >
              <Phone size={14} />
              Call
            </motion.button>
          )}

          {onMessage && (
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={onMessage}
              className="px-4 py-3 rounded-lg font-black text-xs uppercase tracking-widest bg-white text-slate-700 hover:bg-slate-100 transition-all shadow-md border border-slate-200 flex items-center justify-center gap-1.5"
            >
              <MessageSquare size={14} />
              Chat
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
