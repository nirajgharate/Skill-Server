import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Wallet,
  TrendingUp,
  Download,
  Clock,
  CheckCircle2,
} from "lucide-react";
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

const startOfWeek = (date) => {
  const clone = new Date(date);
  const day = clone.getDay();
  clone.setDate(clone.getDate() - day + 1);
  clone.setHours(0, 0, 0, 0);
  return clone;
};

const endOfWeek = (date) => {
  const clone = new Date(date);
  const day = clone.getDay();
  clone.setDate(clone.getDate() + (7 - day));
  clone.setHours(23, 59, 59, 999);
  return clone;
};

export default function WorkerEarnings() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getWorkerBookings();
      setJobs(data.map((job) => ({ ...job, date: job.date || job.createdAt })));
    } catch (err) {
      console.error("Error loading earnings:", err);
      setError("Unable to load earnings data. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const today = new Date();
  const weekStart = startOfWeek(today);
  const weekEnd = endOfWeek(today);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);

  const normalizeStatus = (status) => String(status || "").toLowerCase();
  const completedAmounts = jobs.filter((job) => ["completed", "paid", "confirmed"].includes(normalizeStatus(job.status)));

  const earnings = {
    today: completedAmounts
      .filter((job) => {
        const date = new Date(job.date);
        return date.toISOString().split("T")[0] === today.toISOString().split("T")[0];
      })
      .reduce((sum, job) => sum + (job.amount ?? job.price ?? 0), 0),
    thisWeek: completedAmounts
      .filter((job) => {
        const date = new Date(job.date);
        return date >= weekStart && date <= weekEnd;
      })
      .reduce((sum, job) => sum + (job.amount ?? job.price ?? 0), 0),
    thisMonth: completedAmounts
      .filter((job) => {
        const date = new Date(job.date);
        return date >= monthStart && date <= monthEnd;
      })
      .reduce((sum, job) => sum + (job.amount ?? job.price ?? 0), 0),
    total: completedAmounts.reduce((sum, job) => sum + (job.amount ?? job.price ?? 0), 0),
  };

  const transactions = jobs
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6)
    .map((job, idx) => ({
      id: job._id || idx,
      date: formatDate(job.date),
      service: job.serviceId?.name || job.serviceName || "Service",
      customer: job.userId?.name || "Customer",
      amount: `₹${(job.amount ?? job.price ?? 0).toLocaleString()}`,
      status: normalizeStatus(job.status),
    }));

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
              <h1 className="text-2xl font-black text-slate-900">Earnings</h1>
              <p className="text-xs font-semibold text-slate-500">
                Track your income and payments
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              label: "Today",
              value: earnings.today,
              icon: Clock,
              color: "from-blue-500 to-blue-600",
            },
            {
              label: "This Week",
              value: earnings.thisWeek,
              icon: TrendingUp,
              color: "from-green-500 to-green-600",
            },
            {
              label: "This Month",
              value: earnings.thisMonth,
              icon: Wallet,
              color: "from-purple-500 to-purple-600",
            },
            {
              label: "Total Earned",
              value: earnings.total,
              icon: CheckCircle2,
              color: "from-amber-500 to-amber-600",
            },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  {stat.label}
                </p>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white`}>
                  <stat.icon size={20} />
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900">
                ₹{stat.value.toLocaleString()}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-2xl p-8 shadow-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black">Available Balance</h3>
              <Wallet size={28} />
            </div>
            <p className="text-4xl font-black mb-8">₹{earnings.total.toLocaleString()}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="w-full py-3 bg-white text-indigo-600 rounded-lg font-bold hover:bg-slate-100 transition-all"
            >
              Withdraw Now
            </motion.button>
            <p className="text-xs text-indigo-200 mt-4">
              Minimum withdrawal: ₹100 | Max per transaction: ₹50,000
            </p>
          </motion.div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-black text-slate-900">Recent Earnings</h3>
                <motion.button whileHover={{ scale: 1.05 }} className="p-2 hover:bg-slate-100 rounded-lg transition-all">
                  <Download size={20} className="text-indigo-600" />
                </motion.button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
                </div>
              ) : error ? (
                <div className="text-center py-16 text-sm text-red-600">{error}</div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-16 text-slate-600">No earnings transactions yet.</div>
              ) : (
                <div className="space-y-3">
                  {transactions.map((tx) => (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-all"
                    >
                      <div className="flex-1">
                        <p className="font-bold text-slate-900">{tx.service}</p>
                        <p className="text-sm text-slate-500">{tx.customer} • {tx.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900">{tx.amount}</p>
                        <span className={`text-xs font-bold ${tx.status === "completed" ? "text-green-600" : "text-amber-600"}`}>
                          {tx.status === "completed" ? "✓ Settled" : "⏳ Pending"}
                        </span>
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
