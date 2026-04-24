import React from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  CheckCircle2,
  Clock,
  TrendingUp,
  Wallet,
  AlertCircle,
} from "lucide-react";

export default function BookingSummaryStats({ bookings }) {
  const stats = [
    {
      label: "Total Bookings",
      value: bookings?.length || 0,
      icon: Calendar,
      color: "from-blue-600 to-blue-700",
      bgColor: "from-blue-50 to-blue-100/50",
    },
    {
      label: "Active Bookings",
      value:
        bookings?.filter((b) =>
          ["Active", "Confirmed", "In Progress"].includes(b.status),
        )?.length || 0,
      icon: Clock,
      color: "from-indigo-600 to-indigo-700",
      bgColor: "from-indigo-50 to-indigo-100/50",
    },
    {
      label: "Completed",
      value: bookings?.filter((b) => b.status === "Completed")?.length || 0,
      icon: CheckCircle2,
      color: "from-emerald-600 to-emerald-700",
      bgColor: "from-emerald-50 to-emerald-100/50",
    },
    {
      label: "Total Spent",
      value: `₹${(bookings?.reduce((sum, b) => sum + (b.amount || 0), 0) || 0).toLocaleString()}`,
      icon: Wallet,
      color: "from-purple-600 to-purple-700",
      bgColor: "from-purple-50 to-purple-100/50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)" }}
            className={`bg-gradient-to-br ${stat.bgColor} rounded-2xl p-6 border border-slate-200 shadow-lg hover:shadow-2xl transition-all cursor-default group`}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} group-hover:scale-110 transition-transform`}
              >
                <Icon size={20} className="text-white" />
              </div>
            </div>

            <p className="text-slate-600 text-xs font-bold uppercase tracking-widest mb-2">
              {stat.label}
            </p>

            <p className="text-3xl font-black text-slate-900 mb-1">
              {stat.value}
            </p>

            <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
              <TrendingUp size={12} />
              <span>Updated today</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
