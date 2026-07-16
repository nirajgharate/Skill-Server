import React, { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Star,
  Shield,
  Award,
  Users,
  MapPin,
} from "lucide-react";

export default function ServiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const allServices = [
    {
      id: 1,
      name: "Circuit Diagnostics",
      cat: "Electrical",
      badge: "Verified",
      price: "₹499",
      rating: 4.8,
      reviews: 324,
      desc: "Full home wiring safety checks, fault repairs, and certified diagnostics.",
      fullDetail:
        "Our diagnostics involve a comprehensive thermal scan of distribution boards and insulation resistance testing. We identify hidden faults before they become hazards. Using advanced thermographic imaging and multimeters.",
      included: [
        "Thermal fault scanning",
        "MDB & DB inspection",
        "Safety report",
        "Fault recommendations",
      ],
      features: [
        "30-minute response time",
        "Certified technicians",
        "Warranty included",
      ],
      img: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1200",
    },
    {
      id: 2,
      name: "Emergency Plumbing",
      cat: "Plumbing",
      badge: "Popular",
      price: "₹599",
      rating: 4.9,
      reviews: 512,
      desc: "Fast-response leak detection and fixture repairs available 24/7.",
      fullDetail:
        "We provide rapid-response pressure testing and acoustic leak detection to pinpoint hidden pipe bursts. Most repairs completed in a single visit. Available on weekends and public holidays.",
      included: [
        "Acoustic leak detection",
        "High-pressure testing",
        "Debris cleanup",
        "Temporary solutions provided",
      ],
      features: ["24/7 availability", "No call-out charge", "Parts warranty"],
      img: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=1200",
    },
    {
      id: 3,
      name: "Deep Home Cleaning",
      cat: "Cleaning",
      badge: "Verified",
      price: "₹1299",
      rating: 4.7,
      reviews: 418,
      desc: "Full sanitization for every corner of your home.",
      fullDetail:
        "HEPA-filter vacuuming and steam-sanitization of high-touch areas, floors, and upholstery using non-toxic chemicals. Eco-friendly and pet-safe cleaning solutions.",
      included: [
        "Upholstery steaming",
        "Kitchen degreasing",
        "Window track cleaning",
        "Carpet shampooing",
      ],
      features: ["Eco-friendly products", "Pet-safe", "2-year guarantee"],
      img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1200",
    },
    {
      id: 4,
      name: "AC Gas Refilling",
      cat: "Appliance Repair",
      badge: "Verified",
      price: "₹2499",
      rating: 4.8,
      reviews: 267,
      desc: "Optimizing cooling efficiency for your AC units.",
      fullDetail:
        "Recharging refrigerant gas (R32/R410) and checking for coil leaks to restore maximum cooling performance. Includes vacuum flushing and pressure testing.",
      included: [
        "Gas pressure check",
        "Leak brazing",
        "Filter cleaning",
        "Performance test",
      ],
      features: ["Original gas only", "Leak detection", "Year warranty"],
      img: "https://images.unsplash.com/photo-1626806787426-5910811b6325?q=80&w=1200",
    },
    {
      id: 5,
      name: "Door & Window Repair",
      cat: "Carpentry",
      badge: "Popular",
      price: "₹399",
      rating: 4.6,
      reviews: 189,
      desc: "Fixing sagging frames and broken hinges.",
      fullDetail:
        "Re-aligning door frames, fixing sliding window tracks, and replacing worn-out hinges for smooth operation. Expert jointery and frame correction.",
      included: [
        "Alignment check",
        "Hinge lubrication",
        "Gap sealing",
        "Track adjustment",
      ],
      features: ["Same-day service", "Quality hinges", "6-month warranty"],
      img: "https://images.unsplash.com/photo-1505015920881-0f83c2f7c95e?q=80&w=1200",
    },
    {
      id: 6,
      name: "Full Home Painting",
      cat: "Painting",
      badge: "Verified",
      price: "₹5000",
      rating: 4.9,
      reviews: 203,
      desc: "Premium wall finish and waterproofing.",
      fullDetail:
        "Multi-layer putty application followed by premium emulsion paint and anti-damp treatment for long-lasting walls. ISI-certified paints with 5-year durability.",
      included: [
        "Wall puttying",
        "Sanding & Priming",
        "Two-coat finish",
        "Anti-damp treatment",
      ],
      features: [
        "Premium paint brands",
        "Color consultation",
        "5-year guarantee",
      ],
      img: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1200",
    },
    {
      id: 7,
      name: "Pest Control",
      cat: "Cleaning",
      badge: "Verified",
      price: "₹899",
      rating: 4.7,
      reviews: 156,
      desc: "Odorless treatment for a pest-free home.",
      fullDetail:
        "Gel-based cockroach treatment and herbal spray for ants and termites. Completely safe for kids and pets. Follow-up visits included.",
      included: [
        "Kitchen gel treatment",
        "Drainage cleaning",
        "Herbal spray",
        "Follow-up visit",
      ],
      features: [
        "Safe for children",
        "Pet-friendly",
        "Monthly follow-ups free",
      ],
      img: "https://images.unsplash.com/photo-1587304084745-921182098000?q=80&w=1200",
    },
    {
      id: 8,
      name: "Washing Machine Repair",
      cat: "Appliance Repair",
      badge: "Verified",
      price: "₹550",
      rating: 4.8,
      reviews: 298,
      desc: "Fixing drum issues and drainage clogs.",
      fullDetail:
        "Expert diagnostics for both Front-load and Top-load machines, including motor repair and PCB troubleshooting. Genuine spare parts used.",
      included: [
        "Motor inspection",
        "Drain pump cleaning",
        "Inlet valve check",
        "Filter replacement",
      ],
      features: ["All brands supported", "Genuine parts", "Warranty on repair"],
      img: "https://images.unsplash.com/photo-1520333789090-1afc82db536a?q=80&w=1200",
    },
    {
      id: 9,
      name: "CCTV Installation",
      cat: "Security",
      badge: "Popular",
      price: "₹1999",
      rating: 4.9,
      reviews: 412,
      desc: "Secure your home with smart surveillance.",
      fullDetail:
        "Strategic placement of IP/Analog cameras with mobile app integration for 24/7 remote monitoring. Cloud storage and local backup options available.",
      included: [
        "Camera mounting",
        "DVR/NVR setup",
        "Mobile app sync",
        "Cable management",
      ],
      features: ["HD quality (1080p)", "Night vision", "2-year warranty"],
      img: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=1200",
    },
    {
      id: 10,
      name: "Furniture Assembly",
      cat: "Carpentry",
      badge: "Verified",
      price: "₹699",
      rating: 4.7,
      reviews: 234,
      desc: "Professional assembly for flat-pack furniture.",
      fullDetail:
        "Fast and secure assembly of wardrobes, beds, and tables. We ensure every bolt is tightened to manufacturer specs. Packaging handled responsibly.",
      included: [
        "Unboxing",
        "Precision assembly",
        "Floor protection",
        "Debris removal",
      ],
      features: [
        "IKEA specialists",
        "Quick service",
        "3-year assembly warranty",
      ],
      img: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=1200",
    },
    {
      id: 11,
      name: "Smart Lock Installation",
      cat: "Security",
      badge: "Popular",
      price: "₹1299",
      rating: 4.8,
      reviews: 178,
      desc: "Install smart locks and security systems.",
      fullDetail:
        "Professional installation of biometric and app-controlled smart locks. Compatible with all door types. Remote access setup included.",
      included: [
        "Lock installation",
        "Biometric setup",
        "App configuration",
        "Manual provided",
      ],
      features: ["All major brands", "24/7 support", "3-year warranty"],
      img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200",
    },
    {
      id: 12,
      name: "Microwave Oven Repair",
      cat: "Appliance Repair",
      badge: "Verified",
      price: "₹350",
      rating: 4.6,
      reviews: 145,
      desc: "Expert repair for all microwave models.",
      fullDetail:
        "Quick diagnosis and repair of magnetron and control board issues. Parts tested before installation. Works on all major brands.",
      included: [
        "Diagnostics",
        "Component testing",
        "Part replacement",
        "Performance check",
      ],
      features: ["Same-day service", "Genuine parts", "1-year warranty"],
      img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=1200",
    },
    {
      id: 13,
      name: "Fan Installation",
      cat: "Electrical",
      badge: "Verified",
      price: "₹399",
      rating: 4.7,
      reviews: 267,
      desc: "Install ceiling and exhaust fans safely.",
      fullDetail:
        "Professional mounting of ceiling fans with vibration-free balance. Electrical connections as per safety standards. Includes initial cleaning.",
      included: [
        "Bracket installation",
        "Electrical connection",
        "Blade balancing",
        "Trial run",
      ],
      features: [
        "All brands supported",
        "Vibration-free",
        "2-year service free",
      ],
      img: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=1200",
    },
    {
      id: 14,
      name: "Wall Texture & Wallpaper",
      cat: "Painting",
      badge: "Verified",
      price: "₹2999",
      rating: 4.8,
      reviews: 156,
      desc: "Decorative wall treatments and wallpaper.",
      fullDetail:
        "Professional wallpaper application or textured finish for accent walls. Design consultation included. Non-invasive removal service available.",
      included: [
        "Surface prep",
        "Wallpaper/texture application",
        "Edge finishing",
        "Cleanup",
      ],
      features: [
        "Imported wallpapers",
        "Design consultation",
        "18-month guarantee",
      ],
      img: "https://images.unsplash.com/photo-1578500494198-246f612d03b3?q=80&w=1200",
    },
    {
      id: 15,
      name: "Kitchen Basin Installation",
      cat: "Plumbing",
      badge: "Verified",
      price: "₹1199",
      rating: 4.7,
      reviews: 189,
      desc: "Professional sink and basin installation.",
      fullDetail:
        "Experienced installation of kitchen sinks with proper plumbing connections. Leak-proof sealing and water pressure testing included.",
      included: [
        "Sink installation",
        "Plumbing connections",
        "Sealing & waterproofing",
        "Pressure test",
      ],
      features: ["All basin types", "Leak guarantee", "2-year service free"],
      img: "https://images.unsplash.com/photo-1584622281867-8fc18f4be5f2?q=80&w=1200",
    },
    {
      id: 16,
      name: "AC Deep Cleaning",
      cat: "HVAC",
      badge: "Popular",
      price: "₹999",
      rating: 4.9,
      reviews: 345,
      desc: "Complete AC cleaning and maintenance.",
      fullDetail:
        "Full AC unit disassembly and chemical cleaning. Condenser coil cleaning with high-pressure spray. Improves cooling by 30-40%.",
      included: [
        "Unit disassembly",
        "Coil chemical cleaning",
        "Filter replacement",
        "Gas pressure check",
      ],
      features: [
        "Efficiency improvement",
        "Reduces bill by 20%",
        "Year warranty",
      ],
      img: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?q=80&w=1200",
    },
    {
      id: 17,
      name: "Water Tank Cleaning",
      cat: "Cleaning",
      badge: "Verified",
      price: "₹749",
      rating: 4.8,
      reviews: 223,
      desc: "Hygienic water tank cleaning and sanitization.",
      fullDetail:
        "Safe tank entry with complete drainage and scrubbing. Chlorine-based sanitization and disinfection. Food-grade safe chemicals only.",
      included: [
        "Tank drainage",
        "Manual scrubbing",
        "Sanitization",
        "Refilling assist",
      ],
      features: [
        "Health department certified",
        "Food-grade sanitizers",
        "All tank sizes",
      ],
      img: "https://images.unsplash.com/photo-1585864299869-97e852a4a372?q=80&w=1200",
    },
    {
      id: 18,
      name: "WiFi & Network Setup",
      cat: "Electrical",
      badge: "Verified",
      price: "₹599",
      rating: 4.7,
      reviews: 298,
      desc: "Install and optimize home WiFi networks.",
      fullDetail:
        "Professional router placement for maximum coverage. WiFi optimization for streaming and gaming. Security setup and password management included.",
      included: [
        "Router installation",
        "Coverage optimization",
        "Security setup",
        "Device connection",
      ],
      features: [
        "All router brands",
        "Speed optimization",
        "Free re-setup (1 year)",
      ],
      img: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200",
    },
  ];

  const mockPros = [
    { name: "Rahul S.", rating: 4.9, bookings: 218, img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&fit=crop", desc: "Certified pro. Specialized in fast diagnostics and high-precision fixes." },
    { name: "Priya D.", rating: 4.8, bookings: 164, img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&fit=crop", desc: "Detail-oriented specialist with 5+ years experience in quality checks." },
    { name: "Amit K.", rating: 4.7, bookings: 98, img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&fit=crop", desc: "Prompt response. Verified master handyman with all tools equipped." }
  ];

  const service = allServices.find((s) => String(s.id) === String(id));

  if (!service) return null;

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070B16] pt-32 pb-24 px-4 md:px-8 transition-colors duration-500">
      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="max-w-6xl mx-auto mb-8"
      >
        <Link
          to="/services"
          className="inline-flex items-center gap-2.5 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-all group"
        >
          <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 group-hover:scale-105 transition-transform theme-transition">
            <ArrowLeft size={14} />
          </div>
          Back to Services
        </Link>
      </motion.div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- MAIN COLUMN (Span 2) --- */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Service Banner Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative h-80 md:h-96 rounded-[2rem] overflow-hidden shadow-sm border border-slate-200/30 dark:border-slate-850"
          >
            <img
              src={service.img}
              alt={service.name}
              className="w-full h-full object-cover brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/30 to-transparent"></div>

            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex gap-2 mb-3">
                <span className="px-3 py-1 bg-white/15 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider rounded-full border border-white/20">
                  {service.cat}
                </span>
                <span
                  className={`px-3 py-1 text-white text-[10px] font-black uppercase tracking-wider rounded-full ${
                    service.badge === "Popular"
                      ? "bg-orange-500/90 animate-pulse"
                      : "bg-indigo-600/90"
                  }`}
                >
                  {service.badge}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">{service.name}</h1>
            </div>
          </motion.div>

          {/* Quick Metrics Bar */}
          <motion.div {...fadeInUp} className="grid grid-cols-3 gap-4">
            {[
              { label: "Rating", value: `${service.rating} ★`, icon: Star },
              { label: "Reviews", value: `${service.reviews} Verified`, icon: Users },
              { label: "Response", value: "30 Mins", icon: Clock },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/60 text-center shadow-sm theme-transition"
              >
                <item.icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
                <p className="text-base font-extrabold text-slate-900 dark:text-white transition-colors">{item.value}</p>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">{item.label}</p>
              </div>
            ))}
          </motion.div>

          {/* About Section */}
          <motion.div
            {...fadeInUp}
            className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/60 shadow-sm theme-transition"
          >
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
              About this service
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium transition-colors">
              {service.fullDetail}
            </p>
          </motion.div>

          {/* What's Included */}
          <motion.div
            {...fadeInUp}
            className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/60 shadow-sm theme-transition"
          >
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-5 tracking-tight">
              What's included in the box
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {service.included.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200/30 dark:border-slate-800/60">
                  <CheckCircle2
                    size={18}
                    className="text-emerald-500 shrink-0 mt-0.5"
                  />
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Featured Experts Carousel (SOUL COMPONENT) */}
          <motion.div
            {...fadeInUp}
            className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/60 shadow-sm theme-transition"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Featured Professionals Nearby
                </h3>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                   KYC verified, top-rated local experts specializing in {service.cat}
                </p>
              </div>
              <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-3 py-1 rounded-full shrink-0 h-fit w-fit uppercase tracking-widest">
                Active Match Online
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {mockPros.map((pro, index) => (
                <div 
                  key={index}
                  className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl flex flex-col items-center text-center hover:shadow-md transition-all duration-300"
                >
                  <div className="relative w-16 h-16 rounded-full overflow-hidden mb-3 border border-slate-200 dark:border-slate-800">
                    <img src={pro.img} alt={pro.name} className="w-full h-full object-cover" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 absolute bottom-0.5 right-0.5" />
                  </div>

                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">{pro.name}</h4>
                  <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                    <Star className="text-amber-500 fill-amber-500" size={12} />
                    <span className="font-bold text-slate-700 dark:text-slate-300">{pro.rating}</span>
                    <span className="text-[10px] text-slate-500">({pro.bookings} bookings)</span>
                  </div>

                  <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed mt-3 line-clamp-2">
                    {pro.desc}
                  </p>

                  <button 
                    onClick={() => navigate(`/services/${id}/workers`)}
                    className="mt-4 w-full py-2 bg-white dark:bg-slate-900 hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white dark:hover:text-white border border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                  >
                    Direct Match
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* How It Works Timeline */}
          <motion.div
            {...fadeInUp}
            className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/60 shadow-sm theme-transition"
          >
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
              How booking works
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              {[
                { step: "01", title: "Select Slot", desc: "Choose date & time that suits your schedule." },
                { step: "02", title: "Pro Assigned", desc: "KyC verified service expert accepts the job." },
                { step: "03", title: "Secure Release", desc: "Funds held in escrow. Pay only after work approval." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start relative">
                  <div className="text-2xl font-black text-indigo-600/20 dark:text-indigo-400/20 tracking-tighter leading-none shrink-0 select-none">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mb-1">{item.title}</h4>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* FAQs */}
          <motion.div
            {...fadeInUp}
            className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/60 shadow-sm theme-transition"
          >
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-5 tracking-tight">
              Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              {[
                { q: "How long does the service take?", a: "Usually 45 minutes to 2 hours depending on the scope of work." },
                { q: "Is there a cancellation charge?", a: "Free cancellation up to 2 hours before the scheduled appointment." },
                { q: "Do you provide a warranty?", a: "Yes, we offer up to 6 months warranty on parts and workmanship." }
              ].map((item, i) => (
                <div key={i} className="pb-4 border-b border-slate-100 dark:border-slate-800 last:border-none last:pb-0">
                  <p className="font-extrabold text-slate-800 dark:text-slate-200 text-sm mb-1">{item.q}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-medium leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* --- STICKY SIDEBAR (Span 1) --- */}
        <aside className="lg:sticky lg:top-32 h-fit">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200/50 dark:border-slate-800/60 shadow-sm theme-transition"
          >
            {/* Pricing Section */}
            <div className="mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Starting From</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  {service.price}
                </span>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">/visit</span>
              </div>
            </div>

            {/* Rating Stars Summary */}
            <div className="mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-1">
                <Star className="text-amber-500 fill-amber-500" size={16} />
                <span className="font-extrabold text-slate-900 dark:text-white text-sm">{service.rating}</span>
              </div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {service.reviews} verified reviews
              </p>
            </div>

            {/* CTAs */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => navigate(`/services/${id}/workers`)}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                Book Now <ChevronRight size={16} />
              </button>
              
              <button className="w-full py-3 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer border border-slate-200/50 dark:border-slate-800">
                Save for Later
              </button>
              
              <button
                onClick={() => navigate("/map")}
                className="w-full py-3 bg-green-50 dark:bg-green-950/20 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-green-200/30 dark:border-green-800/40"
              >
                <MapPin size={14} />
                View on Map
              </button>
            </div>

            {/* Trust List */}
            <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
              {[
                { icon: Shield, text: "100% Secure Transaction" },
                { icon: Clock, text: "Free Cancellation" },
                { icon: Award, text: "Verified Professionals" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-xs">
                  <item.icon
                    size={16}
                    className="text-indigo-600 dark:text-indigo-400 flex-shrink-0"
                  />
                  <span className="text-slate-500 dark:text-slate-400 font-bold">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Insured Alert */}
            <div className="mt-6 p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-100/40 dark:border-emerald-900/30 flex gap-2.5">
              <ShieldCheck
                size={18}
                className="text-emerald-500 flex-shrink-0 mt-0.5"
              />
              <p className="text-[10px] text-emerald-800 dark:text-emerald-400 font-bold leading-normal">
                Insured service matches with satisfaction protection.
              </p>
            </div>
            
          </motion.div>
        </aside>

      </div>
    </div>
  );
}
