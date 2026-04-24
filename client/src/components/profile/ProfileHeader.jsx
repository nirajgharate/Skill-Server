import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Camera,
  Star,
  Briefcase,
  Zap,
  Clock,
  User,
} from "lucide-react";
import { useSocket } from "../../hooks/useSocket";

export default function ProfileHeader() {
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Niraj",
  );
  const fileInputRef = useRef(null);
  const { registerUser, on, off } = useSocket();

  useEffect(() => {
    const stored = localStorage.getItem("skillserverUser");
    if (stored) {
      const userData = JSON.parse(stored);
      setUser(userData);

      // Register with Socket.io
      registerUser(userData._id, userData.role);

      // Listen for real-time updates
      const handleWorkerUpdate = (data) => {
        console.log("📡 Worker update received:", data);
        if (data.worker?._id === userData._id) {
          // Update local state
          setUser((prev) => ({
            ...prev,
            ...data.worker,
          }));

          // Update localStorage
          localStorage.setItem(
            "skillserverUser",
            JSON.stringify({
              ...userData,
              ...data.worker,
            }),
          );
        }
      };

      const handleUserUpdate = (data) => {
        console.log("📡 User update received:", data);
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

      on("worker_updated", handleWorkerUpdate);
      on("user_profile_updated", handleUserUpdate);

      return () => {
        off("worker_updated", handleWorkerUpdate);
        off("user_profile_updated", handleUserUpdate);
      };
    }
  }, [registerUser, on, off]);

  if (!user) return null;

  const isWorker = user.role === "worker";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/70 backdrop-blur-2xl border border-white rounded-[2.5rem] p-8 md:p-10 shadow-sm relative overflow-hidden"
    >
      <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
        <div className="relative">
          <div
            className={`w-32 h-32 rounded-[2.5rem] ${isWorker ? "bg-indigo-600" : "bg-gradient-to-tr from-indigo-500 to-purple-400"} p-1 shadow-2xl overflow-hidden group/photo`}
          >
            <div className="relative w-full h-full rounded-[2.2rem] bg-white overflow-hidden">
              <img
                src={avatar}
                className="w-full h-full object-cover"
                alt="Profile"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-opacity text-white"
              >
                <Camera size={20} />
              </button>
            </div>
          </div>
          {/* Online status for workers only */}
          {isWorker && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white bg-emerald-500 shadow-sm" />
          )}
        </div>

        <div className="flex-1 text-center md:text-left space-y-3">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
              {user.name}
            </h1>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100">
              <ShieldCheck size={14} />
              <span className="text-[9px] font-black uppercase tracking-widest">
                {isWorker ? "Verified Pro" : "Verified Member"}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center md:justify-start text-slate-400 font-bold text-[11px] uppercase tracking-widest">
            {isWorker ? (
              <>
                <span className="flex items-center gap-1.5 text-indigo-600">
                  <Briefcase size={14} /> Professional Expert
                </span>
                <span className="flex items-center gap-1.5">
                  <Star size={14} className="text-amber-400 fill-amber-400" />{" "}
                  4.9 Rating
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} /> 15m Response
                </span>
              </>
            ) : (
              <>
                <span className="flex items-center gap-1.5 text-indigo-600">
                  <User size={14} /> Premium Account
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap size={14} className="text-amber-400 fill-amber-400" />{" "}
                  1,250 Points
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
      />
    </motion.div>
  );
}
