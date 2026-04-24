import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Star,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Award,
  MessageSquare,
  ChevronRight,
  Briefcase,
  MapPin,
  ThumbsUp,
  Loader2,
  AlertCircle,
} from "lucide-react";
import API from "../api/api";

export default function WorkerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [worker, setWorker] = useState(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Get worker data from location state or fetch from API
  useEffect(() => {
    const loadWorkerData = async () => {
      try {
        setLoading(true);
        setError(null);

        // First, try to get worker from location.state (passed from listing page)
        if (location.state?.worker) {
          setWorker(location.state.worker);
          setLoading(false);
          return;
        }

        // Otherwise, fetch from API using worker ID
        const response = await API.get(`/workers/${id}`);
        const fetchedWorker = response.data.data || response.data;

        if (fetchedWorker) {
          setWorker(fetchedWorker);
        } else {
          setError("Worker not found");
        }
      } catch (err) {
        console.error("Error loading worker:", err);
        setError("Failed to load worker details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadWorkerData();
  }, [id, location.state]);

  const handleBooking = () => {
    if (!worker) return;

    const selectedService = location.state?.service || {
      _id: null,
      title: worker.profession || "Professional Service",
      name: worker.profession || "Professional Service",
      price: worker.price || 499,
      category: worker.profession || "service",
      workerId: worker._id || id,
    };

    navigate("/booking", {
      state: {
        worker,
        service: selectedService,
      },
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-24 px-4 md:px-8 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 size={48} className="text-[#4F46E5]" />
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error || !worker) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-[#0F172A]/40 hover:text-[#4F46E5] font-bold transition-all group mb-12"
          >
            <div className="p-2 bg-white rounded-xl shadow-sm border border-black/5">
              <ArrowLeft size={16} />
            </div>
            Back
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 bg-red-50 border-2 border-red-200 rounded-[2rem] text-center"
          >
            <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
            <p className="text-red-700 font-bold text-lg mb-6">
              {error || "Worker not found"}
            </p>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all"
            >
              Go Back
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Helper function to get first name
  const getFirstName = (name) => {
    return name ? name.split(" ")[0] : "Expert";
  };

  // Helper function to get profile image
  const getProfileImage = () => {
    return (
      worker.profilePhoto ||
      worker.img ||
      `https://i.pravatar.cc/150?u=${worker._id || worker.name}`
    );
  };

  // Helper function to get hourly rate
  const getHourlyRate = () => {
    return worker.hourlyRate || worker.rate || 450;
  };

  // Helper function to get completed jobs
  const getCompletedJobs = () => {
    return worker.completedJobs || worker.totalJobs || 500;
  };

  // Helper function to get skills
  const getSkills = () => {
    if (worker.skills && Array.isArray(worker.skills)) {
      return worker.skills;
    }
    return [
      "Professional Service",
      "Quality Work",
      "Reliable",
      "Experienced",
      "Customer Focused",
    ];
  };

  // Helper function to get testimonials
  const getTestimonials = () => {
    if (worker.testimonials && Array.isArray(worker.testimonials)) {
      return worker.testimonials.slice(0, 2);
    }
    return [
      {
        name: "Satisfied Customer",
        text: "Excellent work quality and very professional service.",
        rating: 5,
      },
    ];
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-24 px-4 md:px-8">
      {/* 🧭 NAVIGATION */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="max-w-7xl mx-auto mb-10"
      >
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-[#0F172A]/40 hover:text-[#4F46E5] font-bold transition-all group"
        >
          <div className="p-2 bg-white rounded-xl shadow-sm border border-black/5 group-hover:bg-[#4F46E5]/10 group-hover:text-[#4F46E5]">
            <ArrowLeft size={16} />
          </div>
          Back to Expert List
        </button>
      </motion.div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* 📝 LEFT COLUMN: Profile & Credibility (8/12) */}
        <div className="lg:col-span-8 space-y-10">
          {/* PROFILE HEADER */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 bg-white border border-black/5 rounded-[3rem] shadow-sm flex flex-col md:flex-row gap-8 items-center md:items-start"
          >
            <div className="relative">
              <div className="w-32 h-32 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src={getProfileImage()}
                  alt={worker.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = `https://i.pravatar.cc/150?u=${worker._id || worker.name}`;
                  }}
                />
              </div>
              <div className="absolute -bottom-2 -right-2 p-2 bg-emerald-500 text-white rounded-xl shadow-lg border-2 border-white">
                <ShieldCheck size={20} />
              </div>
            </div>

            <div className="text-center md:text-left space-y-3">
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <span className="px-3 py-1 bg-[#4F46E5]/10 text-[#4F46E5] text-[10px] font-black uppercase tracking-widest rounded-full">
                  Top Rated
                </span>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                  {worker.experienceYears || 8}+ YRS EXP
                </span>
              </div>
              <h1 className="text-4xl font-black text-[#0F172A] tracking-tight">
                {worker.name}
              </h1>
              <p className="text-[#4F46E5] font-black text-sm uppercase tracking-wider">
                {worker.profession || worker.role || "Professional"}
              </p>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-6">
                <div className="flex items-center gap-1.5 text-sm font-bold text-[#0F172A]">
                  <Star size={16} className="fill-amber-400 text-amber-400" />
                  {worker.rating || 4.8}{" "}
                  <span className="text-[#0F172A]/40">
                    ({worker.reviews || 120} Reviews)
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-sm font-bold text-[#0F172A]/40">
                  <MapPin size={16} />
                  {worker.serviceArea || worker.location || "Mumbai"}
                </div>
              </div>
            </div>
          </motion.div>

          {/* QUICK STATS BAR */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-4"
          >
            <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-indigo-100 rounded-[2rem] text-center">
              <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mb-2">
                Jobs Completed
              </p>
              <p className="text-3xl font-black text-indigo-700">
                {getCompletedJobs()}+
              </p>
              <p className="text-[10px] text-indigo-600/60 mt-1">
                Successfully finished
              </p>
            </div>
            <div className="p-6 bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100 rounded-[2rem] text-center">
              <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-2">
                Hourly Rate
              </p>
              <p className="text-3xl font-black text-emerald-700">
                ₹{getHourlyRate()}
                <span className="text-sm">/hr</span>
              </p>
              <p className="text-[10px] text-emerald-600/60 mt-1">
                Competitive pricing
              </p>
            </div>
            <div className="p-6 bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100 rounded-[2rem] text-center">
              <p className="text-[9px] font-black text-purple-600 uppercase tracking-widest mb-2">
                Guarantee
              </p>
              <p className="text-2xl font-black text-purple-700">24M</p>
              <p className="text-[10px] text-purple-600/60 mt-1">
                Workmanship warranty
              </p>
            </div>
          </motion.div>

          {/* ABOUT & SKILLS */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-7 space-y-8">
              {/* ABOUT SECTION */}
              <div className="p-8 bg-white/60 backdrop-blur-lg border border-black/5 rounded-[2.5rem]">
                <h3 className="text-xl font-black text-[#0F172A] mb-4 flex items-center gap-2">
                  <Award size={20} className="text-[#4F46E5]" /> About
                  Professional
                </h3>
                <p className="text-[#0F172A]/60 leading-relaxed font-medium">
                  {worker.bio ||
                    worker.about ||
                    `Experienced ${worker.profession || "professional"} with a passion for delivering quality service. Dedicated to customer satisfaction with years of proven expertise.`}
                </p>
              </div>

              {/* PORTFOLIO MEDIA SECTION */}
              {worker.portfolio &&
                Array.isArray(worker.portfolio) &&
                worker.portfolio.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-black text-[#0F172A] mb-6 flex items-center gap-2">
                      <Briefcase size={20} className="text-[#4F46E5]" />
                      Work Gallery ({worker.portfolio.length})
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      {worker.portfolio.map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.05 }}
                          whileHover={{ scale: 1.05 }}
                          className="relative rounded-2xl overflow-hidden shadow-lg h-48 bg-slate-100 group cursor-pointer"
                        >
                          {item.mediaType === "photo" ? (
                            <img
                              src={item.url}
                              alt="Portfolio work"
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <video
                              src={item.url}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          )}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                            <span className="bg-[#4F46E5] text-white px-3 py-1 rounded-full text-xs font-bold capitalize opacity-0 group-hover:opacity-100 transition-opacity">
                              {item.mediaType}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

              {/* CORE EXPERTISE SECTION */}
              {worker.coreExpertise &&
                Array.isArray(worker.coreExpertise) &&
                worker.coreExpertise.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-black text-[#0F172A] mb-6 flex items-center gap-2">
                      <Award size={20} className="text-[#4F46E5]" />
                      Specialized Expertise
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {worker.coreExpertise.map((expertise, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.05 }}
                          className="px-4 py-2.5 bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-full font-bold text-sm text-indigo-700 shadow-sm hover:shadow-md transition-shadow"
                        >
                          ✓ {expertise}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

              {/* PERSONAL INFO SECTION */}
              {worker.gender && (
                <div className="space-y-4">
                  <h3 className="text-lg font-black text-[#0F172A] mb-6 flex items-center gap-2">
                    👤 About
                  </h3>
                  <div className="p-6 bg-white/60 backdrop-blur-lg border border-black/5 rounded-[2rem]">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-indigo-100 rounded-lg">
                        <span className="text-2xl">
                          {worker.gender === "male"
                            ? "♂️"
                            : worker.gender === "female"
                              ? "♀️"
                              : "⚧"}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Gender
                        </p>
                        <p className="text-lg font-black text-slate-900 capitalize">
                          {worker.gender}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PORTFOLIO SECTION */}
              <div className="space-y-4">
                <h3 className="text-lg font-black text-[#0F172A] mb-6 flex items-center gap-2">
                  <Briefcase size={20} className="text-[#4F46E5]" />
                  Recent Projects
                </h3>
                <div className="space-y-3">
                  {worker.portfolio &&
                  Array.isArray(worker.portfolio) &&
                  worker.portfolio.length > 0
                    ? worker.portfolio.slice(0, 3).map((project, i) => (
                        <motion.div
                          key={i}
                          whileHover={{ x: 8 }}
                          className="p-4 bg-white/50 border border-black/5 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-bold text-sm text-[#0F172A]">
                                {project.title || project.name || "Project"}
                              </p>
                              <p className="text-xs text-[#0F172A]/50 flex items-center gap-1 mt-1">
                                <MapPin size={12} />{" "}
                                {project.area || project.location || "Location"}
                              </p>
                            </div>
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-black rounded-lg">
                              {project.value || project.amount || "₹0"}
                            </span>
                          </div>
                        </motion.div>
                      ))
                    : [
                        {
                          title: "Professional Project 1",
                          area: "Service Area",
                          value: "₹0",
                        },
                        {
                          title: "Professional Project 2",
                          area: "Service Area",
                          value: "₹0",
                        },
                        {
                          title: "Professional Project 3",
                          area: "Service Area",
                          value: "₹0",
                        },
                      ].map((project, i) => (
                        <motion.div
                          key={i}
                          whileHover={{ x: 8 }}
                          className="p-4 bg-white/50 border border-black/5 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-bold text-sm text-[#0F172A]">
                                {project.title}
                              </p>
                              <p className="text-xs text-[#0F172A]/50 flex items-center gap-1 mt-1">
                                <MapPin size={12} /> {project.area}
                              </p>
                            </div>
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-black rounded-lg">
                              {project.value}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                </div>
              </div>

              {/* CERTIFICATIONS SECTION */}
              <div className="space-y-4">
                <h3 className="text-lg font-black text-[#0F172A] mb-4 flex items-center gap-2">
                  <Award size={20} className="text-amber-500" />
                  Certifications & Credentials
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {worker.certifications &&
                  Array.isArray(worker.certifications) &&
                  worker.certifications.length > 0
                    ? worker.certifications.map((cert, i) => (
                        <motion.div
                          key={i}
                          whileHover={{ scale: 1.05 }}
                          className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-xl flex items-center gap-3"
                        >
                          <span className="text-2xl">📜</span>
                          <span className="text-sm font-bold text-amber-900">
                            {cert}
                          </span>
                        </motion.div>
                      ))
                    : [
                        { cert: "Professionally Certified", icon: "🔌" },
                        { cert: "Industry Registered", icon: "✓" },
                        { cert: "Safety Certified", icon: "🛡️" },
                        { cert: "Licensed Professional", icon: "📜" },
                      ].map((item, i) => (
                        <motion.div
                          key={i}
                          whileHover={{ scale: 1.05 }}
                          className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-xl flex items-center gap-3"
                        >
                          <span className="text-2xl">{item.icon}</span>
                          <span className="text-sm font-bold text-amber-900">
                            {item.cert}
                          </span>
                        </motion.div>
                      ))}
                </div>
              </div>

              {/* TESTIMONIALS WITH RATINGS */}
              <div className="space-y-4">
                <h3 className="text-lg font-black text-[#0F172A] mb-6 flex items-center gap-2">
                  <MessageSquare size={20} className="text-[#4F46E5]" />
                  Client Reviews ({worker.reviews || "120"})
                </h3>
                {getTestimonials().map((t, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -4 }}
                    className="p-6 bg-white border border-black/5 rounded-[2rem] shadow-sm hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, star) => (
                          <Star
                            key={star}
                            size={14}
                            className={`${star < (t.rating || 5) ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-[#0F172A]/40">
                        Recently
                      </span>
                    </div>
                    <p className="italic text-sm text-[#0F172A]/70 mb-3">
                      "{t.text}"
                    </p>
                    <span className="not-italic font-black text-[#4F46E5] text-sm">
                      — {t.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* SKILLS SIDEBAR */}
            <div className="md:col-span-5">
              <div className="p-8 bg-[#0F172A] text-white rounded-[2.5rem] shadow-xl sticky top-32">
                <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                  <Briefcase size={18} className="text-[#4F46E5]" /> Core
                  Expertise
                </h3>
                <div className="flex flex-wrap gap-2">
                  {getSkills().map((skill, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-white/10 rounded-xl text-xs font-bold border border-white/10 hover:bg-[#4F46E5] transition-all cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="mt-8 pt-8 border-t border-white/10">
                  <div className="flex items-center gap-3 text-xs font-bold text-white/60">
                    <ThumbsUp size={16} className="text-[#4F46E5]" />
                    {worker.satisfactionRate || 100}% Satisfaction Rate
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 💳 RIGHT COLUMN: Sticky Booking Action (4/12) */}
        <aside className="lg:col-span-4 space-y-6">
          {/* AVAILABILITY SECTION */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="p-6 bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100 rounded-[2.5rem]"
          >
            <h4 className="font-black text-emerald-900 mb-4 flex items-center gap-2">
              <Clock size={18} className="text-emerald-600" />
              Availability
            </h4>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
                <span className="text-sm font-bold text-emerald-900">
                  Today
                </span>
                <span className="px-2.5 py-1 bg-emerald-500 text-white text-[10px] font-black rounded-md">
                  Available
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
                <span className="text-sm font-bold text-emerald-900">
                  Weekends
                </span>
                <span className="px-2.5 py-1 bg-amber-500 text-white text-[10px] font-black rounded-md">
                  Limited
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
                <span className="text-sm font-bold text-emerald-900">
                  Emergency
                </span>
                <span className="px-2.5 py-1 bg-red-500 text-white text-[10px] font-black rounded-md">
                  24/7
                </span>
              </div>
            </div>
          </motion.div>

          {/* TRUST & SAFETY SECTION */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-[2.5rem]"
          >
            <h4 className="font-black text-blue-900 mb-4 flex items-center gap-2">
              <ShieldCheck size={18} className="text-blue-600" />
              Trust & Safety
            </h4>
            <div className="space-y-2.5">
              <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span className="text-sm font-bold text-blue-900">
                  Background Verified
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span className="text-sm font-bold text-blue-900">
                  Insurance Active
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span className="text-sm font-bold text-blue-900">
                  24M Work Guarantee
                </span>
              </div>
            </div>
          </motion.div>

          {/* BOOKING ACTION CARD */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:sticky lg:top-32 p-8 bg-white/80 backdrop-blur-2xl border border-white rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(79,70,229,0.1)] flex flex-col gap-8 text-center"
          >
            <div className="space-y-2">
              <p className="text-[10px] font-black text-[#0F172A]/30 uppercase tracking-[0.3em]">
                Ready to start?
              </p>
              <h4 className="text-2xl font-black text-[#0F172A]">
                Book {getFirstName(worker.name)}
              </h4>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleBooking}
                className="group w-full py-5 bg-[#4F46E5] text-white font-bold rounded-2xl shadow-xl shadow-indigo-100 hover:bg-[#0F172A] transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                Hire Professional
                <ChevronRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
              <div className="flex items-center justify-center gap-6 text-[#0F172A]/40 font-bold text-[10px] uppercase tracking-wider">
                <div className="flex flex-col items-center gap-1">
                  <Clock size={16} /> 60m response
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck size={16} /> Insured
                </div>
              </div>
            </div>

            <p className="text-[11px] text-[#0F172A]/40 font-medium leading-relaxed italic">
              "Professional service with strict safety protocols and customer
              satisfaction guarantee."
            </p>
          </motion.div>
        </aside>
      </div>
    </div>
  );
}
