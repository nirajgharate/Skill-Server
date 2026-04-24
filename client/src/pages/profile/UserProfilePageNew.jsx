import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Clock,
  Star,
  Award,
  Zap,
  Heart,
  Share2,
  MoreVertical,
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
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useSocket } from "../../hooks/useSocket";
import { userService } from "../../services/api.service";

export default function UserProfilePage() {
  const navigate = useNavigate();
  const { authUser, logout } = useAuth();
  const { registerUser, on, off } = useSocket();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadUserProfile();
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("skillserverUser");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      registerUser(userData._id, userData.role);

      const handleUserUpdate = (data) => {
        if (data.userId === userData._id) {
          setUser((prev) => ({
            ...prev,
            ...data.updates,
          }));
        }
      };

      on("user_profile_updated", handleUserUpdate);

      return () => {
        off("user_profile_updated", handleUserUpdate);
      };
    }
  }, [registerUser, on, off]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const storedUser = localStorage.getItem("skillserverUser");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);

        // Load dashboard stats
        try {
          const statsRes = await userService.getDashboardStats();
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

  if (loading || !user) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Hero Header with Background */}
      <div className="relative z-10 mt-24">
        <div className="relative h-48 bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          </div>

          <div className="relative h-full flex items-start justify-between px-6 pt-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => navigate("/dashboard")}
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
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 p-1 flex-shrink-0">
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
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="absolute bottom-2 right-2 w-8 h-8 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center cursor-pointer hover:bg-emerald-600 transition-all"
                >
                  <Sparkles size={16} className="text-white" />
                </motion.div>
              </motion.div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-black text-slate-900">
                    {user.name}
                  </h1>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-3 h-3 bg-emerald-500 rounded-full"
                  />
                </div>

                <p className="text-slate-600 text-lg mb-4 font-medium">
                  Premium User • Member since{" "}
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>

                {/* Trust Badge */}
                <div className="flex items-center gap-2 mb-6">
                  <Badge size={16} className="text-indigo-600" />
                  <span className="text-sm font-bold text-indigo-600">
                    ✓ Verified Account
                  </span>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
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
                  ].map((stat, idx) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-3 text-center"
                    >
                      <stat.icon
                        size={18}
                        className="text-indigo-600 mx-auto mb-2"
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
            { id: "bookings", label: "Bookings", icon: Calendar },
            { id: "reviews", label: "Reviews", icon: Star },
            { id: "security", label: "Security", icon: Shield },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
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
              <div className="space-y-6">
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
                        className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg"
                      >
                        <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                          <item.icon size={18} className="text-indigo-600" />
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

                {/* Trust Score */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded-2xl p-8"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-black text-slate-900">
                      Trust Score
                    </h2>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 20,
                        ease: "linear",
                      }}
                      className="w-16 h-16 rounded-full bg-white border-4 border-indigo-200 flex items-center justify-center"
                    >
                      <span className="text-2xl font-black text-indigo-600">
                        {Math.round((stats?.totalBookings || 0) * 10)}%
                      </span>
                    </motion.div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { label: "Complete Profile", value: 90 },
                      {
                        label: "Booking Completion",
                        value: stats?.totalBookings
                          ? Math.round(
                              (stats.completedBookings / stats.totalBookings) *
                                100,
                            )
                          : 0,
                      },
                      { label: "Response Time", value: 85 },
                    ].map((item, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-semibold text-slate-700">
                            {item.label}
                          </span>
                          <span className="text-sm font-bold text-indigo-600">
                            {item.value}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: "0%" }}
                            animate={{ width: `${item.value}%` }}
                            transition={{ duration: 0.8 }}
                            className="h-full bg-gradient-to-r from-indigo-500 to-blue-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}

            {activeTab === "bookings" && (
              <div className="bg-white border border-slate-200 rounded-2xl p-8">
                <h2 className="text-2xl font-black text-slate-900 mb-6">
                  Your Recent Bookings
                </h2>
                <div className="text-center py-12">
                  <Calendar size={48} className="text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">No bookings yet</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => navigate("/services")}
                    className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all"
                  >
                    Book a Service
                  </motion.button>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="bg-white border border-slate-200 rounded-2xl p-8">
                <h2 className="text-2xl font-black text-slate-900 mb-6">
                  Your Reviews
                </h2>
                <div className="text-center py-12">
                  <Star size={48} className="text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">No reviews yet</p>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-6">
                {/* Change Password */}
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
                      <input
                        type="password"
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-all"
                        placeholder="Enter current password"
                      />
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
                      className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-all"
                    >
                      Update Password
                    </motion.button>
                  </div>
                </motion.div>

                {/* Active Sessions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-slate-200 rounded-2xl p-8"
                >
                  <h2 className="text-2xl font-black text-slate-900 mb-6">
                    Active Sessions
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-slate-900">
                          Current Device
                        </p>
                        <p className="text-sm text-slate-500">
                          Windows • Chrome
                        </p>
                      </div>
                      <Badge size={20} className="text-emerald-600" />
                    </div>
                  </div>
                </motion.div>
              </div>
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
                  {
                    icon: Settings,
                    label: "Preferences",
                    onClick: () => setActiveTab("security"),
                  },
                  { icon: Share2, label: "Share Profile" },
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
                        : "bg-indigo-50 hover:bg-indigo-100 text-indigo-600"
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

            {/* Notifications */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white border border-slate-200 rounded-2xl p-6"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Bell size={18} />
                Notifications
              </h3>
              <div className="space-y-3">
                {[
                  {
                    title: "New Booking",
                    desc: "You have a new booking request",
                  },
                  {
                    title: "Review Posted",
                    desc: "Someone reviewed your service",
                  },
                ].map((notif, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 rounded-lg border-l-2 border-indigo-500"
                  >
                    <p className="text-sm font-bold text-slate-900">
                      {notif.title}
                    </p>
                    <p className="text-xs text-slate-600">{notif.desc}</p>
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
