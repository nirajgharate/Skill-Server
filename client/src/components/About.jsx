import React from 'react';
import { CheckCircle2, ShieldCheck, Star } from 'lucide-react';

export default function About() {
  const valuePoints = [
    'Verified & skilled workers',
    'Simple booking process',
    'Local community focus',
    '100% satisfaction guarantee'
  ];

  const stats = [
    { value: '10k+', label: 'Jobs Completed' },
    { value: '100%', label: 'Verified Pros' },
    { value: '4.9/5', label: 'Average Rating' }
  ];

  return (
    <section id="about" className="relative py-24 md:py-32 px-4 md:px-8 flex justify-center bg-white">
      
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
        
        {/* Left Column: Story, Stats & Values */}
        <div className="flex flex-col gap-8 lg:pr-4 order-2 lg:order-1">
          
          <div className="flex flex-col gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#4F46E5]/10 rounded-full w-fit">
              <span className="text-sm font-bold tracking-wide uppercase text-[#4F46E5]">
                Why Choose Us
              </span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-[1.15]">
              Building a network of trust in your local community.
            </h2>
            
            <p className="text-lg text-[#0F172A]/70 leading-relaxed md:max-w-[95%]">
              Synapthire isn't just a directory; it's a commitment to quality. We connect homeowners with rigorously vetted local professionals, ensuring every repair, installation, and maintenance job is done right the first time.
            </p>
          </div>

          {/* Professional Metrics Grid */}
          <div className="grid grid-cols-3 gap-6 py-6 border-y border-black/5">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col gap-1">
                <span className="text-2xl md:text-3xl font-extrabold text-[#4F46E5]">
                  {stat.value}
                </span>
                <span className="text-sm font-medium text-[#0F172A]/60">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* 2x2 Value Grid (Looks much cleaner than a long vertical list) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            {valuePoints.map((point, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-[#F8FAFC] rounded-xl border border-black/5 transition-colors hover:border-[#4F46E5]/20">
                <CheckCircle2 className="text-[#4F46E5] shrink-0 mt-0.5" size={20} strokeWidth={2.5} />
                <span className="text-sm font-semibold text-[#0F172A]/85">
                  {point}
                </span>
              </div>
            ))}
          </div>
          
        </div>

        {/* Right Column: Premium Offset Image Composition */}
        <div className="relative w-full flex justify-center items-center order-1 lg:order-2 mb-8 lg:mb-0 lg:pl-10">
          
          {/* Main Glass Frame */}
          <div className="relative w-full max-w-md lg:max-w-full p-4 bg-[#F8FAFC] border border-black/5 rounded-[2.5rem] shadow-sm">
            
            {/* The Image */}
            <img 
              src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1000&auto=format&fit=crop" 
              alt="Local professional providing service" 
              className="w-full aspect-[4/3] lg:aspect-square object-cover rounded-[1.5rem]"
            />

            {/* Premium Trust Badge (Redesigned to look like a UI component) */}
            <div className="absolute top-8 -left-4 md:-left-8 flex flex-col gap-1 p-4 bg-white/90 backdrop-blur-xl border border-black/5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="text-[#4F46E5]" size={20} strokeWidth={2.5} />
                <span className="text-sm font-extrabold text-[#0F172A]">SkillServer Guarantee</span>
              </div>
              <div className="flex items-center gap-1 text-[#0F172A]/70">
                <Star className="text-yellow-500 fill-yellow-500" size={14} />
                <Star className="text-yellow-500 fill-yellow-500" size={14} />
                <Star className="text-yellow-500 fill-yellow-500" size={14} />
                <Star className="text-yellow-500 fill-yellow-500" size={14} />
                <Star className="text-yellow-500 fill-yellow-500" size={14} />
              </div>
            </div>
            
          </div>
        </div>

      </div>
    </section>
  );
}