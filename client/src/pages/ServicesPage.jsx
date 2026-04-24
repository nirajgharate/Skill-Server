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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Hero Section */}
      <div className="pt-32 pb-16 px-4 md:px-8 bg-gradient-to-r from-indigo-600 to-blue-600">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-white mb-4"
          >
            Professional Home Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/90 max-w-2xl mx-auto mb-8"
          >
            Trusted experts for all your home maintenance and repair needs
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-3 gap-4 max-w-md mx-auto"
          >
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20">
              <p className="text-2xl font-bold text-white">18+</p>
              <p className="text-xs text-white/70">Services</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20">
              <p className="text-2xl font-bold text-white">4.8★</p>
              <p className="text-xs text-white/70">Avg Rating</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20">
              <p className="text-2xl font-bold text-white">5000+</p>
              <p className="text-xs text-white/70">Reviews</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="pb-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 pt-8">
          {/* SIDEBAR */}
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-32 p-6 bg-white rounded-2xl border border-slate-100 shadow-lg">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 px-2">
                Service Categories
              </h3>
              <nav className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setActiveCategory(cat.name)}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
                      activeCategory === cat.name
                        ? "bg-indigo-600 text-white shadow-lg"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <cat.icon size={18} />
                    <span className="text-sm">{cat.name}</span>
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
              className="sticky top-28 z-30"
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
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 shadow-lg font-medium"
                />
              </div>
            </motion.div>

            {/* Services Grid */}
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((service) => (
                  <motion.div
                    key={service.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="group bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-500"
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={service.img}
                        alt={service.name}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />

                      {/* Badge */}
                      <div className="absolute top-3 right-3">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold text-white backdrop-blur-md border border-white/20 ${
                            service.badge === "Popular"
                              ? "bg-orange-500/80"
                              : "bg-indigo-600/80"
                          }`}
                        >
                          {service.badge === "Popular" ? (
                            <Flame size={12} />
                          ) : (
                            <ShieldCheck size={12} />
                          )}
                          {service.badge}
                        </span>
                      </div>

                      {/* Price Badge */}
                      <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                        <p className="text-sm font-bold text-slate-900">
                          {service.price}
                        </p>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h4 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                        {service.name}
                      </h4>
                      <p className="text-xs text-slate-600 mb-3 line-clamp-2">
                        {service.desc}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
                        <div className="flex gap-0.5">
                          {renderStars(service.rating)}
                        </div>
                        <span className="text-xs font-semibold text-slate-700">
                          {service.rating}
                        </span>
                        <span className="text-xs text-slate-500">
                          ({service.reviews})
                        </span>
                      </div>

                      {/* CTA */}
                      <Link
                        to={`/services/${service.id}`}
                        className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-lg hover:bg-indigo-600 hover:text-white transition-all"
                      >
                        View Details <ArrowRight size={14} />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Empty State */}
            {filtered.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-24 text-center"
              >
                <p className="text-slate-600 font-semibold">
                  No services found matching "{searchQuery}"
                </p>
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
