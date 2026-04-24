import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function Poster() {
  return (
    // py-24 keeps the vertical rhythm consistent with other sections
    <section className="relative py-24 px-4 md:px-8 flex justify-center overflow-hidden bg-white">
      
      {/* Soft Ambient Background Gradient Mesh */}
      <div className="absolute top-0 left-1/4 w-full max-w-3xl h-full bg-gradient-to-br from-[#4F46E5]/5 to-transparent rounded-full blur-3xl -z-10 transform -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-1/4 w-full max-w-2xl h-full bg-gradient-to-tl from-[#4F46E5]/5 to-transparent rounded-full blur-3xl -z-10 transform translate-y-1/4"></div>

      {/* The Glass Poster Container (max-w-5xl for perfect reading width) */}
      <div className="relative w-full max-w-5xl flex flex-col items-center text-center p-8 py-16 md:p-20 bg-white/60 backdrop-blur-2xl border border-black/5 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-[1.2] max-w-3xl mb-6">
          Reliable help for every home — <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0F172A] to-[#4F46E5]">when you need it most.</span>
        </h2>
        
        <p className="text-base md:text-lg lg:text-xl text-[#0F172A]/70 leading-relaxed max-w-2xl mb-10">
          From urgent repairs to everyday maintenance, Synapthire connects you with trusted local professionals quickly and easily.
        </p>
        
        {/* Call to Action Button */}
        <button className="group flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-xl shadow-[0_4px_14px_0_rgba(79,70,229,0.25)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.35)] hover:-translate-y-0.5 transition-all duration-300">
          Get Started
          <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
        </button>

      </div>
    </section>
  );
}