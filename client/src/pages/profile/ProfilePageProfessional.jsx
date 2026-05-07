import React, { useEffect, useState, useRef } from "react";
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
import {
  userService,
  workerService,
  bookingService,
} from "../../services/api.service";
import { getAvatarUrl } from "../../utils/avatar.util";

const AVATAR_OPTIONS = [
  { id: "sunrise", label: "Sunrise", seed: "sunrise-pro", gender: "female" },
  { id: "aurora", label: "Aurora", seed: "aurora-pro", gender: "female" },
  { id: "midnight", label: "Midnight", seed: "midnight-pro", gender: "female" },
  { id: "storm", label: "Storm", seed: "storm-pro", gender: "female" },
  { id: "oasis", label: "Oasis", seed: "oasis-pro", gender: "female" },
  { id: "ember", label: "Ember", seed: "ember-pro", gender: "female" },
  { id: "lunar", label: "Lunar", seed: "lunar-pro", gender: "female" },
  { id: "prism", label: "Prism", seed: "prism-pro", gender: "female" },
  { id: "sierra", label: "Sierra", seed: "sierra-pro", gender: "female" },
  { id: "zenith", label: "Zenith", seed: "zenith-pro", gender: "female" },
  { id: "glow", label: "Glow", seed: "glow-pro", gender: "female" },
  { id: "meadow", label: "Meadow", seed: "meadow-pro", gender: "female" },
  { id: "cascade", label: "Cascade", seed: "cascade-pro", gender: "female" },
  { id: "spark", label: "Spark", seed: "spark-pro", gender: "female" },
  { id: "dusk", label: "Dusk", seed: "dusk-pro", gender: "female" },
  { id: "nova", label: "Nova", seed: "nova-pro", gender: "female" },
  { id: "rose", label: "Rose", seed: "rose-pro", gender: "female" },
  { id: "willow", label: "Willow", seed: "willow-pro", gender: "female" },
  { id: "pearl", label: "Pearl", seed: "pearl-pro", gender: "female" },
  { id: "daisy", label: "Daisy", seed: "daisy-pro", gender: "female" },
  { id: "valor", label: "Valor", seed: "valor-pro", gender: "male" },
  { id: "iron", label: "Iron", seed: "iron-pro", gender: "male" },
  { id: "hero", label: "Hero", seed: "hero-pro", gender: "male" },
  { id: "steel", label: "Steel", seed: "steel-pro", gender: "male" },
  { id: "onyx", label: "Onyx", seed: "onyx-pro", gender: "male" },
  { id: "atlas", label: "Atlas", seed: "atlas-pro", gender: "male" },
  { id: "ridge", label: "Ridge", seed: "ridge-pro", gender: "male" },
  { id: "arbor", label: "Arbor", seed: "arbor-pro", gender: "male" },
  { id: "saber", label: "Saber", seed: "saber-pro", gender: "male" },
  { id: "frost", label: "Frost", seed: "frost-pro", gender: "male" },
];

export default function ProfilePageProfessional() {
  const navigate = useNavigate();
  const { authUser, logout, updateUser, dashboardStats } = useAuth();
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
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const fileInputRef = useRef(null);

  const isWorker = user?.role === "worker";

  const buildAvatarUrl = (seed) =>
    getAvatarUrl({
      profilePhoto: formData?.profilePhoto,
      name: formData?.name || user?.name || seed,
      id: user?._id || seed,
      fallbackSeed: seed,
    });

  const buildPreviewAvatarUrl = (seed, label, gender) =>
    getAvatarUrl({
      fallbackSeed: seed,
      avatarGender: gender,
      name: formData?.name || user?.name || label,
      id: user?._id || seed,
    });

  const handleAvatarSelect = (option) => {
    const avatarUrl = buildPreviewAvatarUrl(
      option.seed,
      option.label,
      option.gender,
    );
    setFormData((prev) => ({ ...prev, profilePhoto: avatarUrl }));
    setUser((prev) => ({ ...prev, profilePhoto: avatarUrl }));
  };

  const handleAvatarPickerSave = async () => {
    setShowAvatarPicker(false);
    if (!isEditing) {
      setIsEditing(true);
    }
    await handleSave();
  };

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
      let userData = null;
      try {
        const profileRes = await userService.getProfile();
        userData = profileRes.data || profileRes;
      } catch (err) {
        const storedUser = localStorage.getItem("skillserverUser");
        if (storedUser) userData = JSON.parse(storedUser);
      }

      if (userData) {
        setUser(userData);
        setFormData({
          ...userData,
          location: userData.location || userData.address || "",
          bio: userData.bio || userData.about || userData.description || "",
        });
        setIsAvailable(userData.isAvailable !== false);
        if (updateUser) {
          updateUser(userData);
        }
      }

      try {
        let statsData = null;

        if (userData?.role === "worker") {
          const bookings = await bookingService.getWorkerBookings();
          const filteredBookings = Array.isArray(bookings)
            ? bookings
            : bookings.data || [];

          const normalizeStatus = (status) =>
            String(status || "").toLowerCase();
          const activeBookings = filteredBookings.filter((booking) =>
            [
              "pending",
              "confirmed",
              "accepted",
              "in-progress",
              "active",
              "paid",
            ].includes(normalizeStatus(booking.status)),
          );
          const completedBookings = filteredBookings.filter(
            (booking) => normalizeStatus(booking.status) === "completed",
          );
          const totalEarnings = completedBookings.reduce(
            (sum, booking) => sum + (booking.amount ?? booking.price ?? 0),
            0,
          );
          const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
          const weeklyEarnings = completedBookings
            .filter(
              (booking) => new Date(booking.createdAt).getTime() >= oneWeekAgo,
            )
            .reduce(
              (sum, booking) => sum + (booking.amount ?? booking.price ?? 0),
              0,
            );

          statsData = {
            activeJobs: activeBookings.length,
            completedJobs: completedBookings.length,
            weeklyEarnings,
            avgRating: userData.rating || 0,
            totalEarnings,
          };
        } else {
          if (dashboardStats) {
            statsData = dashboardStats;
          } else {
            const statsRes = await userService.getDashboardStats();
            statsData = statsRes.data || statsRes;

            if (!statsData || statsData.totalBookings === undefined) {
              const allBookings = await userService.getUserBookings();
              const normalizedBookings = Array.isArray(allBookings)
                ? allBookings
                : allBookings.data || [];
              const completed = normalizedBookings.filter(
                (booking) =>
                  String(booking.status || "").toLowerCase() === "completed",
              );
              const totalSpent = completed.reduce(
                (sum, booking) => sum + (booking.amount ?? booking.price ?? 0),
                0,
              );
              const ratingSum = completed.reduce(
                (sum, booking) => sum + (booking.workerId?.rating ?? 0),
                0,
              );
              statsData = {
                totalBookings: normalizedBookings.length,
                completedBookings: completed.length,
                totalSpent,
                averageRating:
                  completed.length > 0
                    ? Math.round((ratingSum / completed.length) * 10) / 10
                    : 0,
              };
            }
          }
        }

        setStats(statsData);
      } catch (err) {
        console.log("Using default stats", err);
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

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        profilePhoto: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const service = isWorker ? workerService : userService;
      const updatedData = await service.updateProfile(formData);
      setUser(updatedData);
      setFormData((prev) => ({
        ...prev,
        ...updatedData,
        location: updatedData.location || prev.location || "",
      }));
      const stored = JSON.parse(
        localStorage.getItem("skillserverUser") || "{}",
      );
      const merged = { ...stored, ...updatedData };
      localStorage.setItem("skillserverUser", JSON.stringify(merged));
      if (updateUser) {
        updateUser(updatedData);
      }
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(
        "Error saving profile:",
        err.response?.data || err.message || err,
      );
      alert(
        "Failed to update profile: " +
          (err.response?.data?.message || err.message || "Unknown error"),
      );
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
                        getAvatarUrl({
                          name: user.name,
                          id: user._id,
                          fallbackSeed:
                            user.name || user._id || "professional-avatar",
                        })
                      }
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(true);
                        setShowAvatarPicker(true);
                      }}
                      className="absolute bottom-4 right-4 z-20 h-12 w-12 rounded-full bg-white shadow-lg grid place-items-center text-slate-900 hover:bg-slate-100 transition-all"
                      aria-label="Choose avatar"
                    >
                      <Sparkles size={20} />
                    </button>
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
                    {user.bio ||
                      user.about ||
                      user.description ||
                      (isWorker
                        ? "Experienced professional with a strong track record of completed service requests and satisfied customers."
                        : "Active member using our service marketplace to book trusted professionals.")}
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
                      value:
                        user.location ||
                        user.address ||
                        user.serviceArea ||
                        user.city ||
                        "Not set",
                      hasMapButton: true,
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
                      <div className="flex-1">
                        <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                          {item.label}
                        </p>
                        <p className="text-slate-900 font-semibold text-lg">
                          {item.value}
                        </p>
                      </div>
                      {item.hasMapButton && item.value !== "Not set" && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => navigate("/map")}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                            isWorker
                              ? "bg-purple-600 hover:bg-purple-700 text-white"
                              : "bg-blue-600 hover:bg-blue-700 text-white"
                          }`}
                        >
                          <MapPin size={14} />
                          View Map
                        </motion.button>
                      )}
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
              {showAvatarPicker && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        Pick a professional avatar
                      </p>
                      <p className="text-xs text-slate-500">
                        Choose a polished avatar for your profile and bookings.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAvatarPicker(false)}
                      className="px-3 py-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition-all"
                    >
                      Close
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-[54vh] overflow-y-auto pr-2">
                    {AVATAR_OPTIONS.map((option) => {
                      const avatarUrl = buildPreviewAvatarUrl(
                        option.seed,
                        option.label,
                        option.gender,
                      );
                      const selected = formData.profilePhoto === avatarUrl;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => handleAvatarSelect(option)}
                          className={`group overflow-hidden rounded-3xl border p-1 transition-all ${
                            selected
                              ? "border-indigo-600 bg-indigo-50"
                              : "border-slate-200 bg-white hover:border-slate-400"
                          }`}
                        >
                          <img
                            src={avatarUrl}
                            alt={option.label}
                            className="aspect-square w-full rounded-3xl object-cover"
                          />
                          <div className="mt-2 text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">
                            {option.label}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={() => setShowAvatarPicker(false)}
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-all"
                    >
                      Keep current
                    </button>
                    <button
                      type="button"
                      onClick={handleAvatarPickerSave}
                      className="rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-all"
                    >
                      Save selected avatar
                    </button>
                  </div>
                </motion.div>
              )}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">
                  Profile Photo
                </label>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="relative">
                    <img
                      src={
                        formData.profilePhoto ||
                        getAvatarUrl({
                          name: formData.name || user.name,
                          id: user._id,
                          fallbackSeed:
                            formData.name || user.name || "professional-avatar",
                        })
                      }
                      alt="Profile"
                      className="w-24 h-24 rounded-xl object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAvatarPicker(true)}
                      className="absolute bottom-0 right-0 h-10 w-10 rounded-full bg-slate-900 text-white grid place-items-center shadow-lg hover:bg-slate-800 transition-all"
                      aria-label="Open avatar options"
                    >
                      <Sparkles size={18} />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:shadow-lg transition-all ${
                        isWorker
                          ? "bg-purple-600 hover:bg-purple-700"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      <Upload size={18} />
                      Upload Photo
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoChange}
                    />
                    {formData.profilePhoto && (
                      <p className="text-xs text-slate-500">Photo selected</p>
                    )}
                  </div>
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
                    name="location"
                    value={formData.location || ""}
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
