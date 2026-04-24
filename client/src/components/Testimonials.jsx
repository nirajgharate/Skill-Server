import React from 'react';
import { Quote, Star } from 'lucide-react';

export default function Reviews() {
  const reviews = [
    {
      quote: "Booking a plumber was incredibly easy and the service was quick and professional.",
      name: "Priya Sharma",
      role: "Homeowner"
    },
    {
      quote: "Synapthire helped me find a reliable electrician within minutes. Highly recommended.",
      name: "Rahul Verma",
      role: "Small Business Owner"
    },
    {
      quote: "The platform feels trustworthy and the workers are skilled. Great experience overall.",
      name: "Ankit Patel",
      role: "Customer"
    }
  ];

  return (
    // py-24 for vertical rhythm, bg-white to contrast slightly with the #F8FAFC sections
    <section id="reviews" className="relative py-24 px-4 md:px-8 flex flex-col items-center bg-white">
      
      {/* Section Header */}
      <div className="w-full max-w-3xl text-center mb-12 md:mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] tracking-tight">
          What our customers say
        </h2>
      </div>

      {/* Responsive Review Grid */}
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        
        {reviews.map((review, index) => (
          // Premium Glass Review Card
          <div 
            key={index}
            className="group p-8 bg-[#F8FAFC]/80 backdrop-blur-lg border border-black/5 rounded-[1.5rem] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col"
          >
            {/* Header: Quote Icon & Stars */}
            <div className="flex items-center justify-between mb-6">
              <div className="w-10 h-10 bg-[#4F46E5]/10 rounded-full flex items-center justify-center">
                <Quote className="text-[#4F46E5]" size={18} fill="currentColor" />
              </div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
            </div>
            
            {/* Review Body - flex-grow ensures the author block is pushed to the bottom */}
            <p className="text-lg text-[#0F172A]/80 leading-relaxed font-medium mb-8 flex-grow">
              "{review.quote}"
            </p>
            
            {/* Author Footer */}
            <div className="flex items-center gap-3 mt-auto pt-6 border-t border-black/5">
              {/* Optional Avatar Placeholder (Initials) */}
              <div className="w-10 h-10 rounded-full bg-[#0F172A] flex items-center justify-center text-white font-bold text-sm shrink-0">
                {review.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-[#0F172A] text-sm">{review.name}</h4>
                <p className="text-xs font-medium text-[#0F172A]/60">{review.role}</p>
              </div>
            </div>
          </div>
        ))}
        
      </div>
    </section>
  );
}