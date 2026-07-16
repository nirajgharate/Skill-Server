import React from 'react';
import { ShieldCheck, CheckCircle2, Star } from 'lucide-react';

export default function About() {
  const valuePoints = [
    'Rigorous KYC & background checks',
    'Upfront, flat-rate pricing models',
    'Escrow-protected safe transactions',
    '100% Satisfaction Guarantee'
  ];

  const stats = [
    { value: '10k+', label: 'Jobs Completed' },
    { value: '100%', label: 'Verified Pros' },
    { value: '4.9/5', label: 'Average Rating' }
  ];

  return (
    <section id="about" className="relative py-24 md:py-32 px-6 md:px-12 bg-slate-50/70 dark:bg-[#070B16] border-t border-slate-100 dark:border-slate-900/60 flex justify-center transition-colors duration-500 overflow-hidden">
      {/* Light Mode Soft Ambient Glow Circle */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-500/5 dark:bg-transparent rounded-full blur-3xl pointer-events-none z-0 animate-pulse-slow" />
      
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-center relative z-10">
        
        {/* --- LEFT COLUMN: STORY, STATS & DETAILS (Span 7) --- */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          
          <div className="flex flex-col gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-600 dark:text-indigo-400">
              Who We Are
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-1 tracking-tight leading-none transition-colors">
              Your home, cared for by local experts.
            </h2>
            <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed transition-colors">
              We connect homeowners with trusted, background-checked neighborhood professionals. Our secure platform guarantees pricing transparency and secure escrow payouts.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-6 py-6 border-y border-slate-100 dark:border-slate-800 transition-colors">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col gap-1">
                <span className="text-2xl md:text-3xl font-extrabold text-indigo-600 dark:text-indigo-450 transition-colors">
                  {stat.value}
                </span>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 transition-colors">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* 2x2 Value List Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {valuePoints.map((point, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200/50 dark:border-slate-800/65 transition-all">
                <CheckCircle2 className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" size={18} strokeWidth={2.5} />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-300 transition-colors">
                  {point}
                </span>
              </div>
            ))}
          </div>
          
        </div>

        {/* --- RIGHT COLUMN: OFFSET TRUST DECK (Span 5) --- */}
        <div className="lg:col-span-5 relative w-full flex justify-center items-center">
          
          <div className="relative w-full max-w-sm p-4 bg-white dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/40 rounded-[2.5rem] shadow-sm theme-transition">
            
            {/* Vetted worker action image */}
            <img 
              src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=600&auto=format&fit=crop" 
              alt="Verified technician performing repair service" 
              className="w-full aspect-[4/3] lg:aspect-square object-cover rounded-[1.5rem]"
            />

            {/* Floating verification badge overlay */}
            <div className="absolute top-8 left-4 sm:-left-4 md:-left-8 flex flex-col gap-1.5 p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-lg theme-transition">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-indigo-600 dark:text-indigo-400" size={20} strokeWidth={2.5} />
                <span className="text-xs font-extrabold text-slate-900 dark:text-white transition-colors">Safety Assured</span>
              </div>
              <div className="flex items-center gap-1 text-[#0F172A]/70 dark:text-slate-400 text-[10px] font-bold">
                <Star className="text-yellow-500 fill-yellow-500" size={12} />
                <Star className="text-yellow-500 fill-yellow-500" size={12} />
                <Star className="text-yellow-500 fill-yellow-500" size={12} />
                <Star className="text-yellow-500 fill-yellow-500" size={12} />
                <Star className="text-yellow-500 fill-yellow-500" size={12} />
                <span className="ml-1 text-slate-500">5.0 Pros</span>
              </div>
            </div>
            
          </div>
        </div>

      </div>
    </section>
  );
}