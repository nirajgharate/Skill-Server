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
  Calendar,
  Briefcase,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
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
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useSocket } from "../../hooks/useSocket";
import { userService, workerService } from "../../services/api.service";

export default function ProfilePageUnified() {
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

  // Determine if user is worker or regular user
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

        // Load stats based on role
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
          className="w-16 h-16 border-4 border-slate-300 border-t-indigo-600 rounded-full"
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

  const gradientClass = isWorker
    ? "from-emerald-600 via-teal-600 to-cyan-600"
    : "from-indigo-600 via-blue-600 to-purple-600";

  const themeColor = isWorker ? "emerald" : "indigo";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Hero Header */}
      <div className="relative z-10 mt-24">
        <div
          className={`relative h-48 bg-gradient-to-br ${gradientClass} overflow-hidden`}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          </div>

          <div className="relative h-full flex items-start justify-between px-6 pt-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() =>
                navigate(isWorker ? "/worker-dashboard" : "/user-dashboard")
              }
              className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-all"
            >
              <ArrowLeft size={20} />
            </motion.button>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => setIsEditing(!isEditing)}
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

        {/* Profile Card */}
        <div className="max-w-7xl mx-auto px-4 pb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-200 rounded-3xl p-8 -mt-24 relative z-20 shadow-xl"
          >
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Avatar */}
              <div className="relative">
                <div
                  className={`w-32 h-32 rounded-2xl bg-gradient-to-br ${gradientClass} p-1 flex-shrink-0`}
                >
                  <div className="w-full h-full rounded-2xl overflow-hidden bg-white flex items-center justify-center">
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
                    animate={{ scale: isAvailable ? [1, 1.2, 1] : 1 }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    onClick={() => setIsAvailable(!isAvailable)}
                    className={`absolute bottom-2 right-2 w-8 h-8 ${
                      isAvailable ? "bg-emerald-500" : "bg-slate-400"
                    } rounded-full border-4 border-white flex items-center justify-center cursor-pointer hover:scale-110 transition-all`}
                  >
                    <Sparkles size={16} className="text-white" />
                  </motion.div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-black text-slate-900">
                    {user.name}
                  </h1>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className={`w-3 h-3 bg-${themeColor}-500 rounded-full`}
                  />
                </div>

                <p className="text-slate-600 text-lg mb-4 font-medium">
                  {isWorker ? "Professional Service Provider" : "Premium User"}{" "}
                  • Member since {new Date(user.createdAt).toLocaleDateString()}
                </p>

                <div className="flex items-center gap-2 mb-6">
                  <Badge size={16} className={`text-${themeColor}-600`} />
                  <span className={`text-sm font-bold text-${themeColor}-600`}>
                    ✓ Verified {isWorker ? "Professional" : "Account"}
                  </span>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(isWorker
                    ? [
                        {
                          label: "Active Jobs",
                          value: stats?.activeJobs || 0,
                          icon: Briefcase,
                        },
                        {
                          label: "Completed",
                          value: stats?.completedJobs || 0,
                          icon: CheckCircle2,
                        },
                        {
                          label: "Earnings",
                          value: `₹${stats?.weeklyEarnings || 0}`,
                          icon: DollarSign,
                        },
                        {
                          label: "Rating",
                          value: stats?.avgRating || "N/A",
                          icon: Star,
                        },
                      ]
                    : [
                        {
                          label: "Bookings",
                          value: stats?.totalBookings || 0,
                          icon: Briefcase,
                        },
                        {
                          label: "Completed",
                          value: stats?.completedBookings || 0,
                          icon: CheckCircle2,
                        },
                        {
                          label: "Spent",
                          value: `₹${stats?.totalSpent || 0}`,
                          icon: DollarSign,
                        },
                        {
                          label: "Rating",
                          value: stats?.averageRating || "N/A",
                          icon: Star,
                        },
                      ]
                  ).map((stat, idx) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-3 text-center"
                    >
                      <stat.icon
                        size={18}
                        className={`text-${themeColor}-600 mx-auto mb-2`}
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
            { id: "contact", label: "Contact", icon: Mail },
            { id: "security", label: "Security", icon: Shield },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? `bg-${themeColor}-600 text-white shadow-lg shadow-${themeColor}-500/30`
                  : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-300"
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
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white border border-slate-200 rounded-2xl p-8`}
              >
                <h2 className="text-2xl font-black text-slate-900 mb-6">
                  About
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  {isWorker
                    ? "Professional service provider with expertise in delivering quality services with attention to detail and customer satisfaction."
                    : "Premium member enjoying quality services with dedicated support and exclusive benefits."}
                </p>
              </motion.div>
            )}

            {activeTab === "contact" && (
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
                    {
                      icon: Mail,
                      label: "Email",
                      value: user.email,
                      field: "email",
                    },
                    {
                      icon: Phone,
                      label: "Phone",
                      value: user.phone || "Not set",
                      field: "phone",
                    },
                    {
                      icon: MapPin,
                      label: "Location",
                      value: user.address || "Not set",
                      field: "address",
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg"
                    >
                      <div
                        className={`w-10 h-10 rounded-lg bg-${themeColor}-100 flex items-center justify-center`}
                      >
                        <item.icon
                          size={18}
                          className={`text-${themeColor}-600`}
                        />
                      </div>
                      <div className="flex-1">
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
            )}

            {activeTab === "security" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-slate-200 rounded-2xl p-8"
              >
                <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
                  <Key size={24} />
                  Change Password
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-all"
                        placeholder="Enter current password"
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-500"
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
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-all"
                      placeholder="Enter new password"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    className={`w-full px-6 py-3 bg-${themeColor}-600 text-white rounded-lg font-bold hover:bg-${themeColor}-700 transition-all`}
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
              className="bg-white border border-slate-200 rounded-2xl p-6"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-4">
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
                    onClick={action.onClick}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                      action.danger
                        ? "bg-red-50 hover:bg-red-100 text-red-600"
                        : `bg-${themeColor}-50 hover:bg-${themeColor}-100 text-${themeColor}-600`
                    }`}
                  >
                    <action.icon size={18} />
                    <span className="font-semibold text-sm">
                      {action.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Profile Completion */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`bg-gradient-to-br from-${themeColor}-50 to-${themeColor === "emerald" ? "teal" : "blue"}-50 border border-${themeColor}-200 rounded-2xl p-6`}
            >
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Profile Completion
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Complete Profile", value: 90 },
                  { label: "Verification", value: 100 },
                  { label: "Settings", value: 75 },
                ].map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-semibold text-slate-700">
                        {item.label}
                      </span>
                      <span
                        className={`text-sm font-bold text-${themeColor}-600`}
                      >
                        {item.value}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: `${item.value}%` }}
                        transition={{ duration: 0.8 }}
                        className={`h-full bg-gradient-to-r from-${themeColor}-500 to-${themeColor === "emerald" ? "teal" : "blue"}-500`}
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
            className="bg-white rounded-3xl max-w-2xl w-full max-h-screen overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900">
                Edit Profile
              </h2>
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Profile Photo */}
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
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <button
                    className={`flex items-center gap-2 px-4 py-2 bg-${themeColor}-100 text-${themeColor}-600 rounded-lg hover:bg-${themeColor}-200 transition-all`}
                  >
                    <Upload size={18} />
                    Upload Photo
                  </button>
                </div>
              </div>

              {/* Form Fields */}
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
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-all"
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
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-all"
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
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-all"
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
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-all"
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
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-all"
                    placeholder="e.g., City Wide, Specific Area"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t border-slate-200">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-6 py-3 bg-slate-100 text-slate-900 rounded-lg font-bold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={handleSave}
                  disabled={saving}
                  className={`flex-1 px-6 py-3 bg-${themeColor}-600 text-white rounded-lg font-bold hover:bg-${themeColor}-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2`}
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
