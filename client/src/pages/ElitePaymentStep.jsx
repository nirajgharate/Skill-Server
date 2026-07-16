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
import { paymentService } from "../services/api.service";

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
  const [paymentMethod, setPaymentMethod] = useState("upi");

  const paymentOptions = [
    {
      id: "upi",
      title: "UPI Payment",
      subtitle: "Fast and secure payment using UPI apps.",
    },
    {
      id: "card",
      title: "Card Payment",
      subtitle: "Use debit or credit card for instant checkout.",
    },
    {
      id: "cash",
      title: "Cash on Delivery",
      subtitle: "Pay the worker in cash after the service is complete.",
    },
  ];

  const handleConfirmBooking = async () => {
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
      const createResponse = await API.post("/bookings", {
        serviceId: bookingData.serviceId,
        workerId: bookingData.workerId,
        category: bookingData.category,
        paymentMethod,
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

      const bookingPayload = {
        ...pendingBooking,
        bookingId: pendingBooking._id,
        paymentMethod,
      };

      if (paymentMethod === "cash") {
        try {
          await paymentService.createOrder({
            bookingId: pendingBooking._id,
            amount:
              pendingBooking.amount ||
              pendingBooking.price ||
              bookingData.amount,
            method: "cash",
            notes: bookingData.notes || {},
          });
        } catch (payError) {
          console.warn("COD order record failed:", payError);
        }

        setIsSuccess(true);
        setMessage(
          "✅ Booking confirmed. Cash on Delivery selected. Your booking is saved and visible in My Bookings.",
        );

        if (onComplete) {
          onComplete(bookingPayload);
        }

        setTimeout(() => {
          navigate("/confirmation", {
            state: {
              bookingId: pendingBooking._id,
              bookingData: bookingPayload,
            },
          });
        }, 1200);
        return;
      }

      let orderData = null;
      try {
        orderData = await paymentService.createOrder({
          bookingId: pendingBooking._id,
          amount: bookingData.amount,
          method: paymentMethod,
          notes: bookingData.notes || {},
        });
      } catch (paymentOrderError) {
        console.error("Payment order creation failed:", paymentOrderError);
        setIsSuccess(true);
        setMessage(
          "✅ Booking created. Payment order could not be started. Your booking is still saved. Check My Bookings to complete payment later.",
        );
        if (onComplete) {
          onComplete(bookingPayload);
        }
        setTimeout(() => {
          navigate("/confirmation", {
            state: {
              bookingId: pendingBooking._id,
              bookingData: bookingPayload,
            },
          });
        }, 1200);
        return;
      }

      const loadRazorpayScript = () =>
        new Promise((resolve, reject) => {
          if (window.Razorpay) return resolve(true);
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve(true);
          script.onerror = () =>
            reject(new Error("Unable to load Razorpay checkout."));
          document.body.appendChild(script);
        });

      const launchRazorpay = async () => {
        await loadRazorpayScript();

        const options = {
          key: orderData.key,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "SkillServer",
          description: bookingData.serviceName || "Service Payment",
          order_id: orderData.orderId,
          handler: async (response) => {
            try {
              const verifyResponse = await paymentService.verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingId: pendingBooking._id,
                method: paymentMethod,
              });

              setIsSuccess(true);
              setMessage(
                "✅ Booking confirmed and payment completed successfully. Redirecting to your bookings...",
              );

              if (onComplete) {
                onComplete({ ...bookingPayload, ...verifyResponse });
              }

              setTimeout(() => {
                navigate("/confirmation", {
                  state: {
                    bookingId: pendingBooking._id,
                    bookingData: { ...bookingPayload, ...verifyResponse },
                  },
                });
              }, 1400);
            } catch (verifyError) {
              console.error("Payment verification error:", verifyError);
              setIsSuccess(true);
              setMessage(
                "✅ Booking confirmed. Payment completed but verification failed. Check My Bookings for details.",
              );
              setTimeout(() => {
                navigate("/confirmation", {
                  state: {
                    bookingId: pendingBooking._id,
                    bookingData: bookingPayload,
                  },
                });
              }, 1400);
            }
          },
          modal: {
            ondismiss: () => {
              setIsSuccess(true);
              setMessage(
                "✅ Booking confirmed. Payment was not completed. Complete the payment later from My Bookings.",
              );
              setTimeout(() => {
                navigate("/confirmation", {
                  state: {
                    bookingId: pendingBooking._id,
                    bookingData: bookingPayload,
                  },
                });
              }, 1200);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      };

      if (!orderData || !orderData.orderId) {
        setIsSuccess(true);
        setMessage(
          "✅ Booking created. Payment order could not be started, but your booking is still saved. Check My Bookings.",
        );
        if (onComplete) {
          onComplete(bookingPayload);
        }
        setTimeout(() => {
          navigate("/confirmation", {
            state: {
              bookingId: pendingBooking._id,
              bookingData: bookingPayload,
            },
          });
        }, 1200);
        return;
      }

      try {
        await launchRazorpay();
      } catch (launchError) {
        console.error("Razorpay launch failed:", launchError);
        setIsSuccess(true);
        setMessage(
          "✅ Booking created. Payment checkout could not be started. Your booking is still saved. Check My Bookings to complete payment later.",
        );
        if (onComplete) {
          onComplete(bookingPayload);
        }
        setTimeout(() => {
          navigate("/confirmation", {
            state: {
              bookingId: pendingBooking._id,
              bookingData: bookingPayload,
            },
          });
        }, 1200);
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      const errorMsg =
        error.response?.data?.message ||
        "Unable to create the booking. Please check your details and try again.";
      setMessage(errorMsg);
      setIsSuccess(false);
      setIsProcessing(false);
      return;
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
                className="bg-gradient-to-br from-[#4F46E5]/5 to-[#4F46E5]/10 dark:from-[#4F46E5]/15 dark:to-[#4F46E5]/5 border border-[#4F46E5]/20 dark:border-indigo-800/40 rounded-3xl p-6 space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xs font-black text-[#4F46E5] dark:text-indigo-400 uppercase tracking-widest mb-2">
                      Booking Summary
                    </h3>
                    <p className="text-lg font-black text-slate-900 dark:text-white">
                      {bookingData.serviceName || "Professional Service"}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowBookingDetails(false)}
                    className="text-slate-900 dark:text-white opacity-40 hover:opacity-100 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3 text-xs font-bold">
                  <div className="flex items-center gap-3">
                    <Clock size={16} className="text-[#4F46E5] dark:text-indigo-400 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">{bookingData.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin
                      size={16}
                      className="text-[#4F46E5] dark:text-indigo-400 flex-shrink-0"
                    />
                    <span className="text-slate-700 dark:text-slate-300 line-clamp-2">
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
              className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900/60 dark:to-slate-900/30 rounded-3xl p-6 border border-indigo-200 dark:border-slate-800 space-y-4"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck size={20} className="text-[#4F46E5] dark:text-indigo-400" />
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Booking Details
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-950 rounded-lg border border-indigo-100 dark:border-slate-850/60">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    Service Amount
                  </span>
                  <span className="text-sm font-black text-indigo-650 dark:text-indigo-400">
                    ₹{totalAmount}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-950 rounded-lg border border-indigo-100 dark:border-slate-850/60">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    Booking Status
                  </span>
                  <span className="text-xs font-black text-amber-600 dark:text-amber-450 bg-amber-50 dark:bg-amber-950/20 px-2 py-1 rounded">
                    CONFIRMED ON SAVE
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 pt-2">
                <ShieldCheck size={14} />
                Booking will be recorded immediately without payment.
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-indigo-100 dark:border-slate-800/80 space-y-4 transition-colors"
            >
              <div className="flex items-center gap-3">
                <CreditCard size={20} className="text-[#4F46E5] dark:text-indigo-400" />
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Choose Payment Method
                </h3>
              </div>
              <div className="grid gap-3">
                {paymentOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setPaymentMethod(option.id)}
                    className={`w-full p-4 rounded-3xl border text-left transition-all cursor-pointer ${
                      paymentMethod === option.id
                        ? "border-[#4F46E5] bg-[#EEF2FF] dark:bg-indigo-950/20"
                        : "border-[#E2E8F0] dark:border-slate-800/80 bg-white dark:bg-slate-950 hover:border-[#4F46E5]/40 text-slate-800 dark:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-black text-slate-900 dark:text-white">
                          {option.title}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {option.subtitle}
                        </p>
                      </div>
                      {paymentMethod === option.id && (
                        <span className="text-xs font-bold uppercase text-[#4F46E5] dark:text-indigo-400">
                          Selected
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* MESSAGE */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl text-sm font-bold flex items-start gap-3 ${
                  message.includes("error") || message.includes("failed")
                    ? "bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 text-rose-700 dark:text-rose-450"
                    : "bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 text-blue-700 dark:text-blue-450"
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
              className="w-full py-6 bg-[#4F46E5] hover:bg-[#4F46E5]/90 disabled:bg-[#4F46E5]/50 text-white font-black uppercase rounded-3xl shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all cursor-pointer"
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
              className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-200 dark:shadow-none"
            >
              <CheckCircle2 size={48} className="text-white" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-3"
            >
              <h2 className="text-4xl font-black text-slate-900 dark:text-white">
                Booking Confirmed!
              </h2>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Your booking has been successfully created.
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                Redirecting to booking details...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
