import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, Phone, Star, ShieldCheck, Clock, 
  ChevronLeft, MessageSquare, AlertCircle, CheckCircle2 
} from 'lucide-react';

export default function TrackingPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve booking data or use defaults
  const booking = location.state || {
    worker: { name: "Amit Sharma", role: "Master Electrician", rating: "4.9", img: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?q=80&w=400" },
    service: "Circuit Diagnostics",
    address: "B-402, Sunshine Heights, Andheri West",
    date: "Feb 18, 2026",
    id: "SKL-982312"
  };

  const [currentStatus, setCurrentStatus] = useState(2); 

  const steps = [
    { title: "Booking Confirmed", desc: "We've received your request." },
    { title: "Expert Assigned", desc: `${booking.worker.name} is handling your case.` },
    { title: "En Route", desc: "Expert is traveling to your location." },
    { title: "Arrived", desc: "Pro has reached the service address." },
    { title: "Service In Progress", desc: "Work has started. Safety first!" },
    { title: "Completed", desc: "Service finished and verified." }
  ];

  return (
    /* 🛠️ FIX: Increased pt-32 to pt-40 for desktop and added responsive padding */
    <div className="min-h-screen bg-[#FDFDFD] pt-36 md:pt-49 pb-24 px-4 relative overflow-hidden">
      
      {/* 1. ATMOSPHERE: Decorative Glow adjusted to stay below navbar area */}
      <div className="absolute top-20 right-[-10%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-40 left-[-10%] w-[400px] h-[400px] bg-blue-400/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-xl mx-auto space-y-8 relative z-10">
        
        {/* 🧭 HEADER */}
        <div className="flex items-center justify-between px-2">
          <button 
            onClick={() => navigate(-1)} 
            className="p-3 bg-white rounded-2xl shadow-sm border border-black/5 text-slate-400 hover:text-indigo-600 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="text-right">
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Tracking ID</p>
             <p className="text-sm font-bold text-slate-900">{booking.id}</p>
          </div>
        </div>

        {/* 🚨 LIVE STATUS HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Live Tracking</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight">
            {steps[currentStatus].title}
          </h1>
          <p className="text-sm font-medium text-slate-400">Estimated arrival in <span className="text-indigo-600 font-bold">12 mins</span></p>
        </motion.div>

        {/* 👤 WORKER MINI CARD */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="p-6 bg-white/80 backdrop-blur-xl border border-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <img src={booking.worker.img} className="w-16 h-16 rounded-2xl object-cover shadow-sm" alt={booking.worker.name} />
              <div className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 text-white rounded-lg border-2 border-white">
                <ShieldCheck size={12} />
              </div>
            </div>
            <div>
              <h3 className="font-black text-slate-900 tracking-tight">{booking.worker.name}</h3>
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <Star size={12} className="fill-amber-400 text-amber-400" /> {booking.worker.rating} • {booking.worker.role}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <a href="tel:+" className="p-4 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100 hover:scale-105 transition-transform">
              <Phone size={20} />
            </a>
            <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 transition-colors">
              <MessageSquare size={20} />
            </button>
          </div>
        </motion.div>

        {/* 📍 PROGRESS TIMELINE */}
        <div className="p-10 bg-white rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="space-y-12 relative">
            <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-slate-50" />
            
            {steps.map((step, i) => (
              <div key={i} className="flex gap-8 relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                  currentStatus >= i ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-white border-2 border-slate-100 text-transparent'
                }`}>
                  {currentStatus >= i && <CheckCircle2 size={16} />}
                </div>
                <div className={currentStatus >= i ? 'opacity-100' : 'opacity-30'}>
                  <h4 className="text-sm font-black text-slate-900 tracking-tight uppercase">{step.title}</h4>
                  <p className="text-xs font-medium text-slate-400 mt-1">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 📋 BOOKING INFO SUMMARY */}
        <div className="p-8 bg-slate-900 rounded-[3rem] shadow-2xl shadow-slate-200 text-white space-y-6 relative overflow-hidden">
          <div className="flex items-center gap-4 relative z-10">
             <div className="p-3 bg-white/10 rounded-2xl text-indigo-400"><MapPin size={20} /></div>
             <p className="text-xs font-bold opacity-80 leading-relaxed tracking-tight">{booking.address}</p>
          </div>
          <div className="flex items-center gap-4 pt-6 border-t border-white/5 relative z-10">
             <div className="p-3 bg-white/10 rounded-2xl text-indigo-400"><Clock size={20} /></div>
             <p className="text-xs font-bold opacity-80 uppercase tracking-widest">{booking.date} • {booking.service}</p>
          </div>
          {/* Subtle background glow for dark card */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
        </div>

        {/* 📞 HELP AREA */}
        <div className="text-center p-10 border-2 border-dashed border-slate-100 rounded-[3rem] bg-slate-50/30">
          <AlertCircle size={24} className="mx-auto text-slate-200 mb-4" />
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Need Assistance?</h4>
          <p className="text-[11px] font-medium text-slate-400 leading-loose">
            Contact support for rescheduling or safety queries.<br />
            <span className="text-indigo-600 font-black cursor-pointer underline underline-offset-4">Open Support Portal</span>
          </p>
        </div>

      </div>
    </div>
  );
}