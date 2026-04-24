import React from 'react';
import { Search, Heart, Headphones, Settings, Star } from 'lucide-react';

export default function ProfileQuickActions() {
  const actions = [
    { icon: Search, label: 'Book Pro', color: 'text-indigo-600 bg-indigo-50' },
    { icon: Heart, label: 'Favorites', color: 'text-rose-600 bg-rose-50' },
    { icon: Headphones, label: 'Support', color: 'text-blue-600 bg-blue-50' },
    { icon: Star, label: 'Rewards', color: 'text-amber-600 bg-amber-50' },
  ];

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white rounded-[2.5rem] p-8 shadow-sm">
      <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 px-2">Action Center</h3>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, i) => (
          <button key={i} className="flex flex-col items-center gap-3 p-5 rounded-[2rem] border border-slate-50 bg-white/40 hover:bg-white transition-all hover:shadow-lg active:scale-95 group">
            <div className={`p-4 rounded-2xl transition-transform group-hover:scale-110 ${action.color}`}>
              <action.icon size={20} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}