import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function WorkerSchedule() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [jobs] = useState([
    {
      id: 1,
      title: "Electrical Repair",
      customer: "Aditi Verma",
      phone: "+91 98765 43210",
      location: "Sector 45, Gurugram",
      time: "2:00 PM - 3:30 PM",
      amount: "₹500",
      status: "confirmed",
      date: new Date(2026, 3, 18),
    },
    {
      id: 2,
      title: "Home Cleaning",
      customer: "Rahul Singh",
      phone: "+91 87654 32109",
      location: "Sector 50, Gurugram",
      time: "4:00 PM - 6:00 PM",
      amount: "₹800",
      status: "pending",
      date: new Date(2026, 3, 18),
    },
    {
      id: 3,
      title: "Plumbing Repair",
      customer: "Priya Sharma",
      phone: "+91 76543 21098",
      location: "DLF Phase 2, Gurugram",
      time: "10:00 AM - 11:30 AM",
      amount: "₹600",
      status: "completed",
      date: new Date(2026, 3, 19),
    },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "completed":
        return "bg-green-100 text-green-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 pb-12">
      {/* Header */}
      <div className="relative z-40 backdrop-blur-md bg-white/80 border-b border-slate-200/50 mt-24">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/worker-dashboard")}
              className="p-2 hover:bg-slate-100 rounded-lg transition-all"
            >
              <ArrowLeft size={24} className="text-slate-600" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-slate-900">
                Work Schedule
              </h1>
              <p className="text-xs font-semibold text-slate-500">
                Manage your upcoming jobs
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg h-fit sticky top-28">
            <h3 className="text-lg font-black text-slate-900 mb-4">Calendar</h3>
            {/* Simple calendar */}
            <div className="space-y-4">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div
                  key={day}
                  className="p-2 text-center rounded-lg hover:bg-indigo-50 cursor-pointer transition-all font-semibold text-sm"
                >
                  {day}
                </div>
              ))}
            </div>
          </div>

          {/* Jobs List */}
          <div className="lg:col-span-2 space-y-4">
            {jobs.map((job, idx) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Job Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-black text-slate-900 mb-2">
                          {job.title}
                        </h3>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-bold capitalize ${getStatusColor(
                            job.status,
                          )}`}
                        >
                          {job.status}
                        </span>
                      </div>
                      <p className="text-2xl font-black text-indigo-600">
                        {job.amount}
                      </p>
                    </div>

                    {/* Details */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-slate-600">
                        <User size={18} />
                        <span className="font-semibold">{job.customer}</span>
                        <a
                          href={`tel:${job.phone}`}
                          className="text-indigo-600 hover:underline text-sm"
                        >
                          {job.phone}
                        </a>
                      </div>

                      <div className="flex items-center gap-3 text-slate-600">
                        <MapPin size={18} />
                        <span className="font-semibold">{job.location}</span>
                      </div>

                      <div className="flex items-center gap-3 text-slate-600">
                        <Clock size={18} />
                        <span className="font-semibold">{job.time}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex items-center md:items-end">
                    {job.status === "pending" && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-all"
                      >
                        Accept Job
                      </motion.button>
                    )}
                    {job.status === "confirmed" && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-all"
                      >
                        Start Work
                      </motion.button>
                    )}
                    {job.status === "completed" && (
                      <div className="flex items-center gap-2 text-green-600 font-bold">
                        <CheckCircle2 size={24} />
                        Done
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
