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
    gender: "",
    useCurrentLocation: false,
    locationCoordinates: null,
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    setFormData((prev) => ({ ...prev, useCurrentLocation: true }));

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setFormData((prev) => ({
          ...prev,
          locationCoordinates: [longitude, latitude],
        }));

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
          );
          const data = await response.json();
          if (data?.display_name) {
            setFormData((prev) => ({
              ...prev,
              serviceArea: data.display_name,
            }));
          }
        } catch (err) {
          console.error("Reverse geocode error:", err);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setFormData((prev) => ({ ...prev, useCurrentLocation: false }));
        alert("Unable to detect location. Please enter your area manually.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    );
  };

  const handleSignupComplete = async () => {
    setLoading(true);
    setError("");
    try {
      let data;
      const locationPayload = formData.locationCoordinates
        ? {
            location: {
              type: "Point",
              coordinates: formData.locationCoordinates,
            },
          }
        : {};

      if (role === "user") {
        data = await authService.signupUser({
          ...formData,
          ...locationPayload,
        });
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
          gender: formData.gender || undefined,
          ...locationPayload,
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
    <div className="relative p-1 bg-slate-100/60 backdrop-blur-sm rounded-3xl border border-slate-200/70 flex items-center w-full mb-8 shadow-sm">
      {["user", "worker"].map((option) => {
        const isActive = role === option;
        return (
          <button
            key={option}
            onClick={() => setRole(option)}
            type="button"
            className={`relative flex-1 px-4 py-4 z-10 text-left transition-all duration-300 rounded-3xl border ${isActive ? "border-indigo-300 bg-indigo-50 text-indigo-700 shadow-sm" : "border-transparent bg-transparent text-slate-500 hover:bg-slate-50"}`}
          >
            <span
              className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${isActive ? "text-indigo-700" : "text-slate-400"}`}
            >
              {option}
            </span>
            {isActive && (
              <span className="absolute right-4 top-4 rounded-full bg-indigo-600 px-2 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-white">
                Selected
              </span>
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
                Synapthire
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
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <button
                          type="button"
                          onClick={getCurrentLocation}
                          className={`w-full md:w-auto px-4 py-3 rounded-2xl font-bold transition-all ${
                            formData.useCurrentLocation
                              ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                              : "bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100"
                          }`}
                        >
                          {formData.useCurrentLocation
                            ? "Current location enabled"
                            : "Use current location"}
                        </button>
                        {formData.locationCoordinates && (
                          <p className="text-[10px] text-slate-500 font-semibold">
                            Detected:{" "}
                            {formData.locationCoordinates[1].toFixed(4)},{" "}
                            {formData.locationCoordinates[0].toFixed(4)}
                          </p>
                        )}
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
                        Gender
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full pl-4 py-4 bg-slate-50 border border-slate-200/60 rounded-2xl outline-none focus:border-indigo-500 transition-all font-medium text-slate-900"
                      >
                        <option value="">Select gender (optional)</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
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
