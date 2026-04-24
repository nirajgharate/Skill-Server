import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, ShieldCheck, ArrowRight, X } from 'lucide-react';

export default function Hero() {
  const navigate = useNavigate();
  
  const [service, setService] = useState("");
  const [location, setLocation] = useState("");
  const [availability, setAvailability] = useState(42);

  useEffect(() => {
    const interval = setInterval(() => {
      setAvailability(prev => {
        const change = Math.floor(Math.random() * 5) - 2;
        return Math.max(24, Math.min(88, prev + change));
      });
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!service.trim() && !location.trim()) return;
    navigate(`/services?category=${encodeURIComponent(service)}&location=${encodeURIComponent(location)}`);
  };

  return (
    <div className="relative min-h-[95vh] flex items-center justify-center pt-32 pb-20 overflow-hidden bg-[#FDFDFD]">
      
      {/* 1. LAYERED BACKGROUND DEPTH */}
      <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[5%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* --- LEFT SIDE: CONTENT --- */}
        <div className="space-y-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 bg-indigo-50/50 backdrop-blur-md border border-indigo-100/30 rounded-full shadow-sm"
          >
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-indigo-600">
              {availability} Workers Online in your area
            </span>
          </motion.div>

          <div className="space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-black text-slate-900 leading-[0.95] tracking-tighter"
            >
              Book Trusted <br /> 
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
                Local Experts
              </span> <br />
              In Minutes.
            </motion.h1>
            <p className="text-lg text-slate-500 font-medium max-w-lg leading-relaxed">
              Synapthire connects you with verified professionals. 
              <span className="text-slate-900 font-bold block mt-2">Home Repairs • Electrical • Plumbering • Cleaning</span>
            </p>
          </div>

          {/* SMART SEARCH BAR */}
          <motion.form 
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-2 bg-white/60 backdrop-blur-2xl border border-white rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.06)] flex flex-col md:flex-row items-center gap-2 group transition-all hover:shadow-indigo-500/10"
          >
            <div className="flex-1 flex items-center px-4 gap-3 w-full border-b md:border-b-0 md:border-r border-slate-100/50 py-3 md:py-0 relative">
              <Search className="text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="What service?" 
                className="bg-transparent border-none outline-none w-full text-sm font-bold text-slate-700 placeholder:text-slate-300"
                value={service}
                onChange={(e) => setService(e.target.value)}
              />
            </div>
            <div className="flex-1 flex items-center px-4 gap-3 w-full py-3 md:py-0 relative">
              <MapPin className="text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="City" 
                className="bg-transparent border-none outline-none w-full text-sm font-bold text-slate-700 placeholder:text-slate-300"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full md:w-auto px-10 py-4 bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest rounded-[1.8rem] hover:bg-indigo-600 transition-all flex items-center justify-center gap-2"
            >
              Search <ArrowRight size={14} />
            </motion.button>
          </motion.form>
        </div>

        {/* --- RIGHT SIDE: PHOTO PREVIEW --- */}
        <div className="relative hidden lg:block">
          
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10"
          >
             {/* MAIN SERVICE PHOTO */}
             <div className="w-full aspect-square bg-white rounded-[5rem] border border-white shadow-2xl flex items-center justify-center relative overflow-hidden p-4">
                <img 
                  src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop" 
                  className="w-full h-full object-cover rounded-[4rem] brightness-95" 
                  alt="Professional Service" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/20 to-transparent pointer-events-none" />
             </div>
          </motion.div>

          {/* Floating Worker Card */}
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="absolute top-10 -right-10 bg-white/80 backdrop-blur-xl border border-white rounded-[2.5rem] p-6 shadow-2xl z-30 w-72"
          >
             <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-md">
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop" 
                      className="w-full h-full object-cover" 
                      alt=" अमित शर्मा"
                    />
                </div>
                <div>
                   <h4 className="font-black text-slate-900 text-sm tracking-tight uppercase">Amit Sharma</h4>
                   <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Master Electrician</p>
                </div>
             </div>
             <div className="flex justify-between items-center mb-5 px-1">
                <div className="flex items-center text-amber-500 gap-1 text-xs font-black"><Star size={14} fill="currentColor" /> 4.98</div>
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">1,240 Jobs</div>
             </div>
             <button className="w-full py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-600 transition-colors shadow-lg shadow-slate-200">
               Book Professional
             </button>
          </motion.div>

          {/* Floating Verification Shield */}
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8, type: "spring" }}
            className="absolute -bottom-6 -left-10 bg-emerald-500 text-white px-7 py-5 rounded-[2rem] shadow-xl z-30 flex items-center gap-4 border-4 border-white"
          >
             <ShieldCheck size={28} className="drop-shadow-md" />
             <div>
                <p className="text-[11px] font-black uppercase tracking-widest leading-none">KYC Verified</p>
                <p className="text-[8px] font-bold opacity-80 mt-1.5 uppercase tracking-widest">Safety Assured</p>
             </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}