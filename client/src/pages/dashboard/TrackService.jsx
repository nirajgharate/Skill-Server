import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Phone, MessageSquare, MapPin, 
  Clock, ShieldCheck, MoreVertical, Navigation,
  CheckCircle2, Circle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TrackService() {
  const navigate = useNavigate();

  // Simulated State for the Timeline
  const steps = [
    { id: 1, label: 'Booked', status: 'complete', time: '09:00 AM' },
    { id: 2, label: 'Worker Assigned', status: 'complete', time: '09:05 AM' },
    { id: 3, label: 'On The Way', status: 'active', time: 'ETA 12 mins' },
    { id: 4, label: 'Service Started', status: 'pending', time: '--' },
    { id: 5, label: 'Completed', status: 'pending', time: '--' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-10">
      {/* --- HEADER --- */}
      <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-slate-100 px-6 h-20 flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 hover:bg-slate-100 rounded-2xl transition-colors"
        >
          <ArrowLeft size={20} className="text-slate-900" />
        </button>
        <h1 className="text-sm font-black uppercase tracking-widest text-slate-900">Track Service</h1>
        <button className="p-3 text-slate-400">
          <MoreVertical size={20} />
        </button>
      </div>

      <div className="max-w-xl mx-auto px-6 pt-28 space-y-6">
        
        {/* --- LIVE STATUS CARD --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-100 relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div className="px-3 py-1 bg-indigo-500 rounded-full text-[10px] font-black uppercase tracking-widest">
                Live Tracking
              </div>
              <div className="text-right">
                <p className="text-3xl font-black tracking-tighter">12 <span className="text-sm font-medium opacity-60 uppercase tracking-normal">mins</span></p>
                <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest">Estimated Arrival</p>
              </div>
            </div>
            <h2 className="text-2xl font-black tracking-tight mb-2">Arjun is on the way</h2>
            <p className="text-slate-400 text-sm font-medium">He is currently 2.4km away from your location.</p>
          </div>
          {/* Decorative Background Pulse */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
        </motion.div>

        {/* --- MAP SECTION --- */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="h-64 bg-slate-200 rounded-[2.5rem] border border-slate-100 relative overflow-hidden group shadow-inner"
        >
          {/* Placeholder for real Map integration (Google Maps/Leaflet) */}
          <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
            <div className="text-center space-y-2">
              <Navigation className="mx-auto text-indigo-500 animate-bounce" size={32} />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Map Interface Loading...</p>
            </div>
          </div>
          
          {/* Floating UI on Map */}
          <div className="absolute bottom-6 right-6">
            <button className="p-4 bg-white rounded-2xl shadow-xl text-indigo-600 hover:scale-110 transition-transform">
              <Navigation size={20} fill="currentColor" />
            </button>
          </div>
        </motion.div>

        {/* --- WORKER INFO CARD --- */}
        <div className="bg-white/70 backdrop-blur-xl border border-white rounded-[2.5rem] p-6 shadow-sm flex items-center gap-6">
          <div className="relative">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun" 
              className="w-16 h-16 rounded-2xl bg-indigo-50 border-2 border-white shadow-sm"
              alt="Worker"
            />
            <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-lg shadow-sm">
              <ShieldCheck size={14} className="text-emerald-500" />
            </div>
          </div>
          <div className="flex-1">
            <h4 className="font-black text-slate-900 leading-tight">Arjun Sharma</h4>
            <div className="flex items-center gap-2 mt-1">
              <Star size={12} className="text-amber-400 fill-amber-400" />
              <span className="text-xs font-bold text-slate-400">4.9 • 1.2k Jobs</span>
            </div>
          </div>
          <div className="flex gap-2">
            <a href="tel:+" className="p-4 bg-slate-50 rounded-2xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
              <Phone size={18} />
            </a>
            <button className="p-4 bg-slate-50 rounded-2xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
              <MessageSquare size={18} />
            </button>
          </div>
        </div>

        {/* --- PROGRESS TIMELINE --- */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-50 shadow-sm">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">Service Journey</h3>
          <div className="space-y-8">
            {steps.map((step, idx) => (
              <div key={step.id} className="flex gap-6 relative">
                {idx !== steps.length - 1 && (
                  <div className={`absolute left-2 top-6 w-[2px] h-full ${step.status === 'complete' ? 'bg-indigo-500' : 'bg-slate-100'}`} />
                )}
                <div className="relative z-10">
                  {step.status === 'complete' ? (
                    <CheckCircle2 size={18} className="text-indigo-500 bg-white" />
                  ) : step.status === 'active' ? (
                    <div className="w-[18px] h-[18px] rounded-full border-4 border-indigo-500 bg-white animate-pulse" />
                  ) : (
                    <Circle size={18} className="text-slate-200 bg-white" />
                  )}
                </div>
                <div className="flex-1 flex justify-between items-start">
                  <div>
                    <p className={`text-sm font-black uppercase tracking-tight ${step.status === 'active' ? 'text-indigo-600' : 'text-slate-900'}`}>
                      {step.label}
                    </p>
                    <p className="text-xs text-slate-400 font-medium">{step.status === 'complete' ? 'Task finished' : 'In progress'}</p>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{step.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- BOOKING SUMMARY --- */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-50 shadow-sm space-y-6">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Booking Summary</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Service</p>
              <p className="text-sm font-bold text-slate-700">AC Deep Cleaning</p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Price</p>
              <p className="text-sm font-black text-indigo-600">₹450.00</p>
            </div>
            <div className="col-span-2 space-y-1">
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Address</p>
              <p className="text-xs font-medium text-slate-500 leading-relaxed">Flat 402, Building A, Emerald Heights, Sector 45, Gurugram</p>
            </div>
          </div>
        </div>

        {/* --- ACTION BUTTONS --- */}
        <div className="grid grid-cols-2 gap-4">
          <button className="py-5 bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:bg-indigo-600 transition-all">
            Get Help
          </button>
          <button className="py-5 bg-slate-100 text-slate-500 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-all">
            Cancel Booking
          </button>
        </div>
      </div>
    </div>
  );
}