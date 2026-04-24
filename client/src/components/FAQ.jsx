import React, { useState } from 'react';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      q: "How do I book a service?",
      a: "You can browse services, choose a professional, and book directly through the platform in just a few steps."
    },
    {
      q: "Are workers verified?",
      a: "Yes, we ensure that workers are verified and skilled so you can book with confidence."
    },
    {
      q: "How quickly can I get help?",
      a: "Response times vary, but many services are available the same day depending on availability."
    },
    {
      q: "Is pricing transparent?",
      a: "Yes, we aim to provide clear and transparent pricing before you confirm your booking."
    },
    {
      q: "What if I am not satisfied?",
      a: "Our support team is here to help resolve any concerns and ensure a positive experience."
    }
  ];

  return (
    <section className="py-24 px-4 md:px-8 bg-[#F8FAFC] flex flex-col items-center">
      
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-[#0F172A]/60">Everything you need to know about Synapthire.</p>
      </div>

      {/* Accordion List */}
      <div className="w-full max-w-3xl flex flex-col gap-4">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white/60 backdrop-blur-md border border-black/5 rounded-2xl overflow-hidden">
            <button 
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full p-6 flex justify-between items-center font-bold text-[#0F172A] text-left"
            >
              {faq.q}
              <motion.div animate={{ rotate: openIndex === i ? 180 : 0 }}>
                <ChevronDown className="text-[#4F46E5]" size={20} />
              </motion.div>
            </button>
            
            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="px-6 pb-6 text-[#0F172A]/70 leading-relaxed">
                    {faq.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <button className="mt-10 group flex items-center gap-2 font-bold text-[#0F172A] hover:text-[#4F46E5] transition-colors">
        See All Questions 
        <span className="transition-transform group-hover:translate-x-1">→</span>
      </button>

     

    </section>
  );
}