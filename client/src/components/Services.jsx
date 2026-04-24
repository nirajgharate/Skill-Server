import React from 'react';

export default function Services() {
  // Using high-quality Unsplash placeholders tailored to each service
  const services = [
    {
      title: 'Electrical Repair',
      description: 'Safe and certified electricians for wiring, fixtures, and diagnostics.',
      image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=800&auto=format&fit=crop'
    },
    {
      title: 'Plumbing',
      description: 'Expert fixes for leaks, clogs, installations, and pipe repairs.',
      image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=800&auto=format&fit=crop'
    },
    {
      title: 'Appliance Repair',
      description: 'Get your fridge, washer, or oven running like new again.',
      image: 'https://images.unsplash.com/photo-1626806787426-5910811b6325?q=80&w=800&auto=format&fit=crop'
    },
    {
      title: 'Carpentry',
      description: 'Custom woodworking, furniture repair, and structural fixes.',
      image: 'https://images.unsplash.com/photo-1505015920881-0f83c2f7c95e?q=80&w=800&auto=format&fit=crop'
    },
    {
      title: 'Home Cleaning',
      description: 'Deep cleaning and regular maintenance for a spotless home.',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop'
    },
    {
      title: 'General Maintenance',
      description: 'Handyman services for mounting, assembling, and quick fixes.',
      image: 'https://images.unsplash.com/photo-1581141849291-1125c7b692b5?q=80&w=800&auto=format&fit=crop'
    }
  ];

  return (
    <section id="services" className="relative py-24 px-4 md:px-8 flex flex-col items-center">
      
      {/* Section Header */}
      <div className="w-full max-w-3xl text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] tracking-tight mb-4">
          Our Services
        </h2>
        <p className="text-lg text-[#0F172A]/70 leading-relaxed">
          Choose from a range of trusted home services provided by skilled professionals.
        </p>
      </div>

      {/* Responsive Grid */}
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        
        {services.map((service, index) => (
          // The Premium Glass Card wrapper
          <div 
            key={index}
            className="group p-3 bg-white/60 backdrop-blur-lg border border-black/5 rounded-[1.5rem] shadow-sm hover:shadow-md hover:bg-white/80 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
          >
            {/* Image Wrapper with hidden overflow for the zoom effect */}
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-5 bg-gray-100">
              <img 
                src={service.image} 
                alt={service.title} 
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {/* Optional: Subtle gradient overlay at the bottom of the image for contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            
            {/* Card Copy */}
            <div className="px-3 pb-3 flex flex-col flex-grow">
              <h3 className="text-xl font-bold text-[#0F172A] mb-2">
                {service.title}
              </h3>
              
              <p className="text-base text-[#0F172A]/70 leading-relaxed mb-6 flex-grow">
                {service.description}
              </p>
              
              {/* Micro-interaction action link */}
              <div className="flex items-center text-sm font-bold text-[#4F46E5] mt-auto">
                Book now 
                <span className="ml-1 transition-transform duration-300 group-hover:translate-x-1">→</span>
              </div>
            </div>
          </div>
        ))}
        
      </div>
    </section>
  );
}