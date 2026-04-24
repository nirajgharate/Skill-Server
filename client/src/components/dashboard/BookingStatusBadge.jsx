import React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Zap,
  TrendingUp,
} from "lucide-react";

export default function BookingStatusBadge({
  status = "Pending",
  size = "md",
  showLabel = true,
}) {
  // Status configuration
  const statusConfig = {
    Active: {
      icon: Zap,
      color: "from-blue-600 to-blue-700",
      bgColor: "from-blue-50 to-blue-100",
      textColor: "text-blue-700",
      badgeColor: "bg-blue-100 text-blue-700",
      label: "Active Booking",
    },
    Pending: {
      icon: Clock,
      color: "from-amber-600 to-amber-700",
      bgColor: "from-amber-50 to-amber-100",
      textColor: "text-amber-700",
      badgeColor: "bg-amber-100 text-amber-700",
      label: "Pending Confirmation",
    },
    Confirmed: {
      icon: CheckCircle2,
      color: "from-emerald-600 to-emerald-700",
      bgColor: "from-emerald-50 to-emerald-100",
      textColor: "text-emerald-700",
      badgeColor: "bg-emerald-100 text-emerald-700",
      label: "Booking Confirmed",
    },
    "In Progress": {
      icon: TrendingUp,
      color: "from-indigo-600 to-indigo-700",
      bgColor: "from-indigo-50 to-indigo-100",
      textColor: "text-indigo-700",
      badgeColor: "bg-indigo-100 text-indigo-700",
      label: "Service In Progress",
    },
    Completed: {
      icon: CheckCircle2,
      color: "from-emerald-600 to-emerald-700",
      bgColor: "from-emerald-50 to-emerald-100",
      textColor: "text-emerald-700",
      badgeColor: "bg-emerald-100 text-emerald-700",
      label: "Service Completed",
    },
    Cancelled: {
      icon: XCircle,
      color: "from-red-600 to-red-700",
      bgColor: "from-red-50 to-red-100",
      textColor: "text-red-700",
      badgeColor: "bg-red-100 text-red-700",
      label: "Booking Cancelled",
    },
    Rejected: {
      icon: AlertCircle,
      color: "from-orange-600 to-orange-700",
      bgColor: "from-orange-50 to-orange-100",
      textColor: "text-orange-700",
      badgeColor: "bg-orange-100 text-orange-700",
      label: "Booking Rejected",
    },
  };

  const config = statusConfig[status] || statusConfig["Pending"];
  const Icon = config.icon;

  // Size configuration
  const sizeConfig = {
    sm: { badge: "px-2.5 py-1", icon: 12, text: "text-xs" },
    md: { badge: "px-3.5 py-1.5", icon: 14, text: "text-sm" },
    lg: { badge: "px-5 py-2.5", icon: 18, text: "text-base" },
  };

  const sz = sizeConfig[size] || sizeConfig["md"];

  // Compact badge (minimal version)
  if (size === "sm") {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`inline-flex items-center gap-1.5 ${sz.badge} rounded-lg font-black uppercase tracking-widest whitespace-nowrap ${config.badgeColor} ${sz.text}`}
      >
        <Icon size={sz.icon} className="flex-shrink-0" />
        {status}
      </motion.div>
    );
  }

  // Full badge with details
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.02 }}
      className={`inline-flex flex-col items-start gap-2 ${sz.badge} rounded-xl bg-gradient-to-br ${config.bgColor} border-2 border-opacity-30 ${config.textColor} border-current`}
    >
      <div className="flex items-center gap-2.5">
        <motion.div
          animate={status === "In Progress" ? { rotate: [0, 360] } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="flex-shrink-0"
        >
          <Icon size={sz.icon} className="flex-shrink-0" />
        </motion.div>
        <div className="flex flex-col">
          <span className={`font-black uppercase tracking-widest ${sz.text}`}>
            {status}
          </span>
          {showLabel && (
            <span className={`text-opacity-75 font-semibold text-xs`}>
              {config.label}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
