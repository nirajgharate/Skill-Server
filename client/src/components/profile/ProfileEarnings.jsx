import React from 'react';
import { IndianRupee, Wallet, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function ProfileEarnings() {
  const stats = [
    { label: 'Total Payout', value: '₹1.2L', icon: IndianRupee, color: 'text-indigo-600' },
    { label: 'This Month', value: '₹42,500', icon: Wallet, color: 'text-emerald-600' },
    { label: 'Pending', value: '₹4,200', icon: CheckCircle2, color: 'text-blue-600' },
    { label: 'Avg Job', value: '₹850', icon: TrendingUp, color: 'text-purple-600' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white/70 backdrop-blur-xl border border-white rounded-[2.5rem] p-6 shadow-sm group hover:scale-[1.02] transition-all">
          <div className={`w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center ${stat.color} mb-4 shadow-inner`}>
            <stat.icon size={20} />
          </div>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
          <p className="text-2xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}