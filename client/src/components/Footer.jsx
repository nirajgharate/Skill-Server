import React from 'react';
import { Wrench, Mail, Phone, MapPin, Instagram, Twitter, Facebook, Linkedin, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#0F172A] pt-24 pb-12 px-4 md:px-8 overflow-hidden">
      
      {/* Subtle Background Glow for Depth */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#4F46E5]/10 rounded-full blur-[120px] -z-0"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-8 mb-20">
          
          {/* Column 1: Brand & Identity (Span 5) */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#4F46E5] rounded-xl shadow-lg shadow-indigo-500/20">
                <Wrench className="text-white" size={24} strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                Synapthire
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-lg max-w-md">
              The most trusted platform for local home services. We vet every professional so you can book with total peace of mind.
            </p>
            {/* High-Contrast Social Icons */}
            <div className="flex gap-4">
              {[Twitter, Instagram, Facebook, Linkedin].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#4F46E5] transition-all duration-300"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Platform Links (Span 2) */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-white mb-8 uppercase text-xs tracking-[0.2em]">Platform</h4>
            <ul className="flex flex-col gap-5 text-sm font-medium text-slate-400">
              {['Home', 'Services', 'About Us', 'Reviews', 'FAQ'].map((link) => (
                <li key={link} className="group">
                  <a href={`#${link.toLowerCase().replace(' ', '')}`} className="group-hover:text-white transition-colors flex items-center gap-1">
                    {link}
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-all -translate-y-1" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services (Span 2) */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-white mb-8 uppercase text-xs tracking-[0.2em]">Services</h4>
            <ul className="flex flex-col gap-5 text-sm font-medium text-slate-400">
              {['Electrical', 'Plumbing', 'Cleaning', 'Carpentry', 'Repairs'].map((service) => (
                <li key={service}>
                  <a href="#" className="hover:text-white transition-colors">
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact (Span 3) */}
          <div className="lg:col-span-3">
            <h4 className="font-bold text-white mb-8 uppercase text-xs tracking-[0.2em]">Get in Touch</h4>
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#4F46E5] transition-all">
                  <Mail size={16} className="text-[#4F46E5] group-hover:text-white" />
                </div>
                <span className="text-sm font-medium text-slate-400 group-hover:text-white transition-colors">support@synapthire.com</span>
              </div>
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#4F46E5] transition-all">
                  <Phone size={16} className="text-[#4F46E5] group-hover:text-white" />
                </div>
                <span className="text-sm font-medium text-slate-400 group-hover:text-white transition-colors">+1 (555) 000-0000</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Bar - Clean Horizontal Line */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">
            © {currentYear} Synapthire. Excellence in Service.
          </p>
          <div className="flex gap-10 text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}