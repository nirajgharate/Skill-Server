import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  MapPin,
  User,
  Phone,
  AlertCircle,
  Loader2,
  Copy,
  Check,
} from "lucide-react";

export default function ConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [userMarkDone, setUserMarkDone] = useState(false);
  const [workerMarkDone, setWorkerMarkDone] = useState(false);
  const [marking, setMarking] = useState(false);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  // Get booking data from state
  const { bookingId, bookingData } = location.state || {};
  const booking = bookingData || {};
  const bookingIdentifier = booking._id || bookingId || "--";
  const bookingStatus = String(
    booking.status || booking.bookingStatus || "pending",
  ).toLowerCase();
  const isPending = ["pending", "created", "cod_pending"].includes(
    bookingStatus,
  );
  const isAccepted = [
    "accepted",
    "confirmed",
    "paid",
    "active",
    "in-progress",
  ].includes(bookingStatus);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!bookingId && !bookingData) {
      navigate("/dashboard", { replace: true });
      return;
    }

    const timer = setTimeout(() => {
      navigate("/dashboard", { replace: true });
    }, 5000);

    return () => clearTimeout(timer);
  }, [bookingData, bookingId, navigate]);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleMarkDone = async () => {
    try {
      setMarking(true);
      const currentUser = JSON.parse(
        localStorage.getItem("skillserverUser") || "{}",
      );
      const role = currentUser.role || "user";

      if (role === "user") {
        setUserMarkDone(true);
      } else {
        setWorkerMarkDone(true);
      }

      setError("");
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to mark work done");
    } finally {
      setMarking(false);
    }
  };

  const isCompleted = userMarkDone && workerMarkDone;
  const bookingInfo = booking || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pt-32 pb-24 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* SUCCESS HEADER */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 12 }}
            className="w-20 h-20 bg-emerald-500 rounded-full shadow-2xl flex items-center justify-center mx-auto text-white"
          >
            <CheckCircle2 size={40} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <h1 className="text-3xl font-black text-[#0F172A]">
              Booking Confirmed
            </h1>
            <p className="text-sm font-bold text-gray-600">
              Booking ID:{" "}
              <span className="text-blue-600">
                {String(bookingIdentifier).substring(0, 8)}...
              </span>
            </p>
          </motion.div>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 text-sm"
          >
            <AlertCircle size={18} />
            <span className="font-medium">{error}</span>
          </motion.div>
        )}

        {/* BOOKING DETAILS CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-6 shadow-lg space-y-6"
        >
          {/* Worker & Service Info */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">
                    Worker
                  </p>
                  <p className="text-lg font-bold text-[#0F172A]">
                    {bookingInfo.workerId?.name || "Professional"}
                  </p>
                </div>
              </div>
              {bookingInfo.workerId?.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-blue-600" />
                  <span className="text-sm font-bold">
                    {bookingInfo.workerId.phone}
                  </span>
                </div>
              )}
            </div>

            {/* Service & Date Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-500 uppercase">
                  Service
                </p>
                <p className="font-bold text-[#0F172A]">
                  {bookingInfo.serviceId?.name || "Service"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-500 uppercase">
                  Date
                </p>
                <p className="font-bold text-[#0F172A]">
                  {new Date(bookingInfo.date).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Address */}
            <div className="pt-4 border-t border-gray-100 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase">
                <MapPin size={14} /> Address
              </div>
              <p className="text-sm text-[#0F172A]">{bookingInfo.address}</p>
            </div>
          </div>
        </motion.div>

        {/* PAYMENT INFO */}
        {bookingInfo.transactionId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 space-y-3"
          >
            <h3 className="font-bold text-[#0F172A] uppercase text-xs">
              Transaction Details
            </h3>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-100">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase">
                  Transaction ID
                </p>
                <p className="font-mono font-bold text-sm">
                  {bookingInfo.transactionId}
                </p>
              </div>
              <button
                onClick={() => handleCopy(bookingInfo.transactionId, "txn")}
                className="p-2 hover:bg-green-100 rounded-lg transition-colors"
              >
                {copiedId === "txn" ? (
                  <Check size={16} className="text-green-600" />
                ) : (
                  <Copy size={16} className="text-green-600" />
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* WORKER STATUS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200 space-y-4"
        >
          <h3 className="font-bold text-[#0F172A] uppercase text-xs">
            Worker Status
          </h3>

          {isPending && (
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <Clock size={18} className="text-yellow-600 flex-shrink-0" />
              <p className="text-sm font-bold text-yellow-700">
                Waiting for worker to accept...
              </p>
            </div>
          )}

          {isAccepted && (
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle2
                size={18}
                className="text-green-600 flex-shrink-0"
              />
              <div>
                <p className="text-sm font-bold text-green-700">
                  Worker Accepted
                </p>
                {bookingInfo.workerAcceptedAt && (
                  <p className="text-xs text-green-600">
                    Accepted:{" "}
                    {new Date(
                      bookingInfo.workerAcceptedAt,
                    ).toLocaleTimeString()}
                  </p>
                )}
              </div>
            </div>
          )}

          {isCompleted && (
            <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
              <CheckCircle2
                size={18}
                className="text-emerald-600 flex-shrink-0"
              />
              <p className="text-sm font-bold text-emerald-700">
                Work Completed
              </p>
            </div>
          )}
        </motion.div>

        {/* WORK COMPLETION SECTION */}
        {isAccepted && !isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl p-6 border border-gray-200 space-y-4"
          >
            <h3 className="font-bold text-[#0F172A] uppercase text-xs">
              Mark Work Complete
            </h3>

            <div className="space-y-3">
              {/* User Mark Done */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <p className="font-bold text-[#0F172A] text-sm">
                    User Marked Done
                  </p>
                  <p className="text-xs text-gray-600">
                    Mark work as complete on your end
                  </p>
                </div>
                {userMarkDone ? (
                  <CheckCircle2 size={24} className="text-green-600" />
                ) : (
                  <button
                    onClick={handleMarkDone}
                    disabled={marking}
                    className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
                  >
                    {marking ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      "Mark Done"
                    )}
                  </button>
                )}
              </div>

              {/* Worker Mark Done */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <p className="font-bold text-[#0F172A] text-sm">
                    Worker Marked Done
                  </p>
                  <p className="text-xs text-gray-600">
                    Waiting for worker confirmation
                  </p>
                </div>
                {workerMarkDone ? (
                  <CheckCircle2 size={24} className="text-green-600" />
                ) : (
                  <Clock size={24} className="text-yellow-600" />
                )}
              </div>

              {/* Completion Status */}
              {userMarkDone && workerMarkDone && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg"
                >
                  <p className="text-sm font-bold text-emerald-700">
                    ✓ Work Completed Successfully
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* ACTION BUTTONS */}
        {!isCompleted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex gap-3"
          >
            <button
              onClick={() => navigate(-1)}
              className="flex-1 py-3 bg-gray-100 text-[#0F172A] font-bold rounded-lg hover:bg-gray-200 transition-all"
            >
              Go Back
            </button>
            <button
              onClick={() => navigate("/my-bookings")}
              className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all"
            >
              View Bookings
            </button>
          </motion.div>
        )}

        {isCompleted && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => navigate("/")}
            className="w-full py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all text-lg"
          >
            Back to Home
          </motion.button>
        )}
      </div>
    </div>
  );
}
