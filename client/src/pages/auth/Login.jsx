import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Lock,
  MapPin,
  Zap,
  Eye,
  EyeOff,
  ArrowRight,
  Wrench,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { login: contextLogin } = useAuth();
  const [role, setRole] = useState("user");
  const [showPass, setShowPass] = useState(false);

  // --- LOGIC STATES ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Update AuthContext with the login data - this also stores to localStorage
      const data = await contextLogin(email, password);

      // Redirect based on actual role from backend
      if (data.role === "worker") {
        navigate("/worker-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid credentials. Please try again.",
      );
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
                layoutId="loginActivePill"
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
                Synapthire
              </span>
            </div>
            <h1 className="text-5xl font-black text-slate-900 leading-[1.1] tracking-tighter">
              Your trusted network <br />
              for <span className="text-indigo-600">local expertise.</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium max-w-md">
              Securely access your account to manage bookings, track earnings,
              and connect with top-tier professionals.
            </p>
          </div>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="text-indigo-600 mt-0.5" size={20} />
              <div>
                <h4 className="font-bold text-slate-900">
                  Verified Professionals
                </h4>
                <p className="text-sm text-slate-500">
                  Every worker passes a strict background check.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle2 className="text-indigo-600 mt-0.5" size={20} />
              <div>
                <h4 className="font-bold text-slate-900">Secure Payments</h4>
                <p className="text-sm text-slate-500">
                  Escrow-backed transactions for total peace of mind.
                </p>
              </div>
            </div>
          </div>
          <div className="w-full h-32 bg-slate-100 rounded-3xl border border-slate-200/50 flex items-center justify-center text-xs font-bold text-slate-400 uppercase tracking-widest">
            [ Abstract UI Illustration ]
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="bg-white/80 backdrop-blur-xl p-10 md:p-12 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
            <div className="text-center mb-8 space-y-2">
              <motion.h2
                key={role}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-black text-slate-900 tracking-tight capitalize"
              >
                Login as {role}
              </motion.h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Welcome back
              </p>
            </div>

            {error && (
              <p className="text-[10px] text-rose-500 font-black uppercase tracking-widest mb-4 text-center">
                {error}
              </p>
            )}

            <RoleSelector />

            <form className="space-y-5" onSubmit={handleLoginSubmit}>
              <div className="space-y-1.5 group">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-indigo-600 transition-colors">
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200/60 rounded-2xl outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-slate-900 placeholder:text-slate-300"
                />
              </div>

              <div className="space-y-1.5 group">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-[9px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <input
                    required
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-5 pr-12 py-4 bg-slate-50 border border-slate-200/60 rounded-2xl outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-slate-900 placeholder:text-slate-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <motion.button
                disabled={loading}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-5 bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-slate-200 hover:bg-indigo-600 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <>
                    <ArrowRight size={16} /> Continue
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center flex flex-col items-center gap-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                No account?{" "}
                <Link
                  to="/signup"
                  className="text-indigo-600 hover:underline underline-offset-4 ml-1"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
