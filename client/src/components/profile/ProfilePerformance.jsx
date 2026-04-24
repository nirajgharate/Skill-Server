import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Target, XCircle, Smile } from 'lucide-react';

export default function ProfilePerformance() {
  const metrics = [
    { label: 'Acceptance Rate', value: '98%', icon: Zap, color: 'bg-indigo-500' },
    { label: 'Completion Rate', value: '100%', icon: Target, color: 'bg-emerald-500' },
    { label: 'Cancellations', value: '0.2%', icon: XCircle, color: 'bg-rose-500' },
    { label: 'CSAT Score', value: '4.95', icon: Smile, color: 'bg-amber-500' },
  ];

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white rounded-[2.5rem] p-10 shadow-sm space-y-8">
      <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">System Performance</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {metrics.map((m, i) => (
          <div key={i} className="space-y-3">
            <div className="flex justify-between items-end">
              <div className="flex items-center gap-2">
                <m.icon size={14} className="text-slate-400" />
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">{m.label}</span>
              </div>
              <span className="text-sm font-black text-slate-900">{m.value}</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
               <motion.div initial={{ width: 0 }} animate={{ width: m.value }} className={`h-full ${m.color}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}