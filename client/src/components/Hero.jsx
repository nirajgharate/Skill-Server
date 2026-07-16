import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ArrowRight } from 'lucide-react';

export default function Hero() {
  const navigate = useNavigate();
  const [service, setService] = useState("");
  const [location, setLocation] = useState("Mumbai");
  const [availability, setAvailability] = useState(48);

  useEffect(() => {
    const interval = setInterval(() => {
      setAvailability(prev => {
        const change = Math.floor(Math.random() * 3) - 1;
        return Math.max(30, Math.min(75, prev + change));
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!service.trim()) return;
    navigate(`/services?category=${encodeURIComponent(service)}&location=${encodeURIComponent(location)}`);
  };

  const popularSearches = ["Cleaning", "Electrical", "Plumbing", "AC Repair"];

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center pt-32 pb-16 bg-slate-50/70 dark:bg-[#070B16] transition-colors duration-500 overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
        
        {/* --- LEFT SIDE: UBER-STYLE CLEAN SEARCH STATION (Span 6) --- */}
        <div className="lg:col-span-6 space-y-8 relative">
          {/* Soft Editorial Ambient Glow behind text */}
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-indigo-500/5 dark:bg-transparent rounded-full blur-3xl pointer-events-none z-0" />
          
          {/* Subtle online pro banner */}
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="w-2 h-2 rounded-full bg-emerald-500 absolute" />
            <span className="ml-1 tracking-wider uppercase text-[10px]">
              {availability} experts active in your neighborhood
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-[1.05] tracking-tight">
              Home services, <br />
              <span className="text-indigo-600 dark:text-indigo-400">on demand.</span>
            </h1>
            <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 font-medium max-w-lg leading-relaxed">
              Find top-rated, background-checked local professionals for installations, cleaning, repairs, and general home maintenance.
            </p>
          </div>

          {/* Clean Input Box (Uber Style) */}
          <form 
            onSubmit={handleSearch}
            className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden p-2 flex flex-col sm:flex-row items-center gap-2 theme-transition"
          >
            {/* Service Input */}
            <div className="flex-1 flex items-center px-3 gap-2.5 w-full border-b sm:border-b-0 sm:border-r border-slate-100 dark:border-slate-800 py-3 sm:py-2">
              <Search className="text-slate-400 dark:text-slate-500 shrink-0" size={18} />
              <input 
                type="text" 
                placeholder="What service do you need?" 
                className="bg-transparent border-none outline-none w-full text-sm font-bold text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-655"
                value={service}
                onChange={(e) => setService(e.target.value)}
              />
            </div>
            
            {/* Location Input */}
            <div className="flex items-center px-3 gap-2.5 w-full sm:w-36 py-3 sm:py-2 shrink-0">
              <MapPin className="text-slate-400 dark:text-slate-500 shrink-0" size={18} />
              <input 
                type="text" 
                placeholder="Mumbai" 
                className="bg-transparent border-none outline-none w-full text-sm font-bold text-slate-700 dark:text-slate-300 placeholder:text-slate-450"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            {/* Action Button */}
            <button 
              type="submit"
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-indigo-600 dark:hover:bg-indigo-500 dark:hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Find Pro <ArrowRight size={14} />
            </button>
          </form>

          {/* Quick searches */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="font-bold">Popular:</span>
            {popularSearches.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => {
                  setService(term);
                  navigate(`/services?category=${encodeURIComponent(term)}&location=${encodeURIComponent(location)}`);
                }}
                className="px-3 py-1 bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-full hover:border-indigo-600 dark:hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold transition-all cursor-pointer"
              >
                {term}
              </button>
            ))}
          </div>

        </div>

        {/* --- RIGHT SIDE: ASYMMETRIC CARD DECK + AMBIENT GLOWS + FLOATING TRUST PILLS (Span 6) --- */}
        <div className="lg:col-span-6 hidden lg:flex items-center justify-center relative min-h-[450px]">
          
          {/* Pulsing Ambient Background Glow Circles */}
          <div className="absolute top-1/4 left-10 w-44 h-44 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl animate-pulse-slow z-0" />
          <div className="absolute bottom-1/4 right-10 w-44 h-44 bg-amber-500/15 dark:bg-amber-500/5 rounded-full blur-3xl animate-pulse-slow z-0" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl animate-pulse-slow z-0" />

          {/* Floating Trust Badge: KYC Verified (Top Left) */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute top-6 left-0 z-30 px-3.5 py-2 bg-white/90 dark:bg-slate-900/90 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-md flex items-center gap-2 backdrop-blur-md theme-transition"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-[9px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">KYC Verified</span>
          </motion.div>

          {/* Floating Trust Badge: Escrow Safe (Top Right) */}
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
            className="absolute top-12 right-0 z-30 px-3.5 py-2 bg-white/90 dark:bg-slate-900/90 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-md flex items-center gap-2 backdrop-blur-md theme-transition"
          >
            <span className="text-[10px] shrink-0">🔒</span>
            <span className="text-[9px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">Escrow Safe</span>
          </motion.div>

          {/* Floating Trust Badge: Rating (Bottom Right) */}
          <motion.div 
            animate={{ y: [-5, 5, -5] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="absolute bottom-10 right-4 z-30 px-3.5 py-2 bg-white/90 dark:bg-slate-900/90 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-md flex items-center gap-2 backdrop-blur-md theme-transition"
          >
            <span className="text-yellow-500 font-bold text-xs shrink-0">★</span>
            <span className="text-[9px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">4.9/5 Rating</span>
          </motion.div>

          {/* The Fanned Overlapping Cards Deck */}
          <div className="relative w-full max-w-md h-[400px] flex items-center justify-center z-10">
            
            {/* Card 1: Cleaning (Left, rotated -8 degrees) */}
            <motion.div 
              style={{ originX: 0.5, originY: 0.8 }}
              initial={{ rotate: -8, x: -70, y: 15 }}
              whileHover={{ rotate: -3, y: -10, zIndex: 30 }}
              onClick={() => navigate('/services?category=Cleaning')}
              className="absolute p-3 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl shadow-lg w-60 theme-transition cursor-pointer"
            >
              <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-slate-100 dark:bg-slate-800">
                <img 
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=400&auto=format&fit=crop" 
                  alt="Home Cleaning"
                  className="w-full h-full object-cover brightness-90"
                />
              </div>
              <div className="px-1 pb-1">
                <span className="text-[9px] font-black uppercase tracking-wider text-emerald-655 dark:text-emerald-400 bg-emerald-55/20 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full">Cleaning</span>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-xs mt-2 transition-colors">Deep Home Care</h4>
                <p className="text-[10px] font-bold text-slate-400 mt-1">22 Pros Active</p>
              </div>
            </motion.div>

            {/* Card 2: Plumbing (Right, rotated 8 degrees) */}
            <motion.div 
              style={{ originX: 0.5, originY: 0.8 }}
              initial={{ rotate: 8, x: 70, y: 15 }}
              whileHover={{ rotate: 3, y: -10, zIndex: 30 }}
              onClick={() => navigate('/services?category=Plumbing')}
              className="absolute p-3 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl shadow-lg w-60 theme-transition cursor-pointer"
            >
              <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-slate-100 dark:bg-slate-800">
                <img 
                  src="https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=400&auto=format&fit=crop" 
                  alt="Plumbing"
                  className="w-full h-full object-cover brightness-90"
                />
              </div>
              <div className="px-1 pb-1">
                <span className="text-[9px] font-black uppercase tracking-wider text-blue-655 dark:text-blue-400 bg-blue-55/20 dark:bg-blue-950/20 px-2 py-0.5 rounded-full">Plumbing</span>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-xs mt-2 transition-colors">Emergency Fixes</h4>
                <p className="text-[10px] font-bold text-slate-400 mt-1">12 Pros Active</p>
              </div>
            </motion.div>

            {/* Card 3: Electrical (Center, rotated 0 degrees, on top) */}
            <motion.div 
              style={{ originX: 0.5, originY: 0.8 }}
              initial={{ rotate: 0, x: 0, y: 0, zIndex: 20 }}
              whileHover={{ scale: 1.05, y: -15, zIndex: 30 }}
              onClick={() => navigate('/services?category=Electrical')}
              className="absolute p-3 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl shadow-xl w-60 theme-transition cursor-pointer"
            >
              <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-slate-100 dark:bg-slate-800">
                <img 
                  src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=400&auto=format&fit=crop" 
                  alt="Electrical Repair"
                  className="w-full h-full object-cover brightness-90"
                />
              </div>
              <div className="px-1 pb-1">
                <span className="text-[9px] font-black uppercase tracking-wider text-amber-655 dark:text-amber-400 bg-amber-55/20 dark:bg-amber-950/20 px-2 py-0.5 rounded-full">Electrical</span>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-xs mt-2 transition-colors">Master Wiring</h4>
                <p className="text-[10px] font-bold text-slate-400 mt-1">18 Pros Active</p>
              </div>
            </motion.div>

          </div>

        </div>

      </div>
    </div>
  );
}