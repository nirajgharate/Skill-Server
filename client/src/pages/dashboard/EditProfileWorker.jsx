import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Upload,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  Award,
  Save,
} from "lucide-react";
import API from "../../api/api";

const EXPERTISE_SUGGESTIONS = {
  electrician: [
    "Wiring Installation",
    "Circuit Breaker Repair",
    "LED Fixture Installation",
    "Power Outlet Installation",
    "Electrical Troubleshooting",
  ],
  plumber: [
    "Pipe Installation",
    "Leak Repair",
    "Drain Cleaning",
    "Water Heater Installation",
    "Faucet Replacement",
  ],
  carpenter: [
    "Furniture Assembly",
    "Door Installation",
    "Cabinet Making",
    "Wood Cutting",
    "Shelf Installation",
  ],
  painter: [
    "Interior Painting",
    "Exterior Painting",
    "Wall Texture",
    "Epoxy Coating",
    "Waterproofing",
  ],
};

export default function EditProfileWorker({ worker, onClose, onSave }) {
  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({
    name: worker?.name || "",
    email: worker?.email || "",
    phone: worker?.phone || "",
    gender: worker?.gender || "not-specified",
    profession: worker?.profession || "",
    serviceArea: worker?.serviceArea || "",
    experienceYears: worker?.experienceYears || 0,
    hourlyRate: worker?.hourlyRate || 0,
    bio: worker?.bio || "",
    skills: worker?.skills || [],
    coreExpertise: worker?.coreExpertise || [],
    portfolio: worker?.portfolio || [],
    upiId: worker?.upiId || "",
  });

  const handleFieldChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setMessage(null);
  };

  const addSkill = (skill) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData({ ...formData, skills: [...formData.skills, skill] });
    }
  };

  const removeSkill = (skill) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skill),
    });
  };

  const addExpertise = (exp) => {
    if (exp && !formData.coreExpertise.includes(exp)) {
      setFormData({
        ...formData,
        coreExpertise: [...formData.coreExpertise, exp],
      });
    }
  };

  const removeExpertise = (exp) => {
    setFormData({
      ...formData,
      coreExpertise: formData.coreExpertise.filter((e) => e !== exp),
    });
  };

  const handlePortfolioUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          portfolio: [
            ...formData.portfolio,
            {
              id: Date.now(),
              type: file.type.startsWith("image") ? "image" : "video",
              url: reader.result,
              name: file.name,
            },
          ],
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removePortfolioItem = (id) => {
    setFormData({
      ...formData,
      portfolio: formData.portfolio.filter((item) => item.id !== id),
    });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      setMessage({ type: "error", text: "⚠️ Please fill all required fields" });
      return;
    }

    if (!formData.upiId || formData.upiId.trim() === "") {
      setMessage({
        type: "error",
        text: "⚠️ UPI ID is mandatory to receive payments.",
      });
      return;
    }

    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z]{2,}$/;
    if (!upiRegex.test(formData.upiId)) {
      setMessage({
        type: "error",
        text: "⚠️ Invalid UPI ID format! Use name@upi",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await API.put(`/workers/${worker._id}`, formData);
      if (response.data.success) {
        setMessage({
          type: "success",
          text: "✅ Profile updated successfully!",
        });
        setTimeout(() => {
          if (onSave) onSave(response.data.data);
          if (onClose) onClose();
        }, 1500);
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update profile",
      });
    } finally {
      setLoading(false);
    }
  };

  const expertiseSuggestions =
    EXPERTISE_SUGGESTIONS[formData.profession?.toLowerCase()] || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-6 flex items-center justify-between border-b border-indigo-200">
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            <Award size={28} />
            Edit Professional Profile
          </h2>
          <motion.button
            whileHover={{ rotate: 90 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="p-2.5 hover:bg-white/20 rounded-lg transition-all"
          >
            <X size={24} className="text-white" />
          </motion.button>
        </div>

        <div className="flex gap-0 border-b border-slate-200 bg-slate-50 sticky top-20 z-10">
          {[
            { id: "basic", label: "📋 Basic Info" },
            { id: "expertise", label: "🎯 Expertise" },
            { id: "portfolio", label: "📸 Portfolio" },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-6 py-4 font-bold text-sm uppercase tracking-widest transition-all border-b-2 ${
                activeTab === tab.id
                  ? "border-indigo-600 text-indigo-600 bg-white"
                  : "border-transparent text-slate-600 hover:text-indigo-600"
              }`}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>

        <div className="overflow-y-auto flex-1">
          <div className="p-8 space-y-8">
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg flex items-center gap-3 ${
                  message.type === "success"
                    ? "bg-emerald-50 border border-emerald-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                {message.type === "success" ? (
                  <Check size={20} className="text-emerald-600 flex-shrink-0" />
                ) : (
                  <AlertCircle
                    size={20}
                    className="text-red-600 flex-shrink-0"
                  />
                )}
                <p
                  className={`text-sm font-semibold ${message.type === "success" ? "text-emerald-700" : "text-red-700"}`}
                >
                  {message.text}
                </p>
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {activeTab === "basic" && (
                <motion.div
                  key="basic"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        👤 Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          handleFieldChange("name", e.target.value)
                        }
                        className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-indigo-500 outline-none"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        👥 Gender
                      </label>
                      <select
                        value={formData.gender}
                        onChange={(e) =>
                          handleFieldChange("gender", e.target.value)
                        }
                        className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-indigo-500 outline-none"
                      >
                        <option value="not-specified">Not Specified</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        ✉️ Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleFieldChange("email", e.target.value)
                        }
                        className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-indigo-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        📱 Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          handleFieldChange("phone", e.target.value)
                        }
                        className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        🛠️ Profession
                      </label>
                      <select
                        value={formData.profession}
                        onChange={(e) =>
                          handleFieldChange("profession", e.target.value)
                        }
                        className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-indigo-500 outline-none"
                      >
                        <option value="">Select</option>
                        <option value="electrician">Electrician</option>
                        <option value="plumber">Plumber</option>
                        <option value="carpenter">Carpenter</option>
                        <option value="painter">Painter</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        📍 Service Area
                      </label>
                      <input
                        type="text"
                        value={formData.serviceArea}
                        onChange={(e) =>
                          handleFieldChange("serviceArea", e.target.value)
                        }
                        className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        ⏰ Experience (years)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.experienceYears}
                        onChange={(e) =>
                          handleFieldChange(
                            "experienceYears",
                            parseInt(e.target.value) || 0,
                          )
                        }
                        className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-indigo-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        💰 Hourly Rate (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.hourlyRate}
                        onChange={(e) =>
                          handleFieldChange(
                            "hourlyRate",
                            parseInt(e.target.value) || 0,
                          )
                        }
                        className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      📝 Bio
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => handleFieldChange("bio", e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-indigo-500 outline-none"
                      rows="4"
                    />
                  </div>

                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-lg p-4">
                    <label className="block text-sm font-black text-amber-900 mb-3 flex items-center gap-2">
                      💳 UPI ID{" "}
                      <span className="px-2 py-1 bg-red-600 text-white text-[10px] font-black rounded">
                        REQUIRED
                      </span>
                    </label>
                    <input
                      type="text"
                      value={formData.upiId}
                      onChange={(e) =>
                        handleFieldChange("upiId", e.target.value)
                      }
                      placeholder="name@upi"
                      className="w-full px-4 py-3 rounded-lg border-2 border-amber-300 focus:border-amber-500 outline-none bg-white font-semibold"
                    />
                    <p className="text-[12px] font-semibold text-amber-800 mt-2">
                      ✓ Earnings sent directly to this UPI ID
                    </p>
                  </div>
                </motion.div>
              )}

              {activeTab === "expertise" && (
                <motion.div
                  key="expertise"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-4">
                      🎯 Core Expertise
                    </label>
                    <div className="space-y-3">
                      {expertiseSuggestions.map((exp) => (
                        <motion.button
                          key={exp}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() =>
                            formData.coreExpertise.includes(exp)
                              ? removeExpertise(exp)
                              : addExpertise(exp)
                          }
                          className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                            formData.coreExpertise.includes(exp)
                              ? "border-indigo-500 bg-indigo-50 text-indigo-700 font-semibold"
                              : "border-slate-200 hover:border-indigo-200"
                          }`}
                        >
                          {formData.coreExpertise.includes(exp) ? "✓ " : ""}
                          {exp}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-4">
                      🏆 Additional Skills
                    </label>
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        id="skillInput"
                        placeholder="Add a skill..."
                        className="flex-1 px-4 py-2 rounded-lg border-2 border-slate-200 focus:border-indigo-500 outline-none"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            addSkill(e.target.value);
                            e.target.value = "";
                          }
                        }}
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          const input = document.getElementById("skillInput");
                          addSkill(input.value);
                          input.value = "";
                        }}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all flex items-center gap-2"
                      >
                        <Plus size={18} /> Add
                      </motion.button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill) => (
                        <motion.div
                          key={skill}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold flex items-center gap-2"
                        >
                          {skill}
                          <button
                            onClick={() => removeSkill(skill)}
                            className="hover:text-indigo-900"
                          >
                            <X size={16} />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "portfolio" && (
                <motion.div
                  key="portfolio"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-4">
                      📸 Upload Portfolio
                    </label>
                    <div className="border-2 border-dashed border-indigo-300 rounded-lg p-8 text-center hover:border-indigo-500 transition-all cursor-pointer">
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handlePortfolioUpload}
                        className="hidden"
                        id="portfolioUpload"
                      />
                      <label
                        htmlFor="portfolioUpload"
                        className="cursor-pointer flex flex-col items-center gap-3"
                      >
                        <ImageIcon size={32} className="text-indigo-400" />
                        <p className="font-semibold text-slate-700">
                          Click to upload
                        </p>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-700 mb-4">
                      Portfolio Items ({formData.portfolio.length})
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      {formData.portfolio.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative group rounded-lg overflow-hidden bg-slate-100"
                        >
                          {item.type === "image" ? (
                            <img
                              src={item.url}
                              alt={item.name}
                              className="w-full h-40 object-cover"
                            />
                          ) : (
                            <video
                              src={item.url}
                              className="w-full h-40 object-cover"
                            />
                          )}
                          <motion.button
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                            onClick={() => removePortfolioItem(item.id)}
                            className="absolute inset-0 bg-black/50 flex items-center justify-center"
                          >
                            <Trash2 size={24} className="text-white" />
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-8 py-4 flex items-center justify-end gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="px-6 py-3 rounded-lg font-semibold text-slate-700 hover:bg-slate-200 transition-all"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save size={18} /> Save Changes
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
