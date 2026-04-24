import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Radar, ShieldCheck, Zap } from 'lucide-react';

export default function BookingSearch() {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate finding a worker after 4 seconds
    const timer = setTimeout(() => {
      navigate('/track');
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-12">
        {/* Pulsing Radar Rings */}
        {[1, 2, 3].map((ring) => (
          <motion.div
            key={ring}
            initial={{ opacity: 0.5, scale: 1 }}
            animate={{ opacity: 0, scale: 2.5 }}
            transition={{ repeat: Infinity, duration: 2, delay: ring * 0.4 }}
            className="absolute inset-0 border-2 border-indigo-500 rounded-full"
          />
        ))}
        <div className="relative bg-white p-8 rounded-full shadow-2xl border border-indigo-50">
          <Radar className="text-indigo-600 animate-spin-slow" size={48} />
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Finding the best Pro...</h2>
        <p className="text-slate-500 font-medium">Contacting 5 verified electricians near Sector 45</p>
        
        <div className="flex justify-center gap-6 pt-8">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <ShieldCheck size={14} className="text-emerald-500" /> Identity Verified
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <Zap size={14} className="text-amber-500" /> Instant Match
          </div>
        </div>
      </motion.div>
    </div>
  );
}