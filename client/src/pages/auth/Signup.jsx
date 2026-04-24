import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Wrench,
  CheckCircle2,
  MapPin,
  Lock,
  User,
  Loader2,
  Briefcase,
  DollarSign,
  Camera,
  X as XIcon,
} from "lucide-react";
import authService from "../../services/auth.service";
import { useAuth } from "../../hooks/useAuth";

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [role, setRole] = useState("user");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- FORM STATES ---
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    experienceYears: 0,
    serviceArea: "",
    profession: "electrician",
    hourlyRate: 0,
    bio: "",
    profilePhoto: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // PHOTO UPLOAD HANDLER
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePhoto: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignupComplete = async () => {
    setLoading(true);
    setError("");
    try {
      let data;
      if (role === "user") {
        data = await authService.signupUser(formData);
      } else {
        data = await authService.signupWorker({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          profession: formData.profession,
          experienceYears: parseInt(formData.experienceYears),
          serviceArea: formData.serviceArea,
          hourlyRate: parseInt(formData.hourlyRate),
          bio: formData.bio,
        });
      }

      // Update AuthContext with the new user data
      signup({
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        token: data.token,
        profileCompletionPercentage: data.profileCompletionPercentage,
      });

      navigate(
        data.role === "worker" ? "/worker-dashboard" : "/user-dashboard",
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Signup failed. Please try again.",
      );
      setStep(1); // Go back to show error
    } finally {
      setLoading(false);
    }
  };

  const RoleSelector = () => (
    <div className="relative p-1 bg-slate-100/50 backdrop-blur-sm rounded-2xl border border-slate-200/50 flex items-center w-full mb-8">
      {["user", "worker"].map((option) => {
        const isActive = role === option;
        return (
          <button
            key={option}
            onClick={() => setRole(option)}
            type="button"
            className="relative flex-1 py-3 z-10 transition-colors duration-300 outline-none"
          >
            <span
              className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${isActive ? "text-indigo-600" : "text-slate-400"}`}
            >
              {option}
            </span>
            {isActive && (
              <motion.div
                layoutId="signupActivePill"
                className="absolute inset-0 bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-slate-100/50"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-slate-400/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:flex flex-col space-y-12 p-8"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200/50">
                <Wrench className="text-white" size={24} />
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                SkillServer
              </span>
            </div>
            <h1 className="text-5xl font-black text-slate-900 leading-[1.1] tracking-tighter">
              Join the <br />
              <span className="text-indigo-600">premium network.</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium max-w-md">
              The most trusted platform for connecting skilled professionals
              with local opportunities.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="bg-white/80 backdrop-blur-xl p-10 md:p-12 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 min-h-[600px] flex flex-col">
            <div className="text-center mb-6 space-y-2">
              <motion.h2
                key={role}
                className="text-3xl font-black text-slate-900 tracking-tight capitalize"
              >
                Create {role} Account
              </motion.h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Step {step} of {role === "worker" ? 3 : 2}
              </p>
              {/* Progress bar */}
              <div className="w-full h-1 bg-slate-200 rounded-full mt-4 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(step / (role === "worker" ? 3 : 2)) * 100}%`,
                  }}
                  className="h-full bg-indigo-600"
                />
              </div>
            </div>

            {error && (
              <p className="text-[10px] text-rose-500 font-black uppercase tracking-widest mb-4 text-center">
                {error}
              </p>
            )}

            {step === 1 && <RoleSelector />}

            <div className="flex-1">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="s1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="space-y-1.5 group">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <User
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                          size={16}
                        />
                        <input
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Niraj Kumar"
                          className="w-full pl-11 py-4 bg-slate-50 border border-slate-200/60 rounded-2xl outline-none focus:border-indigo-500 transition-all font-medium text-slate-900"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5 group">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                        Email
                      </label>
                      <input
                        name="email"
                        required
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="name@email.com"
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200/60 rounded-2xl outline-none focus:border-indigo-500 transition-all font-medium text-slate-900"
                      />
                    </div>
                    <div className="space-y-1.5 group">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                        Mobile Number
                      </label>
                      <input
                        name="phone"
                        required
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91..."
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200/60 rounded-2xl outline-none focus:border-indigo-500 transition-all font-medium text-slate-900"
                      />
                    </div>
                    <div className="space-y-1.5 group">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                        Password
                      </label>
                      <div className="relative">
                        <Lock
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                          size={16}
                        />
                        <input
                          name="password"
                          required
                          type="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="••••••••"
                          className="w-full pl-11 py-4 bg-slate-50 border border-slate-200/60 rounded-2xl outline-none focus:border-indigo-500 transition-all font-medium text-slate-900"
                        />
                      </div>
                    </div>
                    <motion.button
                      onClick={() => setStep(2)}
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full mt-4 py-5 bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-2"
                    >
                      Continue <ArrowRight size={16} />
                    </motion.button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="s2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4 pt-2"
                  >
                    <div className="space-y-1.5 group">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                        City / Area
                      </label>
                      <div className="relative">
                        <MapPin
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                          size={16}
                        />
                        <input
                          name="serviceArea"
                          value={formData.serviceArea}
                          onChange={handleInputChange}
                          placeholder="e.g. Mumbai"
                          className="w-full pl-11 py-4 bg-slate-50 border border-slate-200/60 rounded-2xl outline-none focus:border-indigo-500 transition-all font-medium text-slate-900"
                        />
                      </div>
                    </div>

                    {role === "worker" && (
                      <div className="space-y-1.5 group">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                          Experience (Years)
                        </label>
                        <input
                          name="experienceYears"
                          type="number"
                          value={formData.experienceYears}
                          onChange={handleInputChange}
                          placeholder="e.g. 5"
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-200/60 rounded-2xl outline-none focus:border-indigo-500 transition-all font-medium text-slate-900"
                        />
                      </div>
                    )}

                    <motion.button
                      onClick={() => setStep(role === "worker" ? 3 : 3)}
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full mt-4 py-5 bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-2"
                    >
                      Continue <ArrowRight size={16} />
                    </motion.button>
                    <div className="text-center pt-2">
                      <button
                        onClick={() => setStep(1)}
                        className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600"
                      >
                        Back to details
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && role === "worker" && (
                  <motion.div
                    key="s3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4 pt-2"
                  >
                    <div className="space-y-1.5 group">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                        Profession
                      </label>
                      <div className="relative">
                        <Briefcase
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                          size={16}
                        />
                        <select
                          name="profession"
                          value={formData.profession}
                          onChange={handleInputChange}
                          className="w-full pl-11 py-4 bg-slate-50 border border-slate-200/60 rounded-2xl outline-none focus:border-indigo-500 transition-all font-medium text-slate-900"
                        >
                          <option value="electrician">Electrician</option>
                          <option value="plumber">Plumber</option>
                          <option value="carpenter">Carpenter</option>
                          <option value="cleaner">Cleaner</option>
                          <option value="painter">Painter</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5 group">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                        Hourly Rate (₹)
                      </label>
                      <div className="relative">
                        <DollarSign
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                          size={16}
                        />
                        <input
                          name="hourlyRate"
                          type="number"
                          value={formData.hourlyRate}
                          onChange={handleInputChange}
                          placeholder="e.g. 500"
                          className="w-full pl-11 py-4 bg-slate-50 border border-slate-200/60 rounded-2xl outline-none focus:border-indigo-500 transition-all font-medium text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 group">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                        Brief Bio
                      </label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        placeholder="Tell clients about yourself..."
                        rows="2"
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200/60 rounded-2xl outline-none focus:border-indigo-500 transition-all font-medium text-slate-900 resize-none text-sm"
                      />
                    </div>

                    {/* PROFILE PHOTO UPLOAD */}
                    <div className="space-y-1.5 group">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                        Profile Photo
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                          id="photo-input"
                        />
                        {formData.profilePhoto ? (
                          <label
                            htmlFor="photo-input"
                            className="block relative cursor-pointer"
                          >
                            <motion.div
                              className="relative w-full h-48 bg-slate-100 rounded-2xl overflow-hidden border-2 border-indigo-500 flex items-center justify-center group"
                              whileHover={{ scale: 1.02 }}
                            >
                              <img
                                src={formData.profilePhoto}
                                alt="Profile"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                                <Camera size={20} className="text-white" />
                                <span className="text-white text-xs font-bold">
                                  Change Photo
                                </span>
                              </div>
                            </motion.div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setFormData({
                                  ...formData,
                                  profilePhoto: "",
                                });
                              }}
                              className="absolute top-2 right-2 bg-rose-500 text-white p-1 rounded-full hover:bg-rose-600 transition-all"
                            >
                              <XIcon size={16} />
                            </button>
                          </label>
                        ) : (
                          <label
                            htmlFor="photo-input"
                            className="flex items-center justify-center w-full h-40 px-5 py-4 bg-slate-50/50 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/30 transition-all group"
                          >
                            <div className="text-center">
                              <Camera
                                className="mx-auto mb-2 text-slate-400 group-hover:text-indigo-500 transition-all"
                                size={24}
                              />
                              <p className="text-[10px] font-bold text-slate-600 group-hover:text-indigo-600 uppercase tracking-widest">
                                Click to upload photo
                              </p>
                              <p className="text-[8px] text-slate-400 mt-1">
                                JPG, PNG max 5MB
                              </p>
                            </div>
                          </label>
                        )}
                      </div>
                    </div>

                    <motion.button
                      onClick={handleSignupComplete}
                      disabled={loading}
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-5 bg-indigo-600 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <>
                          <CheckCircle2 size={16} /> Complete Registration
                        </>
                      )}
                    </motion.button>
                    <div className="text-center pt-2">
                      <button
                        onClick={() => setStep(2)}
                        className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600"
                      >
                        Back to location
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && role === "user" && (
                  <motion.div
                    key="s2user"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4 pt-2"
                  >
                    <motion.button
                      onClick={handleSignupComplete}
                      disabled={loading}
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-5 bg-indigo-600 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <>
                          <CheckCircle2 size={16} /> Complete Registration
                        </>
                      )}
                    </motion.button>
                    <div className="text-center pt-2">
                      <button
                        onClick={() => setStep(2)}
                        className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600"
                      >
                        Back to location
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="text-center mt-6 text-[10px] text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-black text-indigo-600 hover:underline"
              >
                Login
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
