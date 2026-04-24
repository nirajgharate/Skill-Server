import React from "react";
import { Lock, LogOut, ShieldCheck, Smartphone } from "lucide-react";

export default function ProfileSecurity() {
  return (
    <div className="bg-white/60 backdrop-blur-xl border border-white rounded-[2.5rem] p-8 shadow-sm space-y-6">
      <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
        Account Security
      </h3>

      <div className="space-y-4">
        <div className="flex justify-between items-center p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg text-indigo-600 shadow-sm">
              <Lock size={16} />
            </div>
            <span className="text-xs font-bold text-slate-700">
              Two-Factor Auth
            </span>
          </div>
          <div className="w-10 h-5 bg-emerald-500 rounded-full relative p-1 cursor-pointer">
            <div className="w-3 h-3 bg-white rounded-full absolute right-1" />
          </div>
        </div>

        <button className="w-full flex items-center justify-between p-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all group">
          <div className="flex items-center gap-3">
            <LogOut
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Logout All Devices
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
