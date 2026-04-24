import React from 'react';
import { Wrench, Award, CheckCircle } from 'lucide-react';

export default function ProfileServices() {
  const skills = ["Industrial Wiring", "AC Installation", "Phase Checking", "Smart Home Setup"];
  
  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white rounded-[2.5rem] p-10 shadow-sm space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Specializations</h3>
        <button className="text-[10px] font-black text-indigo-600 uppercase underline underline-offset-4">Manage Skills</button>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {skills.map(skill => (
          <span key={skill} className="px-5 py-3 bg-indigo-50/50 border border-indigo-100 text-indigo-600 text-[11px] font-black uppercase tracking-tight rounded-2xl hover:bg-indigo-600 hover:text-white transition-all cursor-default">
            {skill}
          </span>
        ))}
      </div>

      <div className="pt-8 border-t border-slate-50 flex items-center gap-4">
        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><Award size={24}/></div>
        <div>
          <p className="text-xs font-black text-slate-900 uppercase">Licensed Master Pro</p>
          <p className="text-[10px] font-medium text-slate-400">Verified by SkillServer Safety Council</p>
        </div>
      </div>
    </div>
  );
}