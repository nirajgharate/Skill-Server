import React from 'react';
import { Mail, Phone, Clock, Send, MessageSquare } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="relative py-24 md:py-32 px-4 md:px-8 flex justify-center bg-[#F8FAFC] overflow-hidden">
      
      {/* Unique Design Element: Large Background Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#4F46E5]/10 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#4F46E5]/5 rounded-full blur-[120px] -z-10"></div>

      <div className="w-full max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Heading & Info (Span 5) */}
          <div className="lg:col-span-5 flex flex-col gap-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#4F46E5]/10 rounded-full mb-6">
                <MessageSquare size={16} className="text-[#4F46E5]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#4F46E5]">Support</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-tight mb-6">
                Let’s talk about <br /> your <span className="text-[#4F46E5]">home needs.</span>
              </h2>
              <p className="text-lg text-[#0F172A]/70 leading-relaxed max-w-md">
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
                  <div className="w-14 h-14 bg-white border border-black/5 rounded-2xl flex items-center justify-center shadow-sm group-hover:border-[#4F46E5]/30 transition-all duration-300">
                    <item.icon className="text-[#4F46E5]" size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#0F172A]/40 uppercase tracking-widest">{item.label}</p>
                    <p className="text-lg font-semibold text-[#0F172A]">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: The "Unique" Glass Form (Span 7) */}
          <div className="lg:col-span-7 relative">
            {/* Soft decorative element behind form */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#4F46E5]/10 to-transparent blur-2xl rounded-[3rem] -z-10"></div>
            
            <form 
              className="p-8 md:p-12 bg-white/60 backdrop-blur-xl border border-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)]"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#0F172A]/60 ml-1">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe" 
                    className="w-full px-5 py-4 bg-white/80 border border-black/5 rounded-2xl outline-none focus:ring-4 focus:ring-[#4F46E5]/10 focus:border-[#4F46E5] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#0F172A]/60 ml-1">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="john@example.com" 
                    className="w-full px-5 py-4 bg-white/80 border border-black/5 rounded-2xl outline-none focus:ring-4 focus:ring-[#4F46E5]/10 focus:border-[#4F46E5] transition-all"
                  />
                </div>
              </div>
              
              <div className="space-y-2 mb-8">
                <label className="text-sm font-bold text-[#0F172A]/60 ml-1">Message</label>
                <textarea 
                  rows="4" 
                  placeholder="Tell us what you need help with..." 
                  className="w-full px-5 py-4 bg-white/80 border border-black/5 rounded-2xl outline-none focus:ring-4 focus:ring-[#4F46E5]/10 focus:border-[#4F46E5] transition-all resize-none"
                ></textarea>
              </div>

              <button className="group flex items-center justify-center gap-3 w-full py-5 text-white bg-[#4F46E5] hover:bg-[#4338CA] font-bold rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-[0.98]">
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