import React from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Poster() {
  const navigate = useNavigate();

  return (
    <section className="relative py-16 px-4 md:px-8 flex justify-center overflow-hidden bg-slate-50 dark:bg-[#070B16] transition-colors duration-500">
      
      {/* Background ambient lights */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl -z-10" />

      {/* The Poster Banner Container */}
      <div className="relative w-full max-w-4xl rounded-[2rem] overflow-hidden shadow-lg border border-slate-200/50 dark:border-slate-800/80 group">
        
        {/* Background Photo with Linear Gradient Overlays */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1600" 
            alt="Professional Technician at Work" 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-103"
          />
          {/* Light Theme Overlay */}
          <div className="absolute inset-0 bg-white/90 md:bg-gradient-to-r md:from-white/95 md:via-white/70 md:to-transparent dark:hidden" />
          <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent dark:hidden" />
          
          {/* Dark Theme Overlay */}
          <div className="absolute inset-0 hidden dark:block bg-[#070B16]/90 md:bg-gradient-to-r md:from-[#070B16]/95 md:via-[#070B16]/75 md:to-transparent" />
          <div className="absolute inset-0 hidden dark:block bg-gradient-to-t from-[#070B16]/30 via-transparent to-transparent" />
          <div className="absolute inset-0 hidden dark:block bg-indigo-950/10 mix-blend-overlay" />
        </div>

        {/* Content Box */}
        <div className="relative z-10 w-full flex flex-col items-center md:items-start text-center md:text-left p-6 py-10 md:p-12 max-w-xl space-y-4">
          
          {/* Soulful trust badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100/50 dark:border-indigo-850 rounded-full shadow-sm">
            <span className="flex h-1.5 w-1.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-500"></span>
            </span>
            <span className="text-[9px] font-black uppercase tracking-wider text-indigo-650 dark:text-indigo-400">
              Trusted by 10,000+ homes
            </span>
          </div>

          <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.2]">
            Reliable help for every home — <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-650 dark:from-indigo-400 to-blue-600 dark:to-blue-400">when you need it most.</span>
          </h2>
          
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            From urgent circuit diagnostics to deep home cleaning and paint restoration, Synapthire matches you with background-checked local professionals instantly.
          </p>

          {/* Quick Checklist Icons for trust */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 pt-1">
            {[
              "KYC Verified Experts",
              "Escrow Payment Shield",
              "Insured Satisfaction"
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-350">{text}</span>
              </div>
            ))}
          </div>
          
          {/* Call to Action Button */}
          <div className="pt-2">
            <button 
              onClick={() => navigate('/services')}
              className="group flex items-center justify-center gap-2 px-6 py-3.5 text-[10px] font-black uppercase tracking-widest text-white bg-indigo-600 hover:bg-indigo-750 dark:bg-indigo-650 dark:hover:bg-indigo-600 rounded-xl shadow-md shadow-indigo-500/10 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 active:scale-95 animate-pulse-slow"
            >
              Get Started Now
              <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}