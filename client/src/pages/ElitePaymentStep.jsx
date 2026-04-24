import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Loader2,
  AlertCircle,
  Clock,
  MapPin,
  CreditCard,
  ShieldCheck,
} from "lucide-react";

import API from "../api/api";

export default function ElitePaymentStep({
  onComplete,
  totalAmount = 499,
  bookingData = {},
}) {
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const [showBookingDetails, setShowBookingDetails] = useState(true);

  const handleConfirmBooking = async () => {
    // Validate booking data before triggering the mock flow
    if (!bookingData || !bookingData.date || !bookingData.address) {
      setMessage("Please complete all booking details (date & address).");
      return;
    }

    setMessage("");
    setIsProcessing(true);

    if (!bookingData.serviceId && !bookingData.workerId) {
      setMessage("Unable to create booking: missing worker or service ID.");
      setIsProcessing(false);
      return;
    }

    try {
      // Create a pending booking first
      const createResponse = await API.post("/bookings", {
        serviceId: bookingData.serviceId,
        workerId: bookingData.workerId,
        price: bookingData.amount,
        serviceName: bookingData.serviceName,
        date: bookingData.date,
        address: bookingData.address,
        notes: bookingData.notes || {},
      });

      const pendingBooking = createResponse.data?.data;
      if (!pendingBooking) {
        throw new Error("Booking creation failed");
      }

      // Simulate payment and activate booking
      const payResponse = await API.post(
        `/bookings/mock-pay/${pendingBooking._id}`,
      );

      const activatedBooking = payResponse.data?.data;
      setIsSuccess(true);
      setMessage("✅ Booking Successful! Redirecting to your dashboard...");

      if (onComplete) {
        onComplete(activatedBooking || pendingBooking);
      }

      setTimeout(() => {
        navigate("/dashboard");
      }, 1200);
    } catch (error) {
      console.error("Error creating booking:", error);
      const errorMsg =
        error.response?.data?.message ||
        "Failed to create booking. Please try again.";
      setMessage(errorMsg);
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-1">
      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.div
            key="payment-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
          >
            {/* BOOKING SUMMARY CARD */}
            {showBookingDetails && bookingData && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-gradient-to-br from-[#4F46E5]/5 to-[#4F46E5]/10 border border-[#4F46E5]/20 rounded-3xl p-6 space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xs font-black text-[#4F46E5] uppercase tracking-widest mb-2">
                      Booking Summary
                    </h3>
                    <p className="text-lg font-black text-[#0F172A]">
                      {bookingData.serviceName || "Professional Service"}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowBookingDetails(false)}
                    className="text-[#0F172A]/40 hover:text-[#0F172A] transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3 text-xs font-bold">
                  <div className="flex items-center gap-3">
                    <Clock size={16} className="text-[#4F46E5] flex-shrink-0" />
                    <span className="text-[#0F172A]">{bookingData.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin
                      size={16}
                      className="text-[#4F46E5] flex-shrink-0"
                    />
                    <span className="text-[#0F172A] line-clamp-2">
                      {bookingData.address}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* PAYMENT INFO SECTION - DISPLAY ONLY */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-6 border border-indigo-200 space-y-4"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck size={20} className="text-[#4F46E5]" />
                <h3 className="text-sm font-black text-[#0F172A] uppercase tracking-wider">
                  Booking Details
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-indigo-100">
                  <span className="text-xs font-bold text-gray-600">
                    Service Amount
                  </span>
                  <span className="text-sm font-black text-[#4F46E5]">
                    ₹{totalAmount}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-indigo-100">
                  <span className="text-xs font-bold text-gray-600">
                    Booking Status
                  </span>
                  <span className="text-xs font-black text-amber-600 bg-amber-50 px-2 py-1 rounded">
                    CONFIRMED ON SAVE
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-600 pt-2">
                <ShieldCheck size={14} />
                Booking will be recorded immediately without payment.
              </div>
            </motion.div>

            {/* MESSAGE */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl text-sm font-bold flex items-start gap-3 ${
                  message.includes("error") || message.includes("failed")
                    ? "bg-rose-50 border border-rose-200 text-rose-700"
                    : "bg-blue-50 border border-blue-200 text-blue-700"
                }`}
              >
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                <span>{message}</span>
              </motion.div>
            )}

            {/* CONFIRM BUTTON */}
            <button
              disabled={isProcessing}
              onClick={handleConfirmBooking}
              className="w-full py-6 bg-[#4F46E5] hover:bg-[#4F46E5]/90 disabled:bg-[#4F46E5]/50 text-white font-black uppercase rounded-3xl shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Confirming Booking...
                </>
              ) : (
                <>
                  <CheckCircle2 size={20} />
                  Confirm & Create Booking
                </>
              )}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-20 text-center space-y-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-200"
            >
              <CheckCircle2 size={48} className="text-white" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-3"
            >
              <h2 className="text-4xl font-black text-[#0F172A]">
                Booking Confirmed!
              </h2>
              <p className="text-sm font-bold text-[#0F172A]/50 uppercase tracking-widest">
                Your booking has been successfully created.
              </p>
              <p className="text-xs text-[#0F172A]/40 font-medium">
                Redirecting to booking details...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
