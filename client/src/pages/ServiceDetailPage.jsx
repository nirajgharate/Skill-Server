import React, { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Star,
  Shield,
  Zap,
  CreditCard,
  Award,
  Heart,
  Check,
  Users,
  MapPin,
  AlertCircle,
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

  const service = allServices.find((s) => String(s.id) === String(id));

  if (!service) return null;

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 pt-32 pb-24 px-4 md:px-8">
      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="max-w-7xl mx-auto mb-10"
      >
        <Link
          to="/services"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-semibold transition-all group"
        >
          <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-200 group-hover:bg-indigo-50 group-hover:scale-110 transition-all">
            <ArrowLeft size={16} />
          </div>
          Back to Services
        </Link>
      </motion.div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative h-96 rounded-2xl overflow-hidden shadow-2xl"
          >
            <img
              src={service.img}
              alt={service.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>

            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex gap-2 mb-3">
                <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/20">
                  {service.cat}
                </span>
                <span
                  className={`px-3 py-1 text-white text-xs font-bold rounded-full ${
                    service.badge === "Popular"
                      ? "bg-orange-500"
                      : "bg-indigo-600"
                  }`}
                >
                  {service.badge}
                </span>
              </div>
              <h1 className="text-4xl font-black text-white">{service.name}</h1>
            </div>
          </motion.div>

          {/* Trust Section */}
          <motion.div {...fadeInUp} className="grid grid-cols-3 gap-4">
            {[
              { label: "Rating", value: service.rating, icon: Star },
              { label: "Reviews", value: service.reviews, icon: Users },
              { label: "Response", value: "30min", icon: Clock },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-xl border border-slate-100 text-center"
              >
                <item.icon className="w-5 h-5 text-indigo-600 mx-auto mb-2" />
                <p className="text-lg font-bold text-slate-900">{item.value}</p>
                <p className="text-xs text-slate-600">{item.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Description */}
          <motion.div
            {...fadeInUp}
            className="bg-white p-6 rounded-2xl border border-slate-100"
          >
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              About This Service
            </h3>
            <p className="text-slate-600 leading-relaxed">
              {service.fullDetail}
            </p>
          </motion.div>

          {/* What's Included */}
          <motion.div
            {...fadeInUp}
            className="bg-white p-6 rounded-2xl border border-slate-100"
          >
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              What's Included
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {service.included.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <CheckCircle2
                    size={20}
                    className="text-green-600 flex-shrink-0 mt-0.5"
                  />
                  <p className="text-sm text-slate-600">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Features & Benefits */}
          <motion.div {...fadeInUp} className="grid grid-cols-2 gap-4">
            {service.features.map((feature, i) => (
              <div
                key={i}
                className="bg-indigo-50 p-4 rounded-xl border border-indigo-100"
              >
                <Check size={20} className="text-indigo-600 mb-2" />
                <p className="text-sm font-semibold text-indigo-900">
                  {feature}
                </p>
              </div>
            ))}
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            {...fadeInUp}
            className="bg-white p-6 rounded-2xl border border-slate-100"
          >
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              Frequently Asked Questions
            </h3>
            <div className="space-y-3">
              {[
                {
                  q: "How long does the service take?",
                  a: "Usually 45 minutes to 2 hours depending on the scope.",
                },
                {
                  q: "Is there a cancellation charge?",
                  a: "Free cancellation up to 2 hours before appointment.",
                },
                {
                  q: "Do you provide warranty?",
                  a: "Yes, 1-2 years warranty on parts and workmanship.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="pb-3 border-b border-slate-100 last:border-b-0"
                >
                  <p className="font-semibold text-slate-900 text-sm mb-1">
                    {item.q}
                  </p>
                  <p className="text-slate-600 text-sm">{item.a}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Booking Card */}
        <aside className="lg:sticky lg:top-32 h-fit">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-lg"
          >
            {/* Price */}
            <div className="mb-6 pb-6 border-b border-slate-100">
              <p className="text-sm text-slate-600 mb-1">Starting From</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-900">
                  {service.price}
                </span>
                <span className="text-slate-600">/visit</span>
              </div>
            </div>

            {/* Rating */}
            <div className="mb-6 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < Math.floor(service.rating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300"
                      }
                    />
                  ))}
                </div>
                <p className="font-bold text-slate-900">{service.rating}</p>
              </div>
              <p className="text-sm text-slate-600">
                {service.reviews} verified reviews
              </p>
            </div>

            {/* Booking Buttons */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => navigate(`/services/${id}/workers`)}
                className="w-full py-4 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
              >
                Book Now <ChevronRight size={18} />
              </button>
              <button className="w-full py-3 bg-slate-100 text-slate-900 font-semibold rounded-lg hover:bg-slate-200 transition-all">
                Save for Later
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="space-y-3 pt-6 border-t border-slate-100">
              {[
                { icon: Shield, text: "100% Secure Transaction" },
                { icon: Clock, text: "Free Cancellation" },
                { icon: Award, text: "Verified Professionals" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <item.icon
                    size={18}
                    className="text-indigo-600 flex-shrink-0"
                  />
                  <span className="text-slate-600 font-medium">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Alert */}
            <div className="mt-6 p-3 bg-green-50 rounded-lg border border-green-200 flex gap-2">
              <AlertCircle
                size={18}
                className="text-green-600 flex-shrink-0 mt-0.5"
              />
              <p className="text-xs text-green-700 font-semibold">
                Expert verified and insured professionals only
              </p>
            </div>
          </motion.div>
        </aside>
      </div>
    </div>
  );
}
