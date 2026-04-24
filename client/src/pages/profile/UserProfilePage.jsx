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
  Clock,
  Star,
  Award,
  Zap,
  Heart,
  Share2,
  MoreVertical,
  Loader2,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useSocket } from "../../hooks/useSocket";

export default function UserProfilePage() {
  const navigate = useNavigate();
  const { authUser, logout } = useAuth();
  const { registerUser, on, off } = useSocket();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const storedUser = localStorage.getItem("skillserverUser");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      registerUser(userData._id, userData.role);

      const handleUserUpdate = (data) => {
        if (data.userId === userData._id) {
          setUser((prev) => ({
            ...prev,
            ...data.updates,
          }));
          localStorage.setItem(
            "skillserverUser",
            JSON.stringify({
              ...userData,
              ...data.updates,
            }),
          );
        }
      };

      on("user_profile_updated", handleUserUpdate);
      return () => off("user_profile_updated", handleUserUpdate);
    }
  }, [on, off, registerUser]);

  if (!user && !authUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Loader2 size={48} className="animate-spin text-indigo-600" />
      </div>
    );
  }

  const userData = user || authUser;
  const initials = userData?.name?.charAt(0).toUpperCase() || "U";

  const handleLogout = () => {
    setLoading(true);
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <div className="relative z-40 mt-24 backdrop-blur-md bg-white/80 border-b border-slate-200/50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <motion.button
            onClick={() => navigate(-1)}
            whileHover={{ x: -4 }}
            className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-semibold transition-all"
          >
            <ArrowLeft size={20} /> Back
          </motion.button>
          <h2 className="text-xl font-bold text-slate-900">My Profile</h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => navigate("/settings")}
            className="p-2 hover:bg-slate-100 rounded-full transition-all"
          >
            <Settings size={20} className="text-slate-600" />
          </motion.button>
        </div>
      </div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto px-4 py-12"
      >
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          {/* Header Gradient Background */}
          <div className="h-48 bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-500 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-6 right-8 text-white/30">
                <Zap size={120} />
              </div>
            </div>
          </div>

          {/* Profile Info Section */}
          <div className="px-8 py-8 relative -mt-20">
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-end mb-8">
              {/* Avatar */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative"
              >
                <div className="w-40 h-40 rounded-3xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center border-6 border-white shadow-2xl text-white text-5xl font-bold">
                  {initials}
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => navigate("/edit-profile")}
                  className="absolute bottom-0 right-0 p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all"
                >
                  <Edit2 size={20} />
                </motion.button>
              </motion.div>

              {/* Info */}
              <div className="flex-1">
                <div className="mb-4">
                  <h1 className="text-4xl font-bold text-slate-900 mb-2">
                    {userData?.name || "User"}
                  </h1>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full font-bold text-sm">
                      {userData?.profession || "Service Seeker"}
                    </span>
                    <span className="px-4 py-2 bg-slate-100 text-slate-700 rounded-full font-medium text-sm">
                      {userData?.preferredCategory || "Home Maintenance"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-bold text-sm">
                      Premium Member
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-xl border border-slate-200">
                    <p className="text-slate-600 text-sm font-semibold mb-1">
                      Bookings
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                      {userData?.bookings || 12}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-xl border border-slate-200">
                    <p className="text-slate-600 text-sm font-semibold mb-1">
                      Rating
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                      {userData?.rating || 4.8}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-xl border border-slate-200">
                    <p className="text-slate-600 text-sm font-semibold mb-1">
                      Spent
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                      ₹{userData?.spent || "4.5K"}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-xl border border-slate-200">
                    <p className="text-slate-600 text-sm font-semibold mb-1">
                      Joined
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                      {userData?.joinedYear || 2024}
                    </p>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-slate-600 mb-6">
                  {userData?.bio ||
                    "Regular user looking for quality service providers. Always reliable and communicative."}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/workers")}
                    className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2"
                  >
                    <Star size={18} /> Browse Services
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="px-6 py-3 border-2 border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2"
                  >
                    <Share2 size={18} /> Share Profile
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 space-y-6"
          >
            {/* Personal Information */}
            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-lg">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Shield size={24} className="text-indigo-600" />
                Personal Information
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-slate-600 text-sm font-semibold mb-1">
                    Email
                  </p>
                  <p className="text-slate-900 font-medium flex items-center gap-2">
                    <Mail size={16} className="text-indigo-600" />
                    {userData?.email || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-600 text-sm font-semibold mb-1">
                    Phone
                  </p>
                  <p className="text-slate-900 font-medium flex items-center gap-2">
                    <Phone size={16} className="text-indigo-600" />
                    {userData?.phone || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-600 text-sm font-semibold mb-1">
                    Role
                  </p>
                  <p className="text-slate-900 font-medium">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                      Service User
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-lg">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Clock size={24} className="text-indigo-600" />
                Recent Bookings
              </h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">
                        Plumbing Service
                      </p>
                      <p className="text-sm text-slate-600">
                        Completed on Apr 15, 2026
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">₹500</p>
                      <div className="flex items-center gap-1">
                        <Star
                          size={14}
                          className="fill-amber-400 text-amber-400"
                        />
                        <span className="text-sm font-semibold">4.9</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <motion.button
                whileHover={{ x: 4 }}
                className="w-full mt-4 py-3 border-2 border-indigo-600 text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-all"
              >
                View All Bookings
              </motion.button>
            </div>
          </motion.div>

          {/* Right Column - Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Account Settings */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-lg sticky top-32">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Account</h3>
              <div className="space-y-2">
                <motion.button
                  whileHover={{ x: 4 }}
                  onClick={() => navigate("/edit-profile")}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-indigo-50 text-slate-700 font-semibold flex items-center gap-2 transition-all"
                >
                  <Edit2 size={18} className="text-indigo-600" />
                  Edit Profile
                </motion.button>
                <motion.button
                  whileHover={{ x: 4 }}
                  onClick={() => navigate("/saved")}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-indigo-50 text-slate-700 font-semibold flex items-center gap-2 transition-all"
                >
                  <Heart size={18} className="text-indigo-600" />
                  Saved Services
                </motion.button>
                <motion.button
                  whileHover={{ x: 4 }}
                  onClick={() => navigate("/settings")}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-indigo-50 text-slate-700 font-semibold flex items-center gap-2 transition-all"
                >
                  <Settings size={18} className="text-indigo-600" />
                  Settings
                </motion.button>
              </div>
            </div>

            {/* Trust & Safety */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 shadow-lg">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Award size={20} className="text-indigo-600" />
                Trust Score
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-700">
                      Profile Complete
                    </span>
                    <span className="text-sm font-bold text-indigo-600">
                      100%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <motion.div
                      animate={{ width: "100%" }}
                      className="bg-gradient-to-r from-indigo-500 to-blue-500 h-full"
                    />
                  </div>
                </div>
                <p className="text-sm text-slate-600">
                  You're a trusted member!
                </p>
              </div>
            </div>

            {/* Logout */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-bold rounded-xl hover:from-rose-600 hover:to-rose-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  <LogOut size={20} />
                  Logout
                </>
              )}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
