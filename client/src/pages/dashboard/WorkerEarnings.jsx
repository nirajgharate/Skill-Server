import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Wallet,
  TrendingUp,
  Download,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function WorkerEarnings() {
  const navigate = useNavigate();

  const [earnings] = useState({
    today: 1250,
    thisWeek: 8400,
    thisMonth: 45230,
    total: 245670,
  });

  const [transactions] = useState([
    {
      id: 1,
      date: "Apr 18, 2026",
      service: "Electrical Repair",
      customer: "Aditi Verma",
      amount: "₹500",
      status: "completed",
    },
    {
      id: 2,
      date: "Apr 17, 2026",
      service: "Home Cleaning",
      customer: "Rahul Singh",
      amount: "₹800",
      status: "completed",
    },
    {
      id: 3,
      date: "Apr 17, 2026",
      service: "Plumbing Work",
      customer: "Priya Sharma",
      amount: "₹600",
      status: "pending",
    },
    {
      id: 4,
      date: "Apr 16, 2026",
      service: "Electrical Wiring",
      customer: "Vikram Patel",
      amount: "₹750",
      status: "completed",
    },
  ]);

  const [withdrawals] = useState([
    {
      id: 1,
      date: "Apr 15, 2026",
      amount: "₹10,000",
      method: "Bank Transfer",
      status: "completed",
    },
    {
      id: 2,
      date: "Apr 10, 2026",
      amount: "₹5,000",
      method: "Google Pay",
      status: "completed",
    },
  ]);

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
              <h1 className="text-2xl font-black text-slate-900">Earnings</h1>
              <p className="text-xs font-semibold text-slate-500">
                Track your income and payments
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
        {/* Earnings Stats */}
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
                <div
                  className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white`}
                >
                  <stat.icon size={20} />
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900">
                ₹{stat.value.toLocaleString()}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Withdrawal Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-2xl p-8 shadow-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black">Available Balance</h3>
              <Wallet size={28} />
            </div>

            <p className="text-4xl font-black mb-8">₹18,570</p>

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

          {/* Transactions */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-black text-slate-900">
                  Recent Earnings
                </h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-all"
                >
                  <Download size={20} className="text-indigo-600" />
                </motion.button>
              </div>

              <div className="space-y-3">
                {transactions.map((tx, idx) => (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-all"
                  >
                    <div className="flex-1">
                      <p className="font-bold text-slate-900">{tx.service}</p>
                      <p className="text-sm text-slate-500">
                        {tx.customer} • {tx.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">{tx.amount}</p>
                      <span
                        className={`text-xs font-bold ${
                          tx.status === "completed"
                            ? "text-green-600"
                            : "text-amber-600"
                        }`}
                      >
                        {tx.status === "completed" ? "✓ Settled" : "⏳ Pending"}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Withdrawal History */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg">
          <h3 className="text-lg font-black text-slate-900 mb-4">
            Withdrawal History
          </h3>

          <div className="space-y-3">
            {withdrawals.map((wd, idx) => (
              <motion.div
                key={wd.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-all"
              >
                <div className="flex-1">
                  <p className="font-bold text-slate-900">{wd.method}</p>
                  <p className="text-sm text-slate-500">{wd.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">{wd.amount}</p>
                  <span className="text-xs font-bold text-green-600">
                    ✓ {wd.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
