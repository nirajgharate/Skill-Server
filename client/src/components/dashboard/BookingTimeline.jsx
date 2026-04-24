import React from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Zap,
  MapPin,
  DollarSign,
  User,
  Navigation,
} from "lucide-react";

export default function BookingTimeline({ booking, status = "In Progress" }) {
  // Define timeline steps based on booking status
  const timelineSteps = [
    {
      step: 1,
      label: "Booking Confirmed",
      description: "Your booking has been created",
      icon: Calendar,
      completed: true,
      active:
        status === "Pending" ||
        status === "Confirmed" ||
        status === "In Progress" ||
        status === "Completed",
      timestamp: booking?.createdAt,
    },
    {
      step: 2,
      label: "Professional Assigned",
      description: "Expert professional has been assigned",
      icon: User,
      completed: status !== "Pending" && status !== "Cancelled",
      active:
        status === "Confirmed" ||
        status === "In Progress" ||
        status === "Completed",
      timestamp: booking?.workerAcceptedAt,
    },
    {
      step: 3,
      label: "Service In Progress",
      description: "Professional is working on your service",
      icon: Zap,
      completed: status === "Completed",
      active: status === "In Progress" || status === "Completed",
      timestamp: booking?.startedAt,
    },
    {
      step: 4,
      label: "Service Completed",
      description: "Service has been completed",
      icon: CheckCircle2,
      completed: status === "Completed",
      active: status === "Completed",
      timestamp: booking?.completedAt,
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-lg">
      <div className="mb-8">
        <h3 className="text-2xl font-black text-slate-900 mb-2">
          Booking Progress
        </h3>
        <p className="text-slate-600 font-semibold">
          Track your booking through each stage
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line connecting steps */}
        <div className="absolute left-6 top-12 bottom-0 w-1 bg-gradient-to-b from-slate-300 via-slate-300 to-slate-200" />

        {/* Timeline Steps */}
        <div className="space-y-8">
          {timelineSteps.map((item, idx) => {
            const Icon = item.icon;
            const isLast = idx === timelineSteps.length - 1;

            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative"
              >
                {/* Step Indicator */}
                <div className="flex items-start gap-6">
                  {/* Icon Circle */}
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: idx * 0.1 + 0.1 }}
                    className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-black text-sm border-4 border-white transition-all ${
                      item.completed
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200"
                        : item.active
                          ? "bg-indigo-500 text-white shadow-lg shadow-indigo-200 animate-pulse"
                          : "bg-slate-200 text-slate-600 shadow-lg shadow-slate-100"
                    }`}
                  >
                    <Icon size={20} />
                  </motion.div>

                  {/* Content */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.1 + 0.15 }}
                    className={`flex-1 py-2 px-4 rounded-xl border-2 ${
                      item.completed
                        ? "bg-emerald-50 border-emerald-200"
                        : item.active
                          ? "bg-indigo-50 border-indigo-200"
                          : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4
                          className={`font-black text-lg mb-1 ${
                            item.completed
                              ? "text-emerald-900"
                              : item.active
                                ? "text-indigo-900"
                                : "text-slate-600"
                          }`}
                        >
                          {item.label}
                        </h4>
                        <p
                          className={`text-sm font-semibold ${
                            item.completed
                              ? "text-emerald-700"
                              : item.active
                                ? "text-indigo-700"
                                : "text-slate-500"
                          }`}
                        >
                          {item.description}
                        </p>
                      </div>

                      {/* Status Badge */}
                      <div className="flex-shrink-0">
                        {item.completed ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-black uppercase tracking-widest whitespace-nowrap"
                          >
                            ✓ Completed
                          </motion.div>
                        ) : item.active ? (
                          <div className="px-3 py-1.5 rounded-lg bg-indigo-100 text-indigo-700 text-xs font-black uppercase tracking-widest whitespace-nowrap flex items-center gap-1.5">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 2 }}
                              className="w-2 h-2 rounded-full bg-indigo-600"
                            />
                            In Progress
                          </div>
                        ) : (
                          <div className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-black uppercase tracking-widest whitespace-nowrap">
                            Pending
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Completion Message */}
      {status === "Completed" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-6 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <CheckCircle2 size={24} className="text-emerald-600" />
            <p className="text-lg font-black text-emerald-900">
              Service Completed Successfully!
            </p>
          </div>
          <p className="text-slate-700 font-semibold text-sm">
            Thank you for using our service. We appreciate your business!
          </p>
        </motion.div>
      )}
    </div>
  );
}
