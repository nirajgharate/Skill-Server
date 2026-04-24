import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, MessageSquare, Phone } from 'lucide-react';

export default function ActiveJobCard({ clientName, service, price, location, time }) {
  return (
    <div className="p-10 bg-slate-900 rounded-[3rem] text-white relative overflow-hidden group">
      <div className="relative z-10 space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-2xl font-black tracking-tight">{clientName}</h4>
            <p className="text-slate-400 text-sm font-medium mt-1">{service}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black text-indigo-400">₹{price}</p>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 mt-1">Estimated Payout</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-[11px] font-bold text-slate-300">
          <span className="flex items-center gap-2 bg-white/10 px-5 py-2.5 rounded-2xl backdrop-blur-md border border-white/5">
            <MapPin size={14} className="text-indigo-400"/> {location}
          </span>
          <span className="flex items-center gap-2 bg-white/10 px-5 py-2.5 rounded-2xl backdrop-blur-md border border-white/5">
            <Clock size={14} className="text-indigo-400"/> {time}
          </span>
        </div>

        <div className="flex gap-4 pt-2">
          <motion.button 
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="flex-1 py-4 bg-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-900/20"
          >
            Start Job
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="w-14 h-14 flex items-center justify-center bg-white/10 border border-white/10 rounded-2xl hover:bg-white/20 transition-all"
          >
            <MessageSquare size={20} />
          </motion.button>
        </div>
      </div>

      {/* 🎬 Silicon Valley Motion: Subtle background glow that reacts to hover */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] -mr-40 -mt-40 group-hover:bg-indigo-500/20 transition-colors duration-700" />
    </div>
  );
}