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

import MapComponent from "../components/MapComponent";
import { useBooking } from "../hooks/useBooking";
import ElitePaymentStep from "./ElitePaymentStep";

export default function UberBookingFlow() {
  const location = useLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const {
    selectedWorker,
    selectedService,
    setSelectedWorker,
    setSelectedService,
    clearSelection,
  } = useBooking();

  const resolvedWorker = selectedWorker || location.state?.worker;
  const resolvedService = selectedService || location.state?.service;

  useEffect(() => {
    if (location.state?.worker && !selectedWorker) {
      setSelectedWorker(location.state.worker);
    }
    if (location.state?.service && !selectedService) {
      setSelectedService(location.state.service);
    }
  }, [
    location.state,
    selectedWorker,
    selectedService,
    setSelectedWorker,
    setSelectedService,
  ]);

  const worker = resolvedWorker || {
    name: "Expert Professional",
    role: "Pro",
    rating: 4.8,
    reviews: 142,
    experience: "8+ years",
    img: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?q=80&w=400",
  };
  const service = resolvedService || {
    _id: "service_demo_001",
    name: "Home Electrical Service",
    price: 499,
    description: "Complete home electrical inspection and repair",
    category: "Electrical",
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
    useCurrentLocation: false,
    currentLocation: null,
    locationCoordinates: null,
  });
  const [userDistanceKm, setUserDistanceKm] = useState(null);
  const [workerLocationCoords, setWorkerLocationCoords] = useState(null);
  const [showMapPreview, setShowMapPreview] = useState(true);

  const workerCoords = (() => {
    const workerData = worker || location.state?.worker;
    const coords =
      workerData?.location?.coordinates || workerData?.location || null;
    if (!Array.isArray(coords) || coords.length < 2) return null;
    const [lng, lat] = coords;
    return [lat, lng];
  })();

  const userCoords = formData.currentLocation
    ? [formData.currentLocation.latitude, formData.currentLocation.longitude]
    : null;

  const mapPreviewCenter = userCoords || workerCoords || [28.6139, 77.209];
  const mapPreviewMarkers = [];
  const mapPreviewPath = [];

  if (userCoords) {
    mapPreviewMarkers.push({
      id: "booking-user",
      type: "user",
      position: userCoords,
      title: "Your Location",
      description: "Service request origin",
    });
  }

  if (workerCoords) {
    mapPreviewMarkers.push({
      id: "booking-worker",
      type: "worker",
      position: workerCoords,
      title: worker.name || "Worker Location",
      description: worker.profession || worker.role || "Assigned worker",
    });
  }

  if (userCoords && workerCoords) {
    mapPreviewPath.push([userCoords, workerCoords]);
  }

  // Distance calculation
  const toRadians = (degrees) => degrees * (Math.PI / 180);
  const getDistanceKm = (coordA, coordB) => {
    const [lat1, lon1] = coordA;
    const [lat2, lon2] = coordB;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return 6371 * c;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  // Calculate distance when current location is detected
  useEffect(() => {
    const workerData = resolvedWorker || location.state?.worker;
    if (formData.useCurrentLocation && formData.currentLocation && workerData) {
      const userCoords = [
        formData.currentLocation.latitude,
        formData.currentLocation.longitude,
      ];

      const workerCoords =
        workerData?.location?.coordinates || workerData?.location || null;
      if (workerCoords) {
        const [lng, lat] = workerCoords;
        setWorkerLocationCoords([lat, lng]);
        const distance = getDistanceKm(userCoords, [lat, lng]);
        setUserDistanceKm(distance);
      }
    }
  }, [
    formData.useCurrentLocation,
    formData.currentLocation,
    resolvedWorker,
    location.state,
  ]);
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

  // Location detection function
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    setFormData((prev) => ({ ...prev, useCurrentLocation: true }));

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setFormData((prev) => ({
          ...prev,
          currentLocation: { latitude, longitude },
          locationCoordinates: [longitude, latitude],
        }));

        // Try to get address from coordinates (reverse geocoding)
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
          );
          const data = await response.json();
          if (data && data.display_name) {
            setFormData((prev) => ({
              ...prev,
              address: data.display_name,
            }));
          }
        } catch (error) {
          console.error("Error getting address from coordinates:", error);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to get your location. Please enter address manually.");
        setFormData((prev) => ({ ...prev, useCurrentLocation: false }));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    );
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

                  {/* Current Location Button */}
                  <div className="flex flex-col gap-3 mb-4">
                    <motion.button
                      onClick={getCurrentLocation}
                      disabled={formData.useCurrentLocation}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        formData.useCurrentLocation
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100"
                      }`}
                    >
                      <MapPin size={16} />
                      {formData.useCurrentLocation
                        ? "Location Detected ✓"
                        : "Use Current Location"}
                    </motion.button>

                    {formData.currentLocation && (
                      <div className="space-y-2 text-xs text-slate-500">
                        <div>
                          Lat: {formData.currentLocation.latitude.toFixed(6)},
                          Lng: {formData.currentLocation.longitude.toFixed(6)}
                        </div>
                        {userDistanceKm !== null && (
                          <div className="rounded-2xl bg-slate-50 border border-slate-200 px-4 py-3 text-slate-700">
                            <span className="font-semibold">
                              Distance to worker:
                            </span>{" "}
                            {userDistanceKm.toFixed(1)} km
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <textarea
                    rows="2"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full p-5 bg-white border border-black/5 rounded-2xl outline-none shadow-sm text-sm font-medium"
                    placeholder="Full Address or let us detect your location..."
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

                  {userDistanceKm !== null && (
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#4F46E5]/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="text-[#4F46E5]" size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-[#0F172A]/50 uppercase tracking-widest">
                          Distance to worker
                        </p>
                        <p className="text-sm font-black text-[#0F172A] mt-2">
                          {userDistanceKm.toFixed(1)} km away
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="border-t border-black/5" />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-black text-[#0F172A]/50 uppercase tracking-widest">
                          Booking Map
                        </p>
                        <h3 className="text-lg font-black text-[#0F172A] mt-2">
                          {userCoords && workerCoords
                            ? "Route between you and the worker"
                            : "Worker location summary"}
                        </h3>
                      </div>
                      {workerCoords && (
                        <button
                          type="button"
                          onClick={() => setShowMapPreview((prev) => !prev)}
                          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700 transition hover:bg-slate-50"
                        >
                          {showMapPreview ? "Hide map" : "Show map"}
                        </button>
                      )}
                    </div>

                    {showMapPreview && workerCoords ? (
                      <div className="rounded-[2rem] overflow-hidden border border-black/5 shadow-sm">
                        <MapComponent
                          center={mapPreviewCenter}
                          zoom={11}
                          markers={mapPreviewMarkers}
                          paths={mapPreviewPath}
                          height="320px"
                          showUserLocation={false}
                          interactive={false}
                        />
                      </div>
                    ) : null}

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                      <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#0F172A]/50">
                          Estimated distance
                        </p>
                        <p className="mt-3 text-2xl font-black text-[#0F172A]">
                          {userDistanceKm !== null
                            ? `${userDistanceKm.toFixed(1)} km`
                            : userCoords
                              ? "Calculating..."
                              : "Use current location to estimate"}
                        </p>
                        <p className="mt-2 text-sm text-slate-600">
                          {userDistanceKm !== null
                            ? "Distance from your current location to the worker"
                            : "Please allow location access or enter your address to show accurate distance."}
                        </p>
                      </div>

                      <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#0F172A]/50">
                          Worker arrival area
                        </p>
                        <p className="mt-3 text-sm text-[#0F172A] leading-relaxed">
                          {worker.location?.address ||
                            worker.address ||
                            "Worker location not available"}
                        </p>
                        {workerCoords && (
                          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            Worker coordinates found
                          </div>
                        )}
                      </div>
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
                        Service Address
                      </p>
                      <p className="text-xs font-bold leading-relaxed text-[#0F172A] mt-2">
                        {formData.address || "No address provided"}
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
                  locationCoordinates: formData.locationCoordinates,
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
                  clearSelection();
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
