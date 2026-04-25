import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, MapPin, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { bookingService } from "../../services/api.service";

const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatTime = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown time";
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export default function WorkerSchedule() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const next7Days = Array.from({ length: 7 }, (_, idx) => {
    const date = new Date();
    date.setDate(date.getDate() + idx);
    return date;
  });

  const loadJobs = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getWorkerBookings();
      const normalizedJobs = data.map((job) => ({
        ...job,
        date: job.date || job.createdAt,
      }));
      setJobs(normalizedJobs);
      if (normalizedJobs.length) {
        setSelectedDate(new Date(normalizedJobs[0].date));
      }
    } catch (err) {
      console.error("Error loading schedule bookings:", err);
      setError("Unable to load schedule. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const selectedDayString = selectedDate.toISOString().split("T")[0];
  const selectedJobs = jobs.filter((job) => {
    const jobDate = new Date(job.date).toISOString().split("T")[0];
    return jobDate === selectedDayString;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 pb-12">
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

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg h-fit sticky top-28">
            <h3 className="text-lg font-black text-slate-900 mb-4">Calendar</h3>
            <div className="space-y-3">
              {next7Days.map((day) => {
                const dayName = day.toLocaleDateString("en-US", {
                  weekday: "short",
                });
                const dateLabel = day.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
                const isSelected =
                  day.toISOString().split("T")[0] === selectedDayString;
                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    onClick={() => setSelectedDate(new Date(day))}
                    className={`w-full text-left p-3 rounded-2xl border transition-all ${
                      isSelected
                        ? "border-indigo-400 bg-indigo-50 text-indigo-700"
                        : "border-slate-200 bg-white text-slate-700 hover:border-indigo-200"
                    }`}
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide">
                      {dayName}
                    </p>
                    <p className="font-black text-lg">{dateLabel}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    Jobs for {formatDate(selectedDate)}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {selectedJobs.length} booking(s) scheduled
                  </p>
                </div>
                <button
                  onClick={loadJobs}
                  className="px-4 py-2 rounded-2xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-all"
                >
                  Refresh
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
                </div>
              ) : error ? (
                <div className="text-center py-16 text-sm text-red-600">
                  {error}
                </div>
              ) : selectedJobs.length === 0 ? (
                <div className="text-center py-16 text-slate-600">
                  No bookings scheduled for this date.
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedJobs.map((job, idx) => (
                    <motion.div
                      key={job._id || idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-slate-50 rounded-3xl p-6 border border-slate-200"
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-slate-700">
                            <User size={18} />
                            <span className="font-semibold">
                              {job.userId?.name || "Customer"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-700">
                            <MapPin size={18} />
                            <span>
                              {job.address || "Location not provided"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-700">
                            <Clock size={18} />
                            <span>{formatTime(job.date)}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black text-slate-900">
                            ₹{(job.amount ?? job.price ?? 0).toLocaleString()}
                          </p>
                          <span className="inline-flex mt-2 rounded-full px-3 py-1 text-xs font-semibold bg-slate-100 text-slate-700">
                            {job.status?.charAt(0).toUpperCase() +
                              job.status?.slice(1)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
