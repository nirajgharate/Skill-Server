import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
  CheckCircle2,
  AlertCircle,
  Briefcase,
  DollarSign,
  Bell,
  User,
  Key,
  Badge,
  Sparkles,
  Save,
  X,
  Upload,
  Eye,
  EyeOff,
  Award,
  Clock,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useSocket } from "../../hooks/useSocket";
import { userService, workerService } from "../../services/api.service";

export default function ProfilePageProfessional() {
  const navigate = useNavigate();
  const { authUser, logout } = useAuth();
  const { registerUser, on, off } = useSocket();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isAvailable, setIsAvailable] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isWorker = user?.role === "worker";

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("skillserverUser");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      registerUser(userData._id, userData.role);

      const handleUpdate = (data) => {
        if (
          (isWorker && data.workerId === userData._id) ||
          (!isWorker && data.userId === userData._id)
        ) {
          setUser((prev) => ({ ...prev, ...data.updates }));
        }
      };

      on("user_profile_updated", handleUpdate);
      on("worker_updated", handleUpdate);

      return () => {
        off("user_profile_updated", handleUpdate);
        off("worker_updated", handleUpdate);
      };
    }
  }, [registerUser, on, off, isWorker]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const storedUser = localStorage.getItem("skillserverUser");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setFormData(userData);
        setIsAvailable(userData.isAvailable !== false);

        try {
          const statsRes =
            userData.role === "worker"
              ? await workerService.getDashboardStats()
              : await userService.getDashboardStats();
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const service = isWorker ? workerService : userService;
      await service.updateProfile(formData);
      setUser(formData);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-16 h-16 border-4 border-slate-300 border-t-blue-600 rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <AlertCircle size={48} className="text-red-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Hero Header - Professional Design */}
      <div className="relative z-10 mt-24">
        <div
          className={`relative h-56 bg-gradient-to-br ${
            isWorker
              ? "from-slate-900 via-purple-900 to-slate-900"
              : "from-slate-900 via-blue-900 to-slate-900"
          } overflow-hidden`}
        >
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          </div>

          <div className="relative h-full flex items-start justify-between px-6 pt-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                navigate(isWorker ? "/worker-dashboard" : "/user-dashboard")
              }
              className="p-2.5 bg-white/15 backdrop-blur-md rounded-lg text-white hover:bg-white/25 transition-all border border-white/20"
            >
              <ArrowLeft size={20} />
            </motion.button>

            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(!isEditing)}
                className="p-2.5 bg-white/15 backdrop-blur-md rounded-lg text-white hover:bg-white/25 transition-all border border-white/20"
              >
                <Edit2 size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/settings")}
                className="p-2.5 bg-white/15 backdrop-blur-md rounded-lg text-white hover:bg-white/25 transition-all border border-white/20"
              >
                <Settings size={20} />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Premium Profile Card */}
        <div className="max-w-6xl mx-auto px-4 pb-16">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white border border-slate-200 rounded-3xl p-8 -mt-28 relative z-20 shadow-2xl"
          >
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Avatar Section */}
              <div className="relative flex-shrink-0">
                <div
                  className={`w-40 h-40 rounded-3xl bg-gradient-to-br p-1 ${
                    isWorker
                      ? "from-purple-400 to-purple-600"
                      : "from-blue-400 to-blue-600"
                  }`}
                >
                  <div className="w-full h-full rounded-3xl overflow-hidden bg-white flex items-center justify-center">
                    <img
                      src={
                        user.profilePhoto ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`
                      }
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {isWorker && (
                  <motion.div
                    animate={{ scale: isAvailable ? [1, 1.15, 1] : 1 }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    onClick={() => setIsAvailable(!isAvailable)}
                    className={`absolute bottom-3 right-3 w-10 h-10 rounded-full border-4 border-white flex items-center justify-center cursor-pointer transition-all hover:scale-125 ${
                      isAvailable
                        ? "bg-green-500 shadow-lg shadow-green-500/50"
                        : "bg-slate-400"
                    }`}
                  >
                    <Sparkles size={18} className="text-white" />
                  </motion.div>
                )}
              </div>

              {/* Info Section */}
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-3">
                  <h1 className="text-5xl font-black text-slate-900">
                    {user.name}
                  </h1>
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 2.5 }}
                    className={`w-4 h-4 rounded-full ${
                      isWorker ? "bg-purple-600" : "bg-blue-600"
                    }`}
                  />
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <p className="text-lg text-slate-600 font-semibold">
                    {isWorker
                      ? "Professional Service Provider"
                      : "Premium Member"}
                  </p>
                  <Award
                    size={18}
                    className={isWorker ? "text-purple-600" : "text-blue-600"}
                  />
                </div>

                <p className="text-slate-500 mb-6 text-sm">
                  Member since{" "}
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm border ${
                    isWorker
                      ? "bg-purple-100 text-purple-700 border-purple-200"
                      : "bg-blue-100 text-blue-700 border-blue-200"
                  }`}
                >
                  <CheckCircle2 size={16} />✓ Verified{" "}
                  {isWorker ? "Professional" : "Account"}
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                  {(isWorker
                    ? [
                        {
                          label: "Active Jobs",
                          value: stats?.activeJobs || 0,
                          icon: Briefcase,
                          bgColor: "bg-blue-100",
                          textColor: "text-blue-600",
                        },
                        {
                          label: "Completed",
                          value: stats?.completedJobs || 0,
                          icon: CheckCircle2,
                          bgColor: "bg-green-100",
                          textColor: "text-green-600",
                        },
                        {
                          label: "Earnings",
                          value: `₹${stats?.weeklyEarnings || 0}`,
                          icon: DollarSign,
                          bgColor: "bg-amber-100",
                          textColor: "text-amber-600",
                        },
                        {
                          label: "Rating",
                          value: stats?.avgRating || "N/A",
                          icon: Star,
                          bgColor: "bg-yellow-100",
                          textColor: "text-yellow-600",
                        },
                      ]
                    : [
                        {
                          label: "Total Bookings",
                          value: stats?.totalBookings || 0,
                          icon: Briefcase,
                          bgColor: "bg-blue-100",
                          textColor: "text-blue-600",
                        },
                        {
                          label: "Completed",
                          value: stats?.completedBookings || 0,
                          icon: CheckCircle2,
                          bgColor: "bg-green-100",
                          textColor: "text-green-600",
                        },
                        {
                          label: "Total Spent",
                          value: `₹${stats?.totalSpent || 0}`,
                          icon: DollarSign,
                          bgColor: "bg-amber-100",
                          textColor: "text-amber-600",
                        },
                        {
                          label: "Rating",
                          value: stats?.averageRating || "N/A",
                          icon: Star,
                          bgColor: "bg-yellow-100",
                          textColor: "text-yellow-600",
                        },
                      ]
                  ).map((stat, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-4 border border-slate-200 hover:border-slate-300 transition-all group"
                    >
                      <div
                        className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}
                      >
                        <stat.icon size={20} className={stat.textColor} />
                      </div>
                      <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-black text-slate-900 mt-1">
                        {stat.value}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-4">
          {[
            { id: "overview", label: "Overview", icon: User },
            { id: "contact", label: "Contact Info", icon: Mail },
            { id: "security", label: "Security", icon: Shield },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all border ${
                activeTab === tab.id
                  ? isWorker
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30 border-transparent"
                    : "bg-blue-600 text-white shadow-lg shadow-blue-600/30 border-transparent"
                  : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
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
          <motion.div className="lg:col-span-2 space-y-6">
            {activeTab === "overview" && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-lg transition-all"
                >
                  <h2 className="text-2xl font-black text-slate-900 mb-4">
                    About
                  </h2>
                  <p className="text-slate-600 leading-relaxed text-lg">
                    {isWorker
                      ? "Dedicated professional service provider committed to delivering exceptional quality with meticulous attention to detail and outstanding customer satisfaction."
                      : "Valued member enjoying premium services with access to our extensive network of verified professionals."}
                  </p>
                </motion.div>

                {isWorker && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-lg transition-all"
                  >
                    <h2 className="text-2xl font-black text-slate-900 mb-6">
                      Performance
                    </h2>
                    <div className="space-y-6">
                      {[
                        {
                          label: "Response Time",
                          value: "< 2 hours",
                          icon: Clock,
                        },
                        {
                          label: "Completion Rate",
                          value: "98%",
                          icon: CheckCircle2,
                        },
                        {
                          label: "Customer Satisfaction",
                          value: "4.8/5",
                          icon: Star,
                        },
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-4 pb-4 border-b border-slate-100 last:border-0"
                        >
                          <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center">
                            <item.icon size={20} className="text-slate-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-slate-600">
                              {item.label}
                            </p>
                            <p className="text-2xl font-black text-slate-900">
                              {item.value}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </>
            )}

            {activeTab === "contact" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-lg transition-all"
              >
                <h2 className="text-2xl font-black text-slate-900 mb-6">
                  Contact Information
                </h2>
                <div className="space-y-4">
                  {[
                    { icon: Mail, label: "Email", value: user.email },
                    {
                      icon: Phone,
                      label: "Phone",
                      value: user.phone || "Not set",
                    },
                    {
                      icon: MapPin,
                      label: "Location",
                      value: user.address || "Not set",
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-4 p-4 rounded-xl border hover:border-slate-300 transition-all ${
                        isWorker
                          ? "bg-purple-50 border-purple-200"
                          : "bg-blue-50 border-blue-200"
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          isWorker ? "bg-purple-100" : "bg-blue-100"
                        }`}
                      >
                        <item.icon
                          size={20}
                          className={
                            isWorker ? "text-purple-600" : "text-blue-600"
                          }
                        />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                          {item.label}
                        </p>
                        <p className="text-slate-900 font-semibold text-lg">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "security" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-lg transition-all"
              >
                <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
                  <Shield size={24} />
                  Security Settings
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                        placeholder="Enter current password"
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-3.5 text-slate-500 hover:text-slate-700"
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      placeholder="Enter new password"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full px-6 py-3 text-white rounded-lg font-bold transition-all shadow-lg ${
                      isWorker
                        ? "bg-purple-600 hover:bg-purple-700"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    Update Password
                  </motion.button>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all"
            >
              <h3 className="text-lg font-black text-slate-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                {[
                  {
                    icon: Edit2,
                    label: "Edit Profile",
                    onClick: () => setIsEditing(true),
                  },
                  { icon: Settings, label: "Settings" },
                  {
                    icon: LogOut,
                    label: "Logout",
                    onClick: logout,
                    danger: true,
                  },
                ].map((action, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={action.onClick}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg font-semibold transition-all border ${
                      action.danger
                        ? "bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                        : isWorker
                          ? "bg-purple-50 hover:bg-purple-100 text-purple-600 border-purple-200"
                          : "bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
                    }`}
                  >
                    <action.icon size={18} />
                    {action.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Profile Stats Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white hover:shadow-xl transition-all"
            >
              <h3 className="text-lg font-black mb-4">Profile Strength</h3>
              <div className="space-y-4">
                {[
                  { label: "Complete Profile", value: 90 },
                  { label: "Verification", value: 100 },
                ].map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-semibold">
                        {item.label}
                      </span>
                      <span className="text-sm font-bold">{item.value}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: `${item.value}%` }}
                        transition={{ duration: 0.8 }}
                        className={`h-full bg-gradient-to-r ${
                          isWorker
                            ? "from-purple-400 to-purple-600"
                            : "from-blue-400 to-blue-600"
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl max-w-2xl w-full max-h-screen overflow-y-auto shadow-2xl"
          >
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900">
                Edit Profile
              </h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-all"
              >
                <X size={24} />
              </motion.button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">
                  Profile Photo
                </label>
                <div className="flex items-center gap-4">
                  <img
                    src={
                      formData.profilePhoto ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`
                    }
                    alt="Profile"
                    className="w-24 h-24 rounded-xl object-cover"
                  />
                  <button
                    className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:shadow-lg transition-all ${
                      isWorker
                        ? "bg-purple-600 hover:bg-purple-700"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    <Upload size={18} />
                    Upload Photo
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
              </div>

              {isWorker && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Service Area
                  </label>
                  <input
                    type="text"
                    name="serviceArea"
                    value={formData.serviceArea || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    placeholder="e.g., Entire City, Specific Areas"
                  />
                </div>
              )}

              <div className="flex gap-4 pt-6 border-t border-slate-200">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-6 py-3 bg-slate-100 text-slate-900 rounded-lg font-bold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={saving}
                  className={`flex-1 px-6 py-3 text-white rounded-lg font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg ${
                    isWorker
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  <Save size={18} />
                  {saving ? "Saving..." : "Save Changes"}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
