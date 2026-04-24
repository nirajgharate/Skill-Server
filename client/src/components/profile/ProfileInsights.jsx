import React from 'react';
import { TrendingUp, Briefcase, IndianRupee, XCircle } from 'lucide-react';

export default function ProfileInsights() {
  const stats = [
    { label: 'Total Volume', value: '₹42,500', icon: IndianRupee, color: 'text-indigo-600' },
    { label: 'Bookings', value: '124', icon: Briefcase, color: 'text-blue-600' },
    { label: 'Success Rate', value: '98%', icon: TrendingUp, color: 'text-emerald-600' },
    { label: 'Cancellations', value: '2', icon: XCircle, color: 'text-rose-600' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white/60 backdrop-blur-xl border border-white rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all group">
          <div className={`w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center ${stat.color} mb-4 group-hover:scale-110 transition-transform`}>
            <stat.icon size={20} />
          </div>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
          <p className="text-xl font-black text-slate-900 tracking-tight">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}