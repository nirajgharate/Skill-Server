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
import { useAuth } from "../../hooks/useAuth";
import { getAvatarUrl } from "../../utils/avatar.util";

export default function ProfileHeader() {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(authUser);
  const [avatar, setAvatar] = useState("");
  const fileInputRef = useRef(null);
  const { registerUser, on, off } = useSocket();

  const buildAvatarUrl = (userData) =>
    getAvatarUrl({
      profilePhoto: userData?.profilePhoto,
      avatarGender: userData?.avatarGender,
      gender: userData?.gender,
      name: userData?.name,
      id: userData?._id,
      fallbackSeed: userData?.name || userData?._id || "profile-avatar",
    });

  useEffect(() => {
    const currentUser =
      authUser || JSON.parse(localStorage.getItem("skillserverUser") || "null");
    if (!currentUser) return;

    setUser(currentUser);
    setAvatar(buildAvatarUrl(currentUser));

    registerUser(currentUser._id, currentUser.role);

    const handleWorkerUpdate = (data) => {
      console.log("📡 Worker update received:", data);
      if (data.worker?._id === currentUser._id) {
        const updatedUser = {
          ...currentUser,
          ...data.worker,
        };

        setUser(updatedUser);
        setAvatar(buildAvatarUrl(updatedUser));
        localStorage.setItem("skillserverUser", JSON.stringify(updatedUser));
      }
    };

    const handleUserUpdate = (data) => {
      console.log("📡 User update received:", data);
      if (data.userId === currentUser._id) {
        const updatedUser = {
          ...currentUser,
          ...data.updates,
        };

        setUser(updatedUser);
        setAvatar(buildAvatarUrl(updatedUser));
        localStorage.setItem("skillserverUser", JSON.stringify(updatedUser));
      }
    };

    on("worker_updated", handleWorkerUpdate);
    on("user_profile_updated", handleUserUpdate);

    return () => {
      off("worker_updated", handleWorkerUpdate);
      off("user_profile_updated", handleUserUpdate);
    };
  }, [authUser, on, off, registerUser]);

  useEffect(() => {
    if (authUser) {
      setUser(authUser);
      setAvatar(buildAvatarUrl(authUser));
    }
  }, [authUser]);

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
