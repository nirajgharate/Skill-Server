import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  ClipboardList,
  Wrench,
  Plus,
  Info,
  AlertCircle,
} from "lucide-react";

import ElitePaymentStep from "./ElitePaymentStep";

export default function UberBookingFlow() {
  const location = useLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const { worker, service } = location.state || {
    worker: {
      name: "Expert Professional",
      role: "Pro",
      rating: 4.8,
      reviews: 142,
      experience: "8+ years",
      img: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?q=80&w=400",
    },
    service: {
      _id: "service_demo_001",
      name: "Home Electrical Service",
      price: 499,
      description: "Complete home electrical inspection and repair",
      category: "Electrical",
    },
  };

  // Generate serviceId for booking if available, otherwise keep null so backend can use workerId.
  const isValidObjectId = (value) =>
    typeof value === "string" && /^[0-9a-fA-F]{24}$/.test(value);

  const serviceId =
    (isValidObjectId(service?._id) && service._id) ||
    (isValidObjectId(service?.id) && service.id) ||
    (isValidObjectId(service?.serviceId) && service.serviceId) ||
    null;

  const workerId =
    (isValidObjectId(worker?._id) && worker._id) ||
    (isValidObjectId(worker?.id) && worker.id) ||
    (isValidObjectId(service?.workerId) && service.workerId) ||
    (isValidObjectId(service?.worker?._id) && service.worker._id) ||
    null;
  const serviceName =
    typeof service === "string"
      ? service
      : service?.name || service?.title || "Professional Service";
  const servicePrice = service?.price || 499;
  const serviceCategory =
    (typeof service?.category === "string" &&
      service.category.trim().toLowerCase()) ||
    (typeof worker?.profession === "string" &&
      worker.profession.trim().toLowerCase()) ||
    "electrician";

  // 1. EXTENDED STATE
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    customTime: "",
    problemDesc: "",
    requirements: [], // Tools the pro needs to bring
    address: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  // 2. DATA ARRAYS
  const standardSlots = [
    "08:00 AM",
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "01:00 PM",
    "02:00 PM",
    "04:00 PM",
    "06:00 PM",
  ];
  const toolChecklist = [
    "Ladder",
    "Drill Machine",
    "Spare Parts",
    "Safety Gear",
    "Heavy Wiring Kit",
  ];

  const toggleRequirement = (item) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.includes(item)
        ? prev.requirements.filter((i) => i !== item)
        : [...prev.requirements, item],
    }));
  };

  const slideVariants = {
    initial: { x: 30, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -30, opacity: 0 },
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-24 px-4">
      <div className="max-w-xl mx-auto">
        {/* 🏷️ PROGRESS BAR */}
        <div className="flex justify-between items-center mb-12 px-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center text-[10px] font-black border-2 transition-all duration-500 ${
                  step >= i
                    ? "bg-[#4F46E5] text-white border-[#4F46E5]"
                    : "bg-white text-[#0F172A]/20 border-black/5"
                }`}
              >
                {step > i ? <CheckCircle2 size={16} /> : i}
              </div>
              {i < 5 && (
                <div
                  className={`flex-1 h-[2px] mx-2 ${step > i ? "bg-[#4F46E5]" : "bg-black/5"}`}
                />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: SUMMARY */}
          {step === 1 && (
            <motion.div key="st1" {...slideVariants} className="space-y-8">
              <div className="text-center space-y-2">
                <h2 className="text-4xl font-black text-[#0F172A]">
                  Book Your Expert
                </h2>
                <p className="text-sm text-[#0F172A]/50 font-bold">
                  Review and confirm your service request
                </p>
              </div>

              {/* SERVICE INFO */}
              <div className="bg-gradient-to-br from-[#4F46E5]/10 to-[#4F46E5]/5 border border-[#4F46E5]/20 rounded-3xl p-6 space-y-4">
                <div>
                  <span className="text-[11px] font-black text-[#4F46E5] uppercase tracking-widest">
                    SERVICE
                  </span>
                  <h3 className="text-2xl font-black text-[#0F172A] mt-1">
                    {serviceName}
                  </h3>
                  <p className="text-xs text-[#0F172A]/60 font-medium mt-2">
                    {service?.description || "Professional service delivery"}
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 p-4 bg-white rounded-2xl border border-black/5">
                    <p className="text-[10px] font-black text-[#0F172A]/50 uppercase">
                      Price
                    </p>
                    <p className="text-2xl font-black text-[#4F46E5] mt-1">
                      ₹{servicePrice}
                    </p>
                  </div>
                  <div className="flex-1 p-4 bg-white rounded-2xl border border-black/5">
                    <p className="text-[10px] font-black text-[#0F172A]/50 uppercase">
                      Category
                    </p>
                    <p className="text-sm font-black text-[#0F172A] mt-1">
                      {service?.category || "Service"}
                    </p>
                  </div>
                </div>
              </div>

              {/* EXPERT INFO */}
              <div className="bg-white border border-black/5 rounded-3xl p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={worker.img}
                    className="w-20 h-20 rounded-2xl object-cover shadow-lg"
                    alt={worker.name}
                  />
                  <div className="flex-1">
                    <h4 className="text-xl font-black text-[#0F172A]">
                      {worker.name}
                    </h4>
                    <p className="text-xs text-[#0F172A]/60 font-bold">
                      {worker.role} • {worker.experience}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-yellow-400 font-black">★</span>
                      <span className="text-sm font-bold text-[#0F172A]">
                        {worker.rating} ({worker.reviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-xs font-medium text-[#0F172A]/70 border-t border-black/5 pt-4">
                  Highly experienced professional with excellent customer
                  ratings. Ready to deliver quality service at your doorstep.
                </p>
              </div>

              {/* CONFIRM BUTTON */}
              <button
                onClick={nextStep}
                className="w-full py-6 bg-[#4F46E5] hover:bg-[#4F46E5]/90 text-white font-black uppercase rounded-3xl shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95"
              >
                Continue to Schedule <ChevronRight size={18} />
              </button>
            </motion.div>
          )}

          {/* STEP 2: FLEXIBLE SCHEDULING */}
          {step === 2 && (
            <motion.div key="st2" {...slideVariants} className="space-y-8">
              <button
                onClick={prevStep}
                className="flex items-center gap-2 text-[10px] font-black text-[#0F172A]/40 uppercase tracking-widest"
              >
                <ArrowLeft size={14} /> Back
              </button>
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-widest text-[#0F172A]/50 flex gap-2">
                    <Calendar size={14} /> Service Date
                  </label>
                  <input
                    type="date"
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full p-5 bg-white border border-black/5 rounded-2xl outline-none font-bold"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-widest text-[#0F172A]/50 flex gap-2">
                    <Clock size={14} /> Available Slots
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {standardSlots.map((t) => (
                      <button
                        key={t}
                        onClick={() =>
                          setFormData({ ...formData, time: t, customTime: "" })
                        }
                        className={`py-3 rounded-xl text-[10px] font-black transition-all ${formData.time === t ? "bg-[#4F46E5] text-white" : "bg-white border border-black/5 text-[#0F172A]/40"}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <div className="relative mt-4">
                    <Plus
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4F46E5]"
                      size={16}
                    />
                    <input
                      type="text"
                      placeholder="Or type custom time (e.g. 7:30 PM)"
                      value={formData.customTime}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customTime: e.target.value,
                          time: "",
                        })
                      }
                      className="w-full pl-12 pr-4 py-5 bg-white border border-black/5 rounded-2xl text-xs font-bold outline-none"
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={nextStep}
                disabled={
                  !formData.date || (!formData.time && !formData.customTime)
                }
                className="w-full py-6 bg-[#4F46E5] disabled:opacity-20 text-white font-black uppercase rounded-3xl"
              >
                Next Step
              </button>
            </motion.div>
          )}

          {/* STEP 3: BRIEFING & TOOLS */}
          {step === 3 && (
            <motion.div key="st3" {...slideVariants} className="space-y-8">
              <button
                onClick={prevStep}
                className="flex items-center gap-2 text-[10px] font-black text-[#0F172A]/40 uppercase tracking-widest"
              >
                <ArrowLeft size={14} /> Back
              </button>
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-widest text-[#0F172A]/50 flex gap-2">
                    <AlertCircle size={14} /> Describe the problem
                  </label>
                  <textarea
                    rows="3"
                    onChange={(e) =>
                      setFormData({ ...formData, problemDesc: e.target.value })
                    }
                    className="w-full p-5 bg-white border border-black/5 rounded-2xl outline-none text-sm font-medium"
                    placeholder="Ex: Main fuse keeps tripping when using the AC..."
                  ></textarea>
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-widest text-[#0F172A]/50 flex gap-2">
                    <Wrench size={14} /> Pro Checklist (Bring these)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {toolChecklist.map((item) => (
                      <button
                        key={item}
                        onClick={() => toggleRequirement(item)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-bold border transition-all ${formData.requirements.includes(item) ? "bg-[#0F172A] text-white border-[#0F172A]" : "bg-white text-[#0F172A]/40 border-black/5"}`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-widest text-[#0F172A]/50 flex gap-2">
                    <MapPin size={14} /> Address
                  </label>
                  <textarea
                    rows="2"
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full p-5 bg-white border border-black/5 rounded-2xl outline-none shadow-sm text-sm font-medium"
                    placeholder="Full Address..."
                  ></textarea>
                </div>
              </div>
              <button
                onClick={nextStep}
                disabled={!formData.address}
                className="w-full py-6 bg-[#4F46E5] text-white font-black uppercase rounded-3xl"
              >
                Review Booking
              </button>
            </motion.div>
          )}

          {/* STEP 4: REVIEW */}
          {step === 4 && (
            <motion.div key="st4" {...slideVariants} className="space-y-8">
              <button
                onClick={prevStep}
                className="flex items-center gap-2 text-[10px] font-black text-[#0F172A]/40 uppercase tracking-widest hover:text-[#4F46E5] transition-colors"
              >
                <ArrowLeft size={14} /> Back
              </button>

              <div className="text-center space-y-2 mb-4">
                <h2 className="text-3xl font-black text-[#0F172A]">
                  Review Your Booking
                </h2>
                <p className="text-xs text-[#0F172A]/50 font-bold">
                  Confirm all details before payment
                </p>
              </div>

              <div className="space-y-4">
                {/* SERVICE SUMMARY */}
                <div className="bg-gradient-to-br from-[#4F46E5]/10 to-[#4F46E5]/5 border border-[#4F46E5]/20 rounded-3xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={worker.img}
                      className="w-16 h-16 rounded-2xl object-cover shadow-lg"
                      alt=""
                    />
                    <div>
                      <p className="text-xs font-black text-[#4F46E5] uppercase tracking-widest">
                        {serviceName}
                      </p>
                      <h3 className="text-lg font-black text-[#0F172A]">
                        {worker.name}
                      </h3>
                      <p className="text-xs text-[#0F172A]/60 font-bold">
                        ₹{servicePrice}
                      </p>
                    </div>
                  </div>
                </div>

                {/* BOOKING DETAILS */}
                <div className="bg-white border border-black/5 rounded-3xl p-6 space-y-6">
                  {/* Date & Time */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#4F46E5]/10 flex items-center justify-center flex-shrink-0">
                      <Calendar className="text-[#4F46E5]" size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-[#0F172A]/50 uppercase tracking-widest">
                        Date & Time
                      </p>
                      <p className="text-sm font-black text-[#0F172A] mt-2">
                        {new Date(formData.date).toLocaleDateString("en-IN", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-xs font-bold text-[#4F46E5] mt-1">
                        {formData.time || formData.customTime}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-black/5" />

                  {/* Location */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#4F46E5]/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="text-[#4F46E5]" size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-[#0F172A]/50 uppercase tracking-widest">
                        Location
                      </p>
                      <p className="text-xs font-bold leading-relaxed text-[#0F172A] mt-2">
                        {formData.address}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-black/5" />

                  {/* Problem Description */}
                  {formData.problemDesc && (
                    <>
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#4F46E5]/10 flex items-center justify-center flex-shrink-0">
                          <AlertCircle className="text-[#4F46E5]" size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-[#0F172A]/50 uppercase tracking-widest">
                            Issue Description
                          </p>
                          <p className="text-xs font-medium text-[#0F172A]/70 mt-2">
                            {formData.problemDesc}
                          </p>
                        </div>
                      </div>
                      <div className="border-t border-black/5" />
                    </>
                  )}

                  {/* Tools */}
                  {formData.requirements.length > 0 && (
                    <>
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#4F46E5]/10 flex items-center justify-center flex-shrink-0">
                          <Wrench className="text-[#4F46E5]" size={20} />
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] font-black text-[#0F172A]/50 uppercase tracking-widest">
                            Tools Required
                          </p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {formData.requirements.map((r) => (
                              <span
                                key={r}
                                className="px-3 py-1 bg-[#4F46E5]/10 text-[#4F46E5] text-[10px] font-black rounded-full"
                              >
                                {r}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Price Summary */}
                <div className="bg-white border border-black/5 rounded-3xl p-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-[#0F172A]/60">
                      Service Price
                    </span>
                    <span className="text-xs font-bold text-[#0F172A]">
                      ₹{servicePrice}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-[#0F172A]/60">
                      Platform Fee
                    </span>
                    <span className="text-xs font-bold text-[#0F172A]">₹0</span>
                  </div>
                  <div className="border-t border-black/5 my-4" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-black text-[#0F172A]">
                      Total Amount
                    </span>
                    <span className="text-2xl font-black text-[#4F46E5]">
                      ₹{servicePrice}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={nextStep}
                disabled={!formData.date || !formData.address}
                className="w-full py-6 bg-[#4F46E5] hover:bg-[#4F46E5]/90 disabled:bg-slate-300 disabled:text-slate-500 text-white font-black uppercase rounded-3xl shadow-xl transition-all active:scale-95"
              >
                Confirm Booking
              </button>
            </motion.div>
          )}

          {/* STEP 5: PAYMENT */}
          {step === 5 && (
            <motion.div key="st5" {...slideVariants}>
              <button
                onClick={prevStep}
                className="flex items-center gap-2 text-[10px] font-black text-[#0F172A]/40 uppercase tracking-widest mb-8"
              >
                <ArrowLeft size={14} /> Back
              </button>
              <ElitePaymentStep
                totalAmount={servicePrice}
                bookingData={{
                  serviceId,
                  serviceName,
                  workerId,
                  category: serviceCategory,
                  amount: servicePrice,
                  date: formData.date,
                  address: formData.address,
                  notes: {
                    time: formData.time || formData.customTime,
                    problemDesc: formData.problemDesc,
                    requirements: formData.requirements,
                  },
                }}
                onComplete={(paymentInfo) => {
                  navigate("/confirmation", {
                    state: {
                      bookingId: paymentInfo.bookingId || paymentInfo._id,
                      bookingData: {
                        ...formData,
                        ...paymentInfo,
                        worker,
                        service,
                      },
                    },
                  });
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
