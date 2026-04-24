import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Save,
  ArrowLeft,
  Briefcase,
  DollarSign,
  MapPin,
  Upload,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Camera,
  FileUp,
  X as XIcon,
  Zap,
  Award,
} from "lucide-react";
import workerService from "../../services/worker.service";
import { useAuth } from "../../hooks/useAuth";
import { useSocket } from "../../hooks/useSocket";

export default function WorkerProfileEdit() {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const { registerUser, on, off } = useSocket();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [profileUpdated, setProfileUpdated] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    profession: "electrician",
    experienceYears: 0,
    serviceArea: "",
    hourlyRate: 0,
    bio: "",
    skills: [],
    profilePhoto: "",
    aadharCard: "",
    panCard: "",
    degreeCertificate: "",
  });

  const [previewImages, setPreviewImages] = useState({
    profilePhoto: null,
    aadharCard: null,
    panCard: null,
    degreeCertificate: null,
  });

  useEffect(() => {
    if (authUser?._id) {
      // Register user with Socket.io
      registerUser(authUser._id, "worker");

      // Listen for profile updates
      const handleWorkerUpdate = (data) => {
        console.log("📡 Profile update received:", data);
        if (data.worker?._id === authUser._id) {
          setProfileUpdated(true);
          // Refresh profile data after update
          setTimeout(() => {
            fetchWorkerProfile();
          }, 500);
        }
      };

      on("worker_updated", handleWorkerUpdate);

      fetchWorkerProfile();

      return () => {
        off("worker_updated", handleWorkerUpdate);
      };
    }
  }, [authUser, registerUser, on, off]);

  const fetchWorkerProfile = async () => {
    try {
      setLoading(true);
      const data = await workerService.getWorkerProfile(authUser._id);
      setFormData({
        name: data.name || "",
        phone: data.phone || "",
        profession: data.profession || "electrician",
        experienceYears: data.experienceYears || 0,
        serviceArea: data.serviceArea || "",
        hourlyRate: data.hourlyRate || 0,
        bio: data.bio || "",
        skills: data.skills || [],
        profilePhoto: data.profilePhoto || "",
        aadharCard: data.aadharCard || "",
        panCard: data.panCard || "",
        degreeCertificate: data.degreeCertificate || "",
      });
      setPreviewImages({
        profilePhoto: data.profilePhoto || null,
        aadharCard: data.aadharCard || null,
        panCard: data.panCard || null,
        degreeCertificate: data.degreeCertificate || null,
      });
    } catch (err) {
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e, fieldName) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, [fieldName]: reader.result }));
        setPreviewImages((prev) => ({ ...prev, [fieldName]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (fieldName) => {
    setFormData((prev) => ({ ...prev, [fieldName]: "" }));
    setPreviewImages((prev) => ({ ...prev, [fieldName]: null }));
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (!formData.name || !formData.phone || !formData.profession) {
        setError("Please fill in all required fields");
        return;
      }

      if (!formData.aadharCard && !formData.panCard) {
        setError("Please upload either Aadhar Card or PAN Card");
        return;
      }

      const result = await workerService.updateWorkerProfile(
        authUser._id,
        formData,
      );

      // Show success message with detailed info
      setSuccess(
        `✅ Profile updated successfully! Completion: ${result.profileCompletion}%`,
      );
      setProfileUpdated(true);

      // Refresh the profile immediately
      setTimeout(() => {
        fetchWorkerProfile();
      }, 500);

      // Redirect after 2 seconds
      setTimeout(() => navigate("/worker-profile"), 2000);
    } catch (err) {
      setError(err.message || "Failed to save profile");
      console.error("Profile save error:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Loader2 size={48} className="animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 pt-32 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200/50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <motion.button
            onClick={() => navigate(-1)}
            whileHover={{ x: -4 }}
            className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-semibold transition-all"
          >
            <ArrowLeft size={20} /> Back
          </motion.button>
          <h2 className="text-xl font-bold text-slate-900">
            Edit Professional Profile
          </h2>
          <div className="w-20" />
        </div>
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4"
      >
        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
          >
            <AlertCircle className="text-red-600" size={20} />
            <p className="text-red-700 font-semibold">{error}</p>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3"
          >
            <CheckCircle2 className="text-emerald-600" size={20} />
            <p className="text-emerald-700 font-semibold">{success}</p>
          </motion.div>
        )}

        {/* Section 1: Basic Information */}
        <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-lg mb-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Briefcase size={24} className="text-indigo-600" />
            Basic Information
          </h3>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91..."
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Profession *
                </label>
                <select
                  name="profession"
                  value={formData.profession}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium"
                >
                  <option value="electrician">Electrician</option>
                  <option value="plumber">Plumber</option>
                  <option value="carpenter">Carpenter</option>
                  <option value="cleaner">Cleaner</option>
                  <option value="painter">Painter</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Service Area *
                </label>
                <input
                  type="text"
                  name="serviceArea"
                  value={formData.serviceArea}
                  onChange={handleInputChange}
                  placeholder="e.g., Mumbai, Bangalore"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Experience (Years) *
                </label>
                <input
                  type="number"
                  name="experienceYears"
                  value={formData.experienceYears}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Hourly Rate (₹) *
                </label>
                <input
                  type="number"
                  name="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={handleInputChange}
                  min="0"
                  placeholder="e.g., 500"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell clients about yourself..."
                rows="3"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium resize-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Profile Photo */}
        <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-lg mb-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Camera size={24} className="text-indigo-600" />
            Profile Photo
          </h3>
          <div className="space-y-4">
            {previewImages.profilePhoto ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative w-full"
              >
                <img
                  src={previewImages.profilePhoto}
                  alt="Profile Preview"
                  className="w-full h-64 object-cover rounded-lg border-2 border-indigo-500"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => handleRemoveImage("profilePhoto")}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <XIcon size={20} />
                </motion.button>
              </motion.div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-indigo-600 hover:bg-indigo-50 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Camera className="text-slate-400 mb-2" size={40} />
                  <p className="text-sm font-bold text-slate-600">
                    Click to upload profile photo
                  </p>
                  <p className="text-xs text-slate-400">JPG or PNG, max 5MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "profilePhoto")}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Section 3: ID Documents (Required) */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-8 border border-indigo-200 shadow-lg mb-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
            <Award size={24} className="text-indigo-600" />
            ID Documents (Required)
          </h3>
          <p className="text-sm text-slate-600 mb-6">
            Upload at least one government ID for verification
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Aadhar Card */}
            <div className="bg-white rounded-2xl p-6 border border-indigo-200">
              <h4 className="font-bold text-slate-900 mb-4">
                Aadhar Card (Optional)
              </h4>
              {previewImages.aadharCard ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="relative"
                >
                  <img
                    src={previewImages.aadharCard}
                    alt="Aadhar Preview"
                    className="w-full h-40 object-cover rounded-lg border-2 border-indigo-500"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => handleRemoveImage("aadharCard")}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <XIcon size={18} />
                  </motion.button>
                </motion.div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-indigo-300 rounded-lg cursor-pointer hover:border-indigo-600 hover:bg-indigo-50 transition-all">
                  <FileUp className="text-indigo-400 mb-2" size={32} />
                  <p className="text-xs font-bold text-indigo-700">
                    Upload Aadhar
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "aadharCard")}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* PAN Card */}
            <div className="bg-white rounded-2xl p-6 border border-indigo-200">
              <h4 className="font-bold text-slate-900 mb-4">
                PAN Card (Optional)
              </h4>
              {previewImages.panCard ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="relative"
                >
                  <img
                    src={previewImages.panCard}
                    alt="PAN Preview"
                    className="w-full h-40 object-cover rounded-lg border-2 border-indigo-500"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => handleRemoveImage("panCard")}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <XIcon size={18} />
                  </motion.button>
                </motion.div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-indigo-300 rounded-lg cursor-pointer hover:border-indigo-600 hover:bg-indigo-50 transition-all">
                  <FileUp className="text-indigo-400 mb-2" size={32} />
                  <p className="text-xs font-bold text-indigo-700">
                    Upload PAN
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "panCard")}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Section 4: Certificates (Optional) */}
        <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-lg mb-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
            <Zap size={24} className="text-indigo-600" />
            Professional Certificates (Optional)
          </h3>
          <p className="text-sm text-slate-600 mb-6">
            Upload your degree, diploma, or professional certifications
          </p>

          <div className="bg-slate-50 rounded-lg p-6">
            {previewImages.degreeCertificate ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative"
              >
                <img
                  src={previewImages.degreeCertificate}
                  alt="Degree Preview"
                  className="w-full h-48 object-cover rounded-lg border-2 border-indigo-500"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => handleRemoveImage("degreeCertificate")}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <XIcon size={20} />
                </motion.button>
              </motion.div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-indigo-600 hover:bg-indigo-50 transition-all">
                <FileUp className="text-slate-400 mb-2" size={40} />
                <p className="text-sm font-bold text-slate-600">
                  Upload degree or certificate
                </p>
                <p className="text-xs text-slate-400">PDF or Image, max 10MB</p>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => handleFileUpload(e, "degreeCertificate")}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSaveProfile}
          disabled={saving}
          className="w-full py-5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-lg"
        >
          {saving ? (
            <>
              <Loader2 size={24} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={24} />
              Save Profile
            </>
          )}
        </motion.button>
      </motion.div>
    </div>
  );
}
