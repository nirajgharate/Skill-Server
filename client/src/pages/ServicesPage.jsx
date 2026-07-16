import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Zap,
  Droplets,
  Sparkles,
  Wrench,
  Hammer,
  ClipboardCheck,
  ArrowRight,
  Search,
  ShieldCheck,
  Flame,
  Lightbulb,
  Paintbrush,
  Lock,
  WrenchIcon,
  Sofa,
  Wind,
  Wifi,
  BugPlay,
  Drill,
  Waves,
  Star,
  Users,
} from "lucide-react";

export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [showSearch, setShowSearch] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [visibleCount, setVisibleCount] = useState(9);

  useEffect(() => {
    setVisibleCount(9);
  }, [activeCategory, searchQuery]);

  useEffect(() => {
    const controlSearch = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setShowSearch(false);
      } else {
        setShowSearch(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", controlSearch);
    return () => window.removeEventListener("scroll", controlSearch);
  }, [lastScrollY]);

  const categories = [
    { name: "All", icon: ClipboardCheck },
    { name: "Electrical", icon: Zap },
    { name: "Plumbing", icon: Droplets },
    { name: "Cleaning", icon: Sparkles },
    { name: "Appliance Repair", icon: Wrench },
    { name: "Carpentry", icon: Hammer },
    { name: "Painting", icon: Paintbrush },
    { name: "Security", icon: Lock },
    { name: "HVAC", icon: Wind },
  ];

  const services = [
    {
      id: 1,
      name: "Circuit Diagnostics",
      cat: "Electrical",
      badge: "Verified",
      desc: "Full home wiring safety checks and fault repairs.",
      price: "₹499",
      rating: 4.8,
      reviews: 324,
      img: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=400",
    },
    {
      id: 2,
      name: "Emergency Plumbing",
      cat: "Plumbing",
      badge: "Popular",
      desc: "Fast response for leaks, clogs, and pipe bursts.",
      price: "₹599",
      rating: 4.9,
      reviews: 512,
      img: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=400",
    },
    {
      id: 3,
      name: "Deep Home Cleaning",
      cat: "Cleaning",
      badge: "Verified",
      desc: "Full sanitization for every corner of your home.",
      price: "₹1299",
      rating: 4.7,
      reviews: 418,
      img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=400",
    },
    {
      id: 4,
      name: "AC Gas Refilling",
      cat: "Appliance Repair",
      badge: "Verified",
      desc: "Optimizing cooling efficiency for your AC units.",
      price: "₹2499",
      rating: 4.8,
      reviews: 267,
      img: "https://images.unsplash.com/photo-1626806787426-5910811b6325?q=80&w=400",
    },
    {
      id: 5,
      name: "Door & Window Repair",
      cat: "Carpentry",
      badge: "Popular",
      desc: "Fixing sagging frames and broken hinges.",
      price: "₹399",
      rating: 4.6,
      reviews: 189,
      img: "https://images.unsplash.com/photo-1505015920881-0f83c2f7c95e?q=80&w=400",
    },
    {
      id: 6,
      name: "Full Home Painting",
      cat: "Painting",
      badge: "Verified",
      desc: "Premium wall finish and waterproofing.",
      price: "₹5000",
      rating: 4.9,
      reviews: 203,
      img: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=400",
    },
    {
      id: 7,
      name: "Pest Control",
      cat: "Cleaning",
      badge: "Verified",
      desc: "Odorless treatment for a pest-free home.",
      price: "₹899",
      rating: 4.7,
      reviews: 156,
      img: "https://images.unsplash.com/photo-1587304084745-921182098000?q=80&w=400",
    },
    {
      id: 8,
      name: "Washing Machine Repair",
      cat: "Appliance Repair",
      badge: "Verified",
      desc: "Fixing drum issues and drainage clogs.",
      price: "₹550",
      rating: 4.8,
      reviews: 298,
      img: "https://images.unsplash.com/photo-1520333789090-1afc82db536a?q=80&w=400",
    },
    {
      id: 9,
      name: "CCTV Installation",
      cat: "Security",
      badge: "Popular",
      desc: "Secure your home with smart surveillance.",
      price: "₹1999",
      rating: 4.9,
      reviews: 412,
      img: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=400",
    },
    {
      id: 10,
      name: "Furniture Assembly",
      cat: "Carpentry",
      badge: "Verified",
      desc: "Professional assembly for flat-pack furniture.",
      price: "₹699",
      rating: 4.7,
      reviews: 234,
      img: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=400",
    },
    {
      id: 11,
      name: "Smart Lock Installation",
      cat: "Security",
      badge: "Popular",
      desc: "Install smart locks and security systems.",
      price: "₹1299",
      rating: 4.8,
      reviews: 178,
      img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=400",
    },
    {
      id: 12,
      name: "Microwave Oven Repair",
      cat: "Appliance Repair",
      badge: "Verified",
      desc: "Expert repair for all microwave models.",
      price: "₹350",
      rating: 4.6,
      reviews: 145,
      img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=400",
    },
    {
      id: 13,
      name: "Fan Installation",
      cat: "Electrical",
      badge: "Verified",
      desc: "Install ceiling and exhaust fans safely.",
      price: "₹399",
      rating: 4.7,
      reviews: 267,
      img: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=400",
    },
    {
      id: 14,
      name: "Wall Texture & Wallpaper",
      cat: "Painting",
      badge: "Verified",
      desc: "Decorative wall treatments and wallpaper.",
      price: "₹2999",
      rating: 4.8,
      reviews: 156,
      img: "https://images.unsplash.com/photo-1578500494198-246f612d03b3?q=80&w=400",
    },
    {
      id: 15,
      name: "Kitchen Basin Installation",
      cat: "Plumbing",
      badge: "Verified",
      desc: "Professional sink and basin installation.",
      price: "₹1199",
      rating: 4.7,
      reviews: 189,
      img: "https://images.unsplash.com/photo-1584622281867-8fc18f4be5f2?q=80&w=400",
    },
    {
      id: 16,
      name: "AC Deep Cleaning",
      cat: "HVAC",
      badge: "Popular",
      desc: "Complete AC cleaning and maintenance.",
      price: "₹999",
      rating: 4.9,
      reviews: 345,
      img: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?q=80&w=400",
    },
    {
      id: 17,
      name: "Water Tank Cleaning",
      cat: "Cleaning",
      badge: "Verified",
      desc: "Hygienic water tank cleaning and sanitization.",
      price: "₹749",
      rating: 4.8,
      reviews: 223,
      img: "https://images.unsplash.com/photo-1585864299869-97e852a4a372?q=80&w=400",
    },
    {
      id: 18,
      name: "WiFi & Network Setup",
      cat: "Electrical",
      badge: "Verified",
      desc: "Install and optimize home WiFi networks.",
      price: "₹599",
      rating: 4.7,
      reviews: 298,
      img: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=400",
    },
  ];

  const filtered = services.filter((s) => {
    const matchesCat = activeCategory === "All" || s.cat === activeCategory;
    const matchesSearch = s.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            className={
              i < Math.floor(rating)
                ? "fill-amber-400 text-amber-400"
                : "text-slate-200"
            }
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070B16] transition-colors duration-500">
      {/* Hero Section */}
      <div className="pt-28 pb-8 px-4 md:px-8 relative overflow-hidden bg-slate-950 flex justify-center border-b border-slate-800">
        
        {/* Background Image showing all services */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/all_home_services_banner.png" 
            alt="All home services tools and equipment collage background" 
            className="w-full h-full object-cover object-center opacity-65 scale-100 transition-all duration-500"
          />
          {/* Dark Vignette Overlay for Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-slate-950/50 to-slate-950/90" />
          <div className="absolute inset-0 bg-indigo-500/5 mix-blend-overlay" />
        </div>

        {/* Content container */}
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] font-black uppercase tracking-wider rounded-full">
            <span className="w-1 h-1 bg-indigo-400 rounded-full animate-ping" />
            Verified Local Pros
          </span>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-black text-white tracking-tight"
          >
            Professional Home Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto font-medium"
          >
            Find top-rated, background-checked local professionals for installations, cleaning, repairs, and general home maintenance. Instantly schedule slots with secure escrow safety.
          </motion.p>
        </div>
      </div>

      <div className="pb-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto pt-8">
          
          {/* Mobile Category Slider */}
          <div className="lg:hidden w-full overflow-x-auto pb-4 flex gap-2 scrollbar-none px-2 mb-6">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-xs shrink-0 transition-all cursor-pointer ${
                  activeCategory === cat.name
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350"
                }`}
              >
                <cat.icon size={14} />
                {cat.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* SIDEBAR - Desktop Only */}
            <aside className="lg:col-span-3 hidden lg:block">
              <div className="lg:sticky lg:top-32 max-h-[calc(100vh-10rem)] overflow-y-auto scrollbar-none p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm theme-transition">
                <h3 className="text-xs font-black text-slate-450 dark:text-slate-500 uppercase tracking-widest mb-6 px-2">
                  Service Categories
                </h3>
                <nav className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => setActiveCategory(cat.name)}
                      className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-xl font-bold transition-all duration-300 cursor-pointer ${
                        activeCategory === cat.name
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/10"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850"
                      }`}
                    >
                      <cat.icon size={18} />
                      <span className="text-xs tracking-tight">{cat.name}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="lg:col-span-9 space-y-8">
              {/* Search Bar */}
              <motion.div
                initial={false}
                animate={{
                  y: showSearch ? 0 : -100,
                  opacity: showSearch ? 1 : 0,
                }}
                transition={{ duration: 0.4 }}
                className="sticky top-20 md:top-28 z-30"
              >
                <div className="relative group">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 shadow-sm font-bold text-sm text-slate-800 dark:text-slate-200 theme-transition"
                  />
                </div>
              </motion.div>

              {/* Services Grid */}
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {filtered.slice(0, visibleCount).map((service) => (
                    <motion.div
                      key={service.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="group bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl overflow-hidden hover:shadow-md hover:-translate-y-1.5 transition-all duration-500 flex flex-col theme-transition"
                    >
                      {/* Image Section */}
                      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <img
                          src={service.img}
                          alt={service.name}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />

                        {/* Pulse badge */}
                        <div className="absolute top-3 right-3">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white backdrop-blur-md border border-white/20 shadow-sm ${
                              service.badge === "Popular"
                                ? "bg-orange-500/80 animate-pulse"
                                : "bg-indigo-600/80"
                            }`}
                          >
                            {service.badge === "Popular" ? (
                              <Flame size={12} className="animate-bounce" />
                            ) : (
                              <ShieldCheck size={12} />
                            )}
                            {service.badge}
                          </span>
                        </div>

                        {/* Price Badge */}
                        <div className="absolute bottom-3 left-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-3.5 py-1.5 rounded-xl border border-slate-150/40 dark:border-slate-800">
                          <p className="text-xs font-black text-slate-900 dark:text-white">
                            {service.price}
                          </p>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-5 flex flex-col flex-grow">
                        <h4 className="text-base font-extrabold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {service.name}
                        </h4>
                        
                        <p className="text-xs text-slate-500 dark:text-slate-455 leading-relaxed mb-4 line-clamp-2">
                          {service.desc}
                        </p>

                        {/* Rating block */}
                        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                          <div className="flex gap-0.5">
                            {renderStars(service.rating)}
                          </div>
                          <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                            {service.rating}
                          </span>
                          <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500">
                            ({service.reviews})
                          </span>
                        </div>

                        {/* Matched Pros Overlapping Avatars */}
                        <div className="flex items-center gap-2 mb-5">
                          <div className="flex -space-x-1.5">
                            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop" className="w-5 h-5 rounded-full border border-white dark:border-slate-900 object-cover" />
                            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&fit=crop" className="w-5 h-5 rounded-full border border-white dark:border-slate-900 object-cover" />
                            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&fit=crop" className="w-5 h-5 rounded-full border border-white dark:border-slate-900 object-cover" />
                          </div>
                          <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            {Math.floor(service.reviews / 12) + 3} active pros nearby
                          </span>
                        </div>

                        {/* CTA Button */}
                        <Link
                          to={`/services/${service.id}`}
                          className="flex items-center justify-center gap-2 w-full py-3.5 bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white dark:hover:text-white transition-all mt-auto animate-pulse-slow"
                        >
                          View Details <ArrowRight size={14} />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* View More Button */}
              {filtered.length > visibleCount && (
                <div className="flex justify-center pt-8">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 9)}
                    className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-750 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-md hover:-translate-y-0.5 active:scale-95"
                  >
                    View More Services
                  </button>
                </div>
              )}

              {/* Empty State */}
              {filtered.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-24 text-center"
                >
                  <p className="text-slate-550 dark:text-slate-400 font-bold">
                    No services found matching "{searchQuery}"
                  </p>
                </motion.div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
