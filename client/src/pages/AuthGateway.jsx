import React from 'react';
import { motion } from 'framer-motion';
import { User, Hammer, ChevronRight, ShieldCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AuthGateway() {
  const navigate = useNavigate();

  const RoleCard = ({ type, title, desc, icon: Icon, color }) => (
    <motion.div 
      whileHover={{ y: -8, shadow: "0 25px 50px -12px rgba(0, 0, 0, 0.08)" }}
      className="relative group p-10 bg-white/70 backdrop-blur-2xl border border-white rounded-[3rem] shadow-xl shadow-slate-200/50 flex flex-col items-center text-center transition-all duration-500"
    >
      {/* Icon Sphere */}
      <div className={`w-20 h-20 rounded-[2rem] ${color} flex items-center justify-center mb-8 shadow-inner transition-transform duration-500 group-hover:rotate-12`}>
        <Icon size={32} strokeWidth={2.5} />
      </div>

      <h2 className="text-2xl font-black text-[#0F172A] tracking-tight mb-4">{title}</h2>
      <p className="text-sm font-medium text-[#0F172A]/40 leading-relaxed mb-10 max-w-[240px]">
        {desc}
      </p>

      {/* Action Buttons */}
      <div className="w-full space-y-3">
        <button 
          onClick={() => navigate(`/signup/${type}`)}
          className="w-full py-5 bg-[#0F172A] text-white text-[11px] font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 hover:bg-[#4F46E5] transition-all group/btn"
        >
          Sign Up <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
        </button>
        <button 
          onClick={() => navigate(`/login/${type}`)}
          className="w-full py-5 bg-white border border-black/5 text-[#0F172A] text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-all"
        >
          Login
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center py-20 px-6 overflow-hidden selection:bg-indigo-100">
      {/* Decorative Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-5xl w-full relative z-10">
        <div className="text-center mb-20 space-y-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-black/5 rounded-full shadow-sm mb-4"
          >
            <ShieldCheck size={16} className="text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#0F172A]/40">Trusted by 10k+ users</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-[#0F172A] tracking-tighter"
          >
            Welcome to <span className="text-[#4F46E5]">SkillServer</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg font-bold text-[#0F172A]/30 uppercase tracking-[0.2em]"
          >
            Choose how you want to continue
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <RoleCard 
            type="user"
            title="Continue as User"
            desc="Book trusted professionals for your home services with one click."
            icon={User}
            color="bg-indigo-50 text-indigo-600"
          />
          <RoleCard 
            type="worker"
            title="Continue as Worker"
            desc="Join the network and offer your skills to thousands of local customers."
            icon={Hammer}
            color="bg-emerald-50 text-emerald-600"
          />
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-[10px] font-black text-[#0F172A]/30 uppercase tracking-[0.3em]">
            SkillServer Professional Marketplace v2.0
          </p>
        </motion.div>
      </div>
    </div>
  );
}