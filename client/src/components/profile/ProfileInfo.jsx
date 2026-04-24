import React, { useState, useEffect } from "react";
import { Save, User, Mail, Phone, MapPin, Briefcase } from "lucide-react";
import { useSocket } from "../../hooks/useSocket";

export default function ProfileInfo() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { registerUser, on, off } = useSocket();

  useEffect(() => {
    const stored = localStorage.getItem("skillserverUser");
    if (stored) {
      const userData = JSON.parse(stored);
      setUser(userData);

      // Register with Socket.io
      registerUser(userData._id, userData.role);

      // Listen for real-time profile updates
      const handleWorkerUpdate = (data) => {
        console.log("📡 Worker info update received:", data);
        if (data.worker?._id === userData._id) {
          setUser((prev) => ({
            ...prev,
            ...data.worker,
          }));

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
        console.log("📡 User info update received:", data);
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
    <div className="bg-white/60 backdrop-blur-xl border border-white rounded-[2.5rem] p-10 shadow-sm">
      <div className="flex justify-between items-center mb-8 border-b border-slate-50 pb-4">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          {isWorker ? "Professional Details" : "Personal Details"}
        </h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline"
        >
          {isEditing ? "Cancel" : "Edit Settings"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Row 1 */}
        <div className="space-y-1">
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Display Name
          </label>
          <div className="relative">
            <User
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
              size={16}
            />
            <input
              type="text"
              defaultValue={user.name}
              disabled={!isEditing}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-5 py-3.5 text-sm font-bold outline-none focus:border-indigo-400 disabled:opacity-60 transition-all"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
            {isWorker ? "Category / Profession" : "Contact Number"}
          </label>
          <div className="relative">
            {isWorker ? (
              <Briefcase
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                size={16}
              />
            ) : (
              <Phone
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                size={16}
              />
            )}
            <input
              type="text"
              defaultValue={isWorker ? "Expert Electrician" : "+91 98765 43210"}
              disabled={!isEditing}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-5 py-3.5 text-sm font-bold outline-none focus:border-indigo-400 disabled:opacity-60 transition-all"
            />
          </div>
        </div>

        {/* Row 2 - Address */}
        <div className="md:col-span-2 space-y-1">
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Primary Location
          </label>
          <div className="relative">
            <MapPin
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
              size={16}
            />
            <input
              type="text"
              defaultValue="Sector 45, Gurugram, Haryana"
              disabled={!isEditing}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-5 py-3.5 text-sm font-bold outline-none focus:border-indigo-400 disabled:opacity-60 transition-all"
            />
          </div>
        </div>
      </div>

      {isEditing && (
        <button className="w-full mt-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-indigo-200 active:scale-95 transition-all">
          <Save size={16} /> Update Identity
        </button>
      )}
    </div>
  );
}
