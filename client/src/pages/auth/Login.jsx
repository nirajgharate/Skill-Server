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
    <div className="relative p-1 bg-slate-100/60 dark:bg-slate-950/60 backdrop-blur-sm rounded-3xl border border-slate-200/70 dark:border-slate-800/80 flex items-center w-full mb-8 shadow-sm theme-transition">
      {["user", "worker"].map((option) => {
        const isActive = role === option;
        return (
          <button
            key={option}
            onClick={() => setRole(option)}
            type="button"
            className={`relative flex-1 px-4 py-4 z-10 text-left transition-all duration-300 rounded-3xl border cursor-pointer ${isActive ? "border-indigo-300 dark:border-indigo-850 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 shadow-sm" : "border-transparent bg-transparent text-slate-550 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"}`}
          >
            <span
              className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${isActive ? "text-indigo-700 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500"}`}
            >
              {option}
            </span>
            {isActive && (
              <span className="absolute right-4 top-4 rounded-full bg-indigo-600 dark:bg-indigo-600 px-2 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-white">
                Selected
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] dark:bg-[#0A0F1D] flex items-center justify-center p-6 relative overflow-hidden font-sans transition-colors duration-500">
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/5 dark:bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none animate-float" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-slate-450/5 dark:bg-violet-650/10 rounded-full blur-[120px] pointer-events-none animate-float-reverse" />

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:flex flex-col space-y-12 p-8"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-600 dark:bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg dark:shadow-none">
                <Wrench className="text-white" size={24} />
              </div>
              <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">
                Synapthire
              </span>
            </div>
            <h1 className="text-5xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tighter transition-colors">
              Your trusted network <br />
              for <span className="text-indigo-600 dark:text-indigo-400">local expertise.</span>
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-md transition-colors">
              Securely access your account to manage bookings, track earnings,
              and connect with top-tier professionals.
            </p>
          </div>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="text-indigo-600 dark:text-indigo-400 mt-0.5" size={20} />
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white transition-colors">
                  Verified Professionals
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors">
                  Every worker passes a strict background check.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle2 className="text-indigo-600 dark:text-indigo-400 mt-0.5" size={20} />
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white transition-colors">Secure Payments</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors">
                  Escrow-backed transactions for total peace of mind.
                </p>
              </div>
            </div>
          </div>
         
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-10 md:p-12 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] border border-slate-100 dark:border-slate-800 theme-transition">
            <div className="text-center mb-8 space-y-2">
              <motion.h2
                key={role}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-black text-slate-900 dark:text-white tracking-tight capitalize transition-colors"
              >
                Login as {role}
              </motion.h2>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest transition-colors">
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
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors">
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 rounded-2xl outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-400/10 transition-all font-medium text-slate-900 dark:text-slate-200 placeholder:text-slate-350 dark:placeholder:text-slate-650"
                />
              </div>

              <div className="space-y-1.5 group">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-[9px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 cursor-pointer"
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
                    className="w-full pl-5 pr-12 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 rounded-2xl outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-400/10 transition-all font-medium text-slate-900 dark:text-slate-200 placeholder:text-slate-350 dark:placeholder:text-slate-650"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-350 cursor-pointer"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <motion.button
                disabled={loading}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-5 bg-slate-900 dark:bg-indigo-600 text-white dark:text-slate-100 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-slate-200 dark:shadow-none hover:bg-indigo-600 dark:hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 cursor-pointer"
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

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center flex flex-col items-center gap-4">
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest transition-colors">
                No account?{" "}
                <Link
                  to="/signup"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline underline-offset-4 ml-1"
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
