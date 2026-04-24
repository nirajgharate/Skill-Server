import React from 'react';

export default function ProfileActivity() {
  const activities = [
    { event: 'Review Submitted', desc: 'Rated Sunil V. 5 stars', time: '2h ago' },
    { event: 'Payment Success', desc: 'Paid ₹450 for Plumbing', time: '1d ago' },
    { event: 'Account Secure', desc: 'Mobile number verified', time: '3d ago' },
  ];

  return (
    <div className="bg-white/60 backdrop-blur-xl border border-white rounded-[2.5rem] p-8 shadow-sm">
      <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">Account Activity</h3>
      <div className="space-y-8 relative">
        <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-100" />
        {activities.map((act, i) => (
          <div key={i} className="flex gap-6 relative z-10">
            <div className="w-4 h-4 rounded-full bg-indigo-500 border-4 border-white shadow-sm mt-1" />
            <div className="space-y-1">
              <p className="text-xs font-black text-slate-900 tracking-tight">{act.event}</p>
              <p className="text-[10px] font-medium text-slate-500 leading-relaxed">{act.desc}</p>
              <p className="text-[9px] font-bold text-slate-300 uppercase">{act.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}