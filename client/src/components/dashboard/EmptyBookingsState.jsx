import React from "react";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EmptyBookingsState() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-[400px] flex items-center justify-center"
    >
      <div className="w-full max-w-md text-center px-6">
        {/* Illustration */}
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="mb-8"
        >
          <div className="inline-block p-8 rounded-3xl bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200">
            <Calendar size={64} className="text-indigo-600" strokeWidth={1.5} />
          </div>
        </motion.div>

        {/* Content */}
        <h3 className="text-3xl font-black text-slate-900 mb-4">
          No Bookings Yet
        </h3>

        <p className="text-lg text-slate-600 font-semibold mb-3">
          You haven't made any bookings yet. Start exploring our professional
          services today!
        </p>

        <p className="text-slate-500 font-medium mb-8">
          Browse from thousands of verified professionals ready to help with
          your service needs.
        </p>

        {/* Feature List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 mb-8 border border-slate-200"
        >
          <h4 className="font-black text-slate-900 text-sm uppercase tracking-widest mb-4">
            Why Book With Us?
          </h4>
          <div className="space-y-3 text-left">
            {[
              { icon: "✓", text: "Verified Professional Experts" },
              { icon: "✓", text: "Transparent Pricing" },
              { icon: "✓", text: "24/7 Customer Support" },
              { icon: "✓", text: "Quality Guaranteed" },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                className="flex items-center gap-3 text-sm font-semibold text-slate-700"
              >
                <span className="text-emerald-600 font-black text-lg">
                  {item.icon}
                </span>
                {item.text}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.05, y: -4 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/services")}
          className="w-full px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-black text-lg rounded-2xl shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 transition-all flex items-center justify-center gap-3 uppercase tracking-widest"
        >
          <Zap size={20} />
          Explore Services
          <ArrowRight size={20} />
        </motion.button>

        {/* Secondary CTA */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-4 px-8 py-3 bg-slate-100 text-slate-700 font-black rounded-xl hover:bg-slate-200 transition-all uppercase tracking-widest text-sm"
        >
          Browse Categories
        </motion.button>

        {/* Help Text */}
        <p className="text-xs text-slate-500 font-medium mt-6">
          Questions? Check out our{" "}
          <span className="text-indigo-600 cursor-pointer hover:underline">
            FAQ
          </span>{" "}
          or{" "}
          <span className="text-indigo-600 cursor-pointer hover:underline">
            contact support
          </span>
        </p>
      </div>
    </motion.div>
  );
}
