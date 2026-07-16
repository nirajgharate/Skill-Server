import React from 'react';
import { Mail, Phone, Clock, Send, MessageSquare } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="relative py-24 md:py-32 px-4 md:px-8 flex justify-center bg-[#F8FAFC] dark:bg-[#0A0F1D] overflow-hidden transition-colors duration-500">
      
      {/* Unique Design Element: Large Background Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#4F46E5]/10 dark:bg-indigo-600/10 rounded-full blur-[120px] -z-10 animate-pulse-slow"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#4F46E5]/5 dark:bg-violet-650/10 rounded-full blur-[120px] -z-10 animate-float"></div>

      <div className="w-full max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Heading & Info (Span 5) */}
          <div className="lg:col-span-5 flex flex-col gap-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#4F46E5]/10 dark:bg-[#4F46E5]/25 rounded-full mb-6">
                <MessageSquare size={16} className="text-[#4F46E5] dark:text-indigo-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#4F46E5] dark:text-indigo-400">Support</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-[#0F172A] dark:text-white tracking-tight leading-tight mb-6 transition-colors">
                Let’s talk about <br /> your <span className="text-[#4F46E5] dark:text-indigo-400">home needs.</span>
              </h2>
              <p className="text-lg text-[#0F172A]/70 dark:text-slate-400 leading-relaxed max-w-md transition-colors">
                Have a specific question or a complex project? Our team is ready to connect you with the right expertise.
              </p>
            </div>

            {/* Unique Vertical Contact Info List */}
            <div className="space-y-8">
              {[
                { icon: Mail, label: 'Email Us', value: 'hello@skillserver.com' },
                { icon: Phone, label: 'Call Us', value: '+1 (555) 000-0000' },
                { icon: Clock, label: 'Availability', value: 'Mon - Fri, 9am - 6pm' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-6 group">
                  <div className="w-14 h-14 bg-white dark:bg-slate-900 border border-black/5 dark:border-slate-800 rounded-2xl flex items-center justify-center shadow-sm group-hover:border-[#4F46E5]/30 dark:group-hover:border-indigo-400/30 transition-all duration-300">
                    <item.icon className="text-[#4F46E5] dark:text-indigo-400" size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#0F172A]/40 dark:text-slate-500 uppercase tracking-widest transition-colors">{item.label}</p>
                    <p className="text-lg font-semibold text-[#0F172A] dark:text-white transition-colors">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: The "Unique" Glass Form (Span 7) */}
          <div className="lg:col-span-7 relative">
            {/* Soft decorative element behind form */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#4F46E5]/10 dark:from-indigo-600/15 to-transparent blur-2xl rounded-[3rem] -z-10 animate-float-reverse"></div>
            
            <form 
              className="p-5 md:p-12 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white dark:border-slate-800 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.2)] theme-transition"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#0F172A]/60 dark:text-slate-400 ml-1 transition-colors">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe" 
                    className="w-full px-5 py-4 bg-white/85 dark:bg-slate-950/80 border border-black/5 dark:border-slate-800 rounded-2xl outline-none focus:ring-4 focus:ring-[#4F46E5]/10 dark:focus:ring-indigo-400/10 focus:border-[#4F46E5] dark:focus:border-indigo-400 text-[#0F172A] dark:text-slate-200 placeholder:text-slate-350 dark:placeholder:text-slate-650 transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#0F172A]/60 dark:text-slate-400 ml-1 transition-colors">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="john@example.com" 
                    className="w-full px-5 py-4 bg-white/85 dark:bg-slate-950/80 border border-black/5 dark:border-slate-800 rounded-2xl outline-none focus:ring-4 focus:ring-[#4F46E5]/10 dark:focus:ring-indigo-400/10 focus:border-[#4F46E5] dark:focus:border-indigo-400 text-[#0F172A] dark:text-slate-200 placeholder:text-slate-350 dark:placeholder:text-slate-650 transition-all font-medium"
                  />
                </div>
              </div>
              
              <div className="space-y-2 mb-8">
                <label className="text-sm font-bold text-[#0F172A]/60 dark:text-slate-400 ml-1 transition-colors">Message</label>
                <textarea 
                  rows="4" 
                  placeholder="Tell us what you need help with..." 
                  className="w-full px-5 py-4 bg-white/85 dark:bg-slate-950/80 border border-black/5 dark:border-slate-800 rounded-2xl outline-none focus:ring-4 focus:ring-[#4F46E5]/10 dark:focus:ring-indigo-400/10 focus:border-[#4F46E5] dark:focus:border-indigo-400 text-[#0F172A] dark:text-slate-200 placeholder:text-slate-350 dark:placeholder:text-slate-650 transition-all resize-none font-medium"
                ></textarea>
              </div>

              <button className="group flex items-center justify-center gap-3 w-full py-5 text-white bg-[#4F46E5] dark:bg-indigo-600 hover:bg-[#4338CA] dark:hover:bg-indigo-600 font-bold rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-none transition-all active:scale-[0.98] cursor-pointer">
                Send Your Message
                <Send size={20} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}