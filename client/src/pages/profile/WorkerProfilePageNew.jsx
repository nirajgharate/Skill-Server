import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Edit2,
  Settings,
  LogOut,
  MapPin,
  Mail,
  Phone,
  Shield,
  Star,
  Award,
  Zap,
  Heart,
  Share2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Briefcase,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  Bell,
  User,
  Key,
  Eye,
  EyeOff,
  Upload,
  Badge,
  Sparkles,
  Clock,
  MessageSquare,
  Users,
  Wrench,
  Plus,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useSocket } from "../../hooks/useSocket";
import { workerService } from "../../services/api.service";

export default function WorkerProfilePageNew() {
  const navigate = useNavigate();
  const { workerId } = useParams();
  const { authUser } = useAuth();
  const { registerUser, on, off } = useSocket();
  const [loading, setLoading] = useState(false);
  const [worker, setWorker] = useState(null);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    loadWorkerProfile();
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("skillserverUser");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      registerUser(userData._id, userData.role);

      const handleWorkerUpdate = (data) => {
        if (data.workerId === userData._id) {
          setWorker((prev) => ({
            ...prev,
            ...data.updates,
          }));
        }
      };

      on("worker_updated", handleWorkerUpdate);

      return () => {
        off("worker_updated", handleWorkerUpdate);
      };
    }
  }, [registerUser, on, off]);

  const loadWorkerProfile = async () => {
    try {
      setLoading(true);
      const storedUser = localStorage.getItem("skillserverUser");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setWorker(userData);

        // Load dashboard stats
        try {
          const statsRes = await workerService.getDashboardStats();
          setStats(statsRes.data);
        } catch (err) {
          console.log("Using default stats");
        }
      }
    } catch (err) {
      console.error("Error loading profile:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !worker) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-16 h-16 border-4 border-slate-300 border-t-emerald-600 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Hero Header with Background */}
      <div className="relative z-10 mt-24">
        <div className="relative h-48 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          </div>

          <div className="relative h-full flex items-start justify-between px-6 pt-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => navigate(-1)}
              className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-all"
            >
              <ArrowLeft size={20} />
            </motion.button>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => navigate("/worker-dashboard")}
                className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-all"
              >
                <Edit2 size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => navigate("/settings")}
                className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-all"
              >
                <Settings size={20} />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Profile Info Section */}
        <div className="max-w-7xl mx-auto px-4 pb-12">
          {/* Avatar & Basic Info */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-200 rounded-3xl p-8 -mt-24 relative z-20 shadow-xl"
          >
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Avatar */}
              <motion.div whileHover={{ scale: 1.05 }} className="relative">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 p-1 flex-shrink-0">
                  <div className="w-full h-full rounded-2xl overflow-hidden bg-white flex items-center justify-center">
                    <img
                      src={
                        worker.profilePhoto ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${worker.name}`
                      }
                      alt={worker.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <motion.div
                  animate={{ scale: isAvailable ? [1, 1.2, 1] : 1 }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className={`absolute bottom-2 right-2 w-8 h-8 ${
                    isAvailable ? "bg-emerald-500" : "bg-slate-400"
                  } rounded-full border-4 border-white flex items-center justify-center cursor-pointer hover:scale-110 transition-all`}
                  onClick={() => setIsAvailable(!isAvailable)}
                >
                  <Zap size={16} className="text-white" />
                </motion.div>
              </motion.div>

              {/* Worker Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-black text-slate-900">
                    {worker.name}
                  </h1>
                  {isAvailable && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="w-3 h-3 bg-emerald-500 rounded-full"
                    />
                  )}
                </div>

                <p className="text-slate-600 text-lg mb-2 font-medium">
                  Professional Service Provider
                </p>

                <p className="text-slate-600 mb-4">
                  ⭐ {stats?.avgRating || "0"} • {stats?.completedJobs || "0"}{" "}
                  Completed Jobs
                </p>

                {/* Trust Badge */}
                <div className="flex items-center gap-2 mb-6">
                  <Badge size={16} className="text-emerald-600" />
                  <span className="text-sm font-bold text-emerald-600">
                    ✓ Verified Professional
                  </span>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    {
                      label: "Active Jobs",
                      value: stats?.activeJobs || 0,
                      icon: Briefcase,
                      color: "text-blue-600",
                    },
                    {
                      label: "Completed",
                      value: stats?.completedJobs || 0,
                      icon: CheckCircle2,
                      color: "text-emerald-600",
                    },
                    {
                      label: "Earnings",
                      value: `₹${stats?.weeklyEarnings || 0}`,
                      icon: DollarSign,
                      color: "text-amber-600",
                    },
                    {
                      label: "Rating",
                      value: stats?.avgRating || "N/A",
                      icon: Star,
                      color: "text-yellow-600",
                    },
                  ].map((stat, idx) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-3 text-center"
                    >
                      <stat.icon
                        size={18}
                        className={`${stat.color} mx-auto mb-2`}
                      />
                      <p className="text-slate-600 text-xs font-semibold">
                        {stat.label}
                      </p>
                      <p className="text-slate-900 font-bold text-lg">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: "overview", label: "Overview", icon: User },
            { id: "services", label: "Services", icon: Wrench },
            { id: "jobs", label: "Active Jobs", icon: Calendar },
            { id: "earnings", label: "Earnings", icon: DollarSign },
            { id: "reviews", label: "Reviews", icon: Star },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/30"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-emerald-300"
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="lg:col-span-2 space-y-6"
          >
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* About */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-slate-200 rounded-2xl p-8"
                >
                  <h2 className="text-2xl font-black text-slate-900 mb-4">
                    About
                  </h2>
                  <p className="text-slate-600 leading-relaxed">
                    Professional service provider with years of experience.
                    Dedicated to providing quality services with attention to
                    detail.
                  </p>
                </motion.div>

                {/* Services Offered */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-slate-200 rounded-2xl p-8"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-black text-slate-900">
                      Services Offered
                    </h2>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      className="p-2 bg-emerald-100 rounded-lg text-emerald-600 hover:bg-emerald-200 transition-all"
                    >
                      <Plus size={20} />
                    </motion.button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { name: "Plumbing", price: "₹500-1000" },
                      { name: "Electrical", price: "₹800-1500" },
                      { name: "Cleaning", price: "₹300-600" },
                      { name: "AC Service", price: "₹1000-2000" },
                    ].map((service, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg"
                      >
                        <p className="font-bold text-slate-900">
                          {service.name}
                        </p>
                        <p className="text-sm text-slate-600">
                          {service.price}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Contact Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-slate-200 rounded-2xl p-8"
                >
                  <h2 className="text-2xl font-black text-slate-900 mb-6">
                    Contact Information
                  </h2>
                  <div className="space-y-4">
                    {[
                      { icon: Mail, label: "Email", value: worker.email },
                      {
                        icon: Phone,
                        label: "Phone",
                        value: worker.phone || "Not set",
                      },
                      {
                        icon: MapPin,
                        label: "Service Area",
                        value: worker.serviceArea || "City Wide",
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg"
                      >
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                          <item.icon size={18} className="text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-600 uppercase">
                            {item.label}
                          </p>
                          <p className="text-slate-900 font-semibold">
                            {item.value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}

            {activeTab === "services" && (
              <div className="bg-white border border-slate-200 rounded-2xl p-8">
                <h2 className="text-2xl font-black text-slate-900 mb-6">
                  Manage Services
                </h2>
                <div className="text-center py-12">
                  <Wrench size={48} className="text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">
                    View and manage your services
                  </p>
                </div>
              </div>
            )}

            {activeTab === "jobs" && (
              <div className="bg-white border border-slate-200 rounded-2xl p-8">
                <h2 className="text-2xl font-black text-slate-900 mb-6">
                  Active Jobs
                </h2>
                <div className="text-center py-12">
                  <Calendar size={48} className="text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">No active jobs at the moment</p>
                </div>
              </div>
            )}

            {activeTab === "earnings" && (
              <div className="bg-white border border-slate-200 rounded-2xl p-8">
                <h2 className="text-2xl font-black text-slate-900 mb-6">
                  Earnings
                </h2>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {[
                    {
                      label: "This Week",
                      value: `₹${stats?.weeklyEarnings || 0}`,
                      icon: TrendingUp,
                    },
                    {
                      label: "This Month",
                      value: `₹${(stats?.weeklyEarnings || 0) * 4}`,
                      icon: DollarSign,
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-emerald-50 rounded-lg border border-emerald-200"
                    >
                      <item.icon size={20} className="text-emerald-600 mb-2" />
                      <p className="text-slate-600 text-sm font-medium">
                        {item.label}
                      </p>
                      <p className="text-2xl font-black text-slate-900">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="bg-white border border-slate-200 rounded-2xl p-8">
                <h2 className="text-2xl font-black text-slate-900 mb-6">
                  Customer Reviews
                </h2>
                <div className="text-center py-12">
                  <Star size={48} className="text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">No reviews yet</p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Performance */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Performance
              </h3>
              <div className="space-y-4">
                {[
                  { label: "Response Time", value: "< 2 hours" },
                  { label: "Completion Rate", value: "98%" },
                  {
                    label: "Customer Rating",
                    value: stats?.avgRating || "N/A",
                  },
                ].map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-slate-700">
                        {item.label}
                      </span>
                      <span className="text-sm font-bold text-emerald-600">
                        {item.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white border border-slate-200 rounded-2xl p-6"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                {[
                  { icon: Edit2, label: "Edit Profile" },
                  { icon: Settings, label: "Settings" },
                  { icon: Bell, label: "Notifications" },
                ].map((action, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ x: 5 }}
                    className="w-full flex items-center gap-3 p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition-all"
                  >
                    <action.icon size={18} />
                    <span className="font-semibold text-sm">
                      {action.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Stats Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white border border-slate-200 rounded-2xl p-6"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                This Month
              </h3>
              <div className="space-y-3">
                {[
                  {
                    icon: Briefcase,
                    label: "Jobs Completed",
                    value: stats?.completedJobs || 0,
                  },
                  {
                    icon: Users,
                    label: "New Clients",
                    value: stats?.newClients || 0,
                  },
                  {
                    icon: Star,
                    label: "Avg Rating",
                    value: stats?.avgRating || "N/A",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <item.icon size={16} className="text-emerald-600" />
                      <span className="text-sm text-slate-600">
                        {item.label}
                      </span>
                    </div>
                    <span className="font-bold text-slate-900">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
