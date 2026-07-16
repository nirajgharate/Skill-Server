import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Services() {
  const navigate = useNavigate();

  const services = [
    {
      title: 'Electrical Repair',
      description: 'Safe and certified electricians for wiring, fixtures, and diagnostics.',
      image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=800&auto=format&fit=crop',
      pros: 18,
      catName: 'Electrical'
    },
    {
      title: 'Plumbing',
      description: 'Expert fixes for leaks, clogs, installations, and pipe repairs.',
      image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=800&auto=format&fit=crop',
      pros: 12,
      catName: 'Plumbing'
    },
    {
      title: 'Appliance Repair',
      description: 'Get your fridge, washer, or oven running like new again.',
      image: 'https://images.unsplash.com/photo-1626806787426-5910811b6325?q=80&w=800&auto=format&fit=crop',
      pros: 9,
      catName: 'Appliance'
    },
    {
      title: 'Carpentry',
      description: 'Custom woodworking, furniture repair, and structural fixes.',
      image: 'https://images.unsplash.com/photo-1505015920881-0f83c2f7c95e?q=80&w=800&auto=format&fit=crop',
      pros: 7,
      catName: 'Carpentry'
    },
    {
      title: 'Home Cleaning',
      description: 'Deep cleaning and regular maintenance for a spotless home.',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop',
      pros: 22,
      catName: 'Cleaning'
    },
    {
      title: 'General Maintenance',
      description: 'Handyman services for mounting, assembling, and quick fixes.',
      image: 'https://images.unsplash.com/photo-1581141849291-1125c7b692b5?q=80&w=800&auto=format&fit=crop',
      pros: 15,
      catName: 'Maintenance'
    }
  ];

  const handleCardClick = (catName) => {
    navigate(`/services?category=${encodeURIComponent(catName)}`);
  };

  return (
    <section id="services" className="relative py-24 px-4 md:px-8 flex flex-col items-center bg-white dark:bg-[#070B16] transition-colors duration-500 border-t border-slate-100 dark:border-slate-900/60 overflow-hidden">
      {/* Light Mode Soft Ambient Glows */}
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-indigo-500/5 dark:bg-transparent rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-1/3 -left-32 w-96 h-96 bg-violet-500/5 dark:bg-transparent rounded-full blur-3xl pointer-events-none z-0" />
      
      {/* Section Header */}
      <div className="w-full max-w-3xl text-center mb-16 relative z-10">
        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-600 dark:text-indigo-400">
          Our Offerings
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-2 tracking-tight mb-4 transition-colors">
          Certified Home Services
        </h2>
        <p className="text-base text-slate-500 dark:text-slate-400">
          Click any card to browse verified experts and establish a direct secure match.
        </p>
      </div>

      {/* Responsive Grid of Visual Cards */}
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 relative z-10">
        {services.map((service, index) => (
          <div 
            key={index}
            onClick={() => handleCardClick(service.catName)}
            className="group p-3 bg-slate-50/80 hover:bg-white dark:bg-slate-900/60 dark:hover:bg-slate-900 border border-slate-200/50 dark:border-slate-800/60 rounded-3xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col theme-transition"
          >
            {/* Image section with Available Badge */}
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-5 bg-slate-100 dark:bg-slate-800">
              <img 
                src={service.image} 
                alt={service.title} 
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              
              {/* Online Pros Badge */}
              <div className="absolute top-3 right-3 px-3 py-1 bg-emerald-500/90 dark:bg-emerald-600/90 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-wider rounded-full flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 bg-green-200 rounded-full animate-ping" />
                {service.pros} Pros active
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            
            {/* Copy details */}
            <div className="px-3 pb-3 flex flex-col flex-grow">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 transition-colors">
                {service.title}
              </h3>
              
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6 flex-grow transition-colors">
                {service.description}
              </p>
              
              <div className="flex items-center text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mt-auto transition-colors">
                Book Service
                <span className="ml-1.5 transition-transform duration-300 group-hover:translate-x-1">→</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}