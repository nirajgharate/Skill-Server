import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Mail,
  Phone,
  Star,
  Award,
  Briefcase,
  Clock,
  CheckCircle2,
  AlertCircle,
  Shield,
  FileText,
  Users,
  TrendingUp,
  Share2,
  Heart,
  MessageSquare,
  Edit2,
  Calendar,
  DollarSign,
  Home,
  Zap,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useSocket } from "../../hooks/useSocket";
import API from "../../api/api";

export default function WorkerProfilePage() {
  const navigate = useNavigate();
  const { authUser } = useAuth();
  const { registerUser, on, off } = useSocket();
  const [loading, setLoading] = useState(true);
  const [worker, setWorker] = useState(null);

  useEffect(() => {
    loadProfile();
  }, [authUser]);

  useEffect(() => {
    const stored = localStorage.getItem("skillserverUser");
    if (stored) {
      const userData = JSON.parse(stored);
      registerUser(userData._id, "worker");

      const handleUpdate = (data) => {
        if (data.worker?._id === userData._id) {
          setWorker((prev) => ({ ...prev, ...data.worker }));
        }
      };

      on("worker_updated", handleUpdate);
      return () => off("worker_updated", handleUpdate);
    }
  }, [registerUser, on, off]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const stored = localStorage.getItem("skillserverUser");
      if (stored) {
        const userData = JSON.parse(stored);
        setWorker(userData);

        if (authUser?._id) {
          try {
            const response = await API.get(`/workers/${authUser._id}`);
            setWorker(response.data);
          } catch (err) {
            console.log("Using localStorage data");
          }
        }
      }
    } catch (err) {
      console.error("Error loading profile:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-16 h-16 border-4 border-slate-300 border-t-indigo-600 rounded-full"
        />
      </div>
    );
  }

  if (!worker) return null;

  const reviews = [
    {
      customer: "Aditi Verma",
      rating: 5,
      comment: "Excellent electrical work! Very professional.",
      date: "2 weeks ago",
    },
    {
      customer: "Rahul Singh",
      rating: 5,
      comment: "Quick and efficient service. Highly recommended!",
      date: "3 weeks ago",
    },
    {
      customer: "Priya Sharma",
      rating: 4.5,
      comment: "Great service. Will hire again!",
      date: "1 month ago",
    },
  ];

  const services = [
    { name: "Electrical Wiring", price: "₹500-1000", rating: 4.9, jobs: 245 },
    { name: "Electrical Repair", price: "₹300-800", rating: 5, jobs: 189 },
    { name: "AC Maintenance", price: "₹800-1200", rating: 4.8, jobs: 156 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="relative z-40 backdrop-blur-lg bg-white/80 border-b border-slate-200/50 mt-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <motion.button
            whileHover={{ x: -4 }}
            onClick={() => navigate("/worker-dashboard")}
            className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-semibold transition-all"
          >
            <ArrowLeft size={20} /> Back
          </motion.button>
          <h1 className="text-slate-900 font-black text-xl">
            Professional Profile
          </h1>
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => navigate("/worker/edit-profile")}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-full transition-all text-white"
          >
            <Edit2 size={20} />
          </motion.button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 mb-8 overflow-hidden relative shadow-lg"
        >
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Profile Image */}
              <div className="md:col-span-1 flex justify-center md:justify-start">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-40 h-40 rounded-2xl overflow-hidden border-4 border-indigo-500 shadow-2xl"
                >
                  <img
                    src={
                      worker.profilePhoto ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${worker.name}`
                    }
                    alt={worker.name}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>

              {/* Profile Info */}
              <div className="md:col-span-3 space-y-6">
                {/* Name & Title */}
                <div>
                  <h1 className="text-4xl font-black text-slate-900 mb-2">
                    {worker.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-4 py-2 bg-indigo-600 text-white rounded-full font-bold text-sm">
                      {worker.profession}
                    </span>
                    <span className="px-4 py-2 bg-emerald-600 text-white rounded-full font-bold text-sm">
                      Verified Professional
                    </span>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 text-slate-600">
                    <Phone size={20} className="text-indigo-600" />
                    <span>{worker.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <MapPin size={20} className="text-indigo-600" />
                    <span>{worker.serviceArea}</span>
                  </div>
                </div>

                {/* Key Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <p className="text-slate-500 text-xs font-bold mb-1 uppercase">
                      EXPERIENCE
                    </p>
                    <p className="text-slate-900 font-black text-2xl">
                      {worker.experienceYears}+
                    </p>
                    <p className="text-slate-500 text-xs">years</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <p className="text-slate-500 text-xs font-bold mb-1 uppercase">
                      RATING
                    </p>
                    <div className="flex items-center gap-2">
                      <Star
                        size={16}
                        className="text-amber-400 fill-amber-400"
                      />
                      <p className="text-slate-900 font-black text-2xl">4.8</p>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <p className="text-slate-500 text-xs font-bold mb-1 uppercase">
                      COMPLETED
                    </p>
                    <p className="text-slate-900 font-black text-2xl">590+</p>
                    <p className="text-slate-500 text-xs">jobs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Services & About */}
          <div className="lg:col-span-2 space-y-8">
            {/* Professional Bio */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md"
            >
              <h2 className="text-slate-900 font-black text-xl mb-4 flex items-center gap-2">
                <Briefcase size={20} className="text-indigo-600" /> About
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Experienced {worker.profession} professional with{" "}
                {worker.experienceYears}+ years of expertise. Specializing in
                residential and commercial services with a proven track record
                of excellence, reliability, and customer satisfaction. Committed
                to delivering quality workmanship and maintaining
                professionalism in every project.
              </p>
            </motion.div>

            {/* Services */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md"
            >
              <h2 className="text-slate-900 font-black text-xl mb-4 flex items-center gap-2">
                <Zap size={20} className="text-indigo-600" /> Services Offered
              </h2>
              <div className="space-y-4">
                {services.map((service, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-indigo-300 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-slate-900 font-bold mb-2">
                          {service.name}
                        </p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Star
                              size={16}
                              className="text-amber-400 fill-amber-400"
                            />
                            <span className="text-slate-600 text-sm">
                              {service.rating}
                            </span>
                          </div>
                          <span className="text-slate-500 text-sm">
                            {service.jobs} jobs completed
                          </span>
                        </div>
                      </div>
                      <p className="text-indigo-600 font-bold text-lg">
                        {service.price}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Documents/Certifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md"
            >
              <h2 className="text-slate-900 font-black text-xl mb-4 flex items-center gap-2">
                <Shield size={20} className="text-indigo-600" /> Verifications
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: "Aadhar Card", verified: true },
                  { name: "PAN Card", verified: true },
                  {
                    name: "Degree Certificate",
                    verified: worker.degreeCertificate ? true : false,
                  },
                ].map((doc, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -4 }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      doc.verified
                        ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                        : "bg-slate-50 border-slate-200 text-slate-500"
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold mb-2">
                      <FileText size={18} />
                      {doc.name}
                    </div>
                    {doc.verified ? (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 size={16} />
                        Verified
                      </div>
                    ) : (
                      <p className="text-sm">Not uploaded</p>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Reviews & Quick Actions */}
          <div className="space-y-8">
            {/* Quick Stats Cards */}
            <div className="space-y-4">
              {[
                {
                  label: "Hourly Rate",
                  value: `₹${worker.hourlyRate}/hr`,
                  icon: DollarSign,
                  color: "from-emerald-500 to-teal-500",
                },
                {
                  label: "Response Time",
                  value: "< 5 minutes",
                  icon: Clock,
                  color: "from-indigo-500 to-blue-500",
                },
                {
                  label: "Profile Completion",
                  value: `${worker.profileCompletionPercentage}%`,
                  icon: CheckCircle2,
                  color: "from-purple-500 to-pink-500",
                },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-500 text-xs font-bold uppercase mb-1">
                        {stat.label}
                      </p>
                      <p className="text-slate-900 font-black text-lg">
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}
                    >
                      <stat.icon size={20} className="text-white" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Reviews Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md"
            >
              <h3 className="text-slate-900 font-black text-lg mb-4 flex items-center gap-2">
                <Star size={20} className="text-amber-400" /> Reviews
              </h3>

              <div className="space-y-4">
                {reviews.map((review, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="border-l-4 border-amber-400 pl-4 py-2"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-slate-900 font-bold text-sm">
                        {review.customer}
                      </p>
                      <div className="flex items-center gap-1">
                        {Array(Math.round(review.rating))
                          .fill(0)
                          .map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className="text-amber-400 fill-amber-400"
                            />
                          ))}
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm mb-1">
                      {review.comment}
                    </p>
                    <p className="text-slate-400 text-xs">{review.date}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <motion.button
                whileHover={{ y: -2 }}
                onClick={() => navigate("/worker/schedule")}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <Calendar size={18} /> View Schedule
              </motion.button>

              <motion.button
                whileHover={{ y: -2 }}
                onClick={() => navigate("/worker/earnings")}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <TrendingUp size={18} /> Earnings
              </motion.button>

              <motion.button
                whileHover={{ y: -2 }}
                onClick={() => navigate("/worker-dashboard")}
                className="w-full py-3 bg-slate-200 hover:bg-slate-300 text-slate-900 font-bold rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <Home size={18} /> Go to Dashboard
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
