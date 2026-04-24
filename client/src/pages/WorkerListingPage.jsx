import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  ShieldCheck,
  MapPin,
  Search,
  ChevronRight,
  UserCheck,
  X,
  Zap,
  Settings2,
  Timer,
  Loader2,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  Award,
} from "lucide-react";
import API from "../api/api";
import { io } from "socket.io-client";

export default function WorkerListingPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // 1. STATE
  const [serviceFilter, setServiceFilter] = useState(
    location.state?.category || "All",
  );
  const [sortBy, setSortBy] = useState("rating");
  const [areaInput, setAreaInput] = useState("");
  const [activeArea, setActiveArea] = useState("All Areas");
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [socket, setSocket] = useState(null);

  const serviceCategories = [
    { id: "All", label: "All Services", icon: "⚙️" },
    { id: "electrician", label: "Electrician", icon: "⚡" },
    { id: "plumber", label: "Plumber", icon: "🔧" },
    { id: "carpenter", label: "Carpenter", icon: "🔨" },
    { id: "painter", label: "Painter", icon: "🎨" },
    { id: "cleaner", label: "Cleaner", icon: "🧹" },
  ];

  // 2. SOCKET.IO CONNECTION
  useEffect(() => {
    const newSocket = io(
      import.meta.env.VITE_SOCKET_URL || "http://localhost:5000",
      {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      },
    );

    newSocket.on("connect", () => {
      console.log("Connected to Socket.io");
      newSocket.emit("request_workers", { serviceFilter, activeArea });
    });

    newSocket.on("worker_updated", (workerData) => {
      console.log("Worker updated:", workerData);
      fetchWorkers();
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // 3. FETCH DATA AT MOUNT
  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await API.get("/workers");
      setWorkers(response.data || []);
      applyFilters(response.data || []);
    } catch (err) {
      console.error("Error fetching workers:", err);
      const errorMsg =
        err.response?.data?.message || err.message || "Failed to load workers";
      setError(errorMsg);
      setWorkers([]);
    } finally {
      setLoading(false);
    }
  };

  // 4. FILTER LOGIC
  const applyFilters = (workersList) => {
    let filtered = workersList.filter((worker) => {
      const matchesService =
        serviceFilter === "All" ||
        (worker.profession &&
          worker.profession
            .toLowerCase()
            .includes(serviceFilter.toLowerCase()));
      const matchesArea =
        activeArea === "All Areas" ||
        (worker.serviceArea &&
          worker.serviceArea.toLowerCase().includes(activeArea.toLowerCase()));
      return matchesService && matchesArea;
    });

    // Apply sorting
    if (sortBy === "rating") {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "price-low") {
      filtered.sort((a, b) => (a.hourlyRate || 0) - (b.hourlyRate || 0));
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => (b.hourlyRate || 0) - (a.hourlyRate || 0));
    } else if (sortBy === "experience") {
      filtered.sort(
        (a, b) => (b.experienceYears || 0) - (a.experienceYears || 0),
      );
    } else if (sortBy === "jobs") {
      filtered.sort((a, b) => (b.totalJobs || 0) - (a.totalJobs || 0));
    }

    setFilteredWorkers(filtered);
    if (socket) {
      socket.emit("request_workers", { serviceFilter, activeArea });
    }
  };

  useEffect(() => {
    applyFilters(workers);
  }, [serviceFilter, activeArea, sortBy]);

  const clearFilters = () => {
    setServiceFilter("All");
    setActiveArea("All Areas");
    setAreaInput("");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-24 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <header className="mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#4F46E5]/10 rounded-full">
            <UserCheck size={14} className="text-[#4F46E5]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#4F46E5]">
              Direct Matching
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-[#0F172A] tracking-tighter">
            Choose your <span className="text-[#4F46E5]">Expert</span>
          </h1>
        </header>

        {/* SERVICE CATEGORY PILLS */}
        <div className="mb-8 sticky top-28 z-40 bg-[#F8FAFC] py-4 -mx-4 md:-mx-8 px-4 md:px-8">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {serviceCategories.map((cat) => (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.05 }}
                onClick={() => setServiceFilter(cat.id)}
                className={`px-4 py-3 rounded-2xl font-bold text-sm whitespace-nowrap transition-all flex items-center gap-2 ${
                  serviceFilter === cat.id
                    ? "bg-[#4F46E5] text-white shadow-lg shadow-indigo-200/30"
                    : "bg-white text-[#0F172A] border border-black/5 hover:border-[#4F46E5]/30"
                }`}
              >
                <span className="text-lg">{cat.icon}</span>
                {cat.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* FILTER & SORT BAR */}
        <div className="sticky top-44 z-40 mb-12 bg-[#F8FAFC] py-4 -mx-4 md:-mx-8 px-4 md:px-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="p-4 bg-white/70 backdrop-blur-2xl border border-white rounded-[2rem] shadow-xl shadow-indigo-100/20 flex flex-col md:flex-row items-center gap-4"
          >
            {/* Area Filter */}
            <div className="relative w-full md:flex-grow">
              <MapPin
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4F46E5]"
                size={16}
              />
              <input
                type="text"
                placeholder="Search area (e.g. Bandra)"
                value={areaInput}
                onChange={(e) => setAreaInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && setActiveArea(areaInput)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-black/5 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-[#4F46E5]/5 transition-all"
              />
              <button
                onClick={() => setActiveArea(areaInput || "All Areas")}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-[#0F172A] text-white text-[10px] font-black uppercase rounded-xl hover:bg-[#4F46E5] transition-colors"
              >
                Apply
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="relative w-full md:w-auto min-w-[180px]">
              <Settings2
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4F46E5]"
                size={16}
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-12 pr-10 py-4 bg-white border border-black/5 rounded-2xl text-xs font-bold text-[#0F172A] uppercase tracking-widest outline-none appearance-none cursor-pointer"
              >
                <option value="rating">Top Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="experience">Most Experienced</option>
                <option value="jobs">Most Active</option>
              </select>
            </div>

            {/* Clear Button */}
            {(serviceFilter !== "All" || activeArea !== "All Areas") && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-[10px] font-black text-red-500 uppercase tracking-widest hover:bg-red-50 rounded-xl transition-all"
              >
                Clear All
              </button>
            )}
          </motion.div>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-[#4F46E5] mb-4" size={40} />
            <p className="text-slate-500 text-sm font-bold">
              Loading workers...
            </p>
          </div>
        )}

        {/* ERROR STATE */}
        {error && !loading && (
          <div className="p-6 bg-rose-50 border border-rose-200 rounded-[2rem] text-center">
            <p className="text-rose-600 font-bold">{error}</p>
            <button
              onClick={fetchWorkers}
              className="mt-4 px-6 py-2 bg-rose-600 text-white rounded-lg text-sm font-bold hover:bg-rose-700 transition-all"
            >
              Try Again
            </button>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && filteredWorkers.length === 0 && !error && (
          <div className="text-center py-20">
            <UserCheck size={48} className="mx-auto mb-4 text-slate-300" />
            <p className="text-slate-500 font-bold mb-4">
              No workers found matching your criteria
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-[#4F46E5] text-white rounded-xl text-sm font-bold hover:bg-[#4F46E5]/90 transition-all"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* GRID */}
        {!loading && filteredWorkers.length > 0 && (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredWorkers.map((worker) => (
                <motion.div
                  key={worker._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group bg-white rounded-[2rem] overflow-hidden border border-slate-200/50 hover:shadow-2xl transition-all duration-300 flex flex-col"
                >
                  {/* PROFILE PHOTO SECTION */}
                  <div className="relative h-56 bg-gradient-to-br from-[#4F46E5]/20 to-[#0F172A]/20 overflow-hidden">
                    {worker.profilePhoto ? (
                      <motion.img
                        src={worker.profilePhoto}
                        alt={worker.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        whileHover={{ scale: 1.1 }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#4F46E5] to-[#0F172A] flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-6xl font-black text-white mb-2">
                            {worker.name.charAt(0).toUpperCase()}
                          </div>
                          <p className="text-white/60 text-sm font-bold">
                            {worker.profession}
                          </p>
                        </div>
                      </div>
                    )}
                    {/* RATING BADGE */}
                    <motion.div
                      initial={{ scale: 0.8 }}
                      whileHover={{ scale: 1.1 }}
                      className="absolute top-4 right-4 px-3 py-1.5 bg-white/95 backdrop-blur rounded-full flex items-center gap-1.5 shadow-lg"
                    >
                      <Star
                        size={12}
                        className="fill-amber-400 text-amber-400"
                      />
                      <span className="text-xs font-black text-slate-900">
                        {worker.rating || 4.8}
                      </span>
                    </motion.div>

                    {/* EXPERTISE BADGE (5+ years) */}
                    {worker.experienceYears >= 5 && (
                      <motion.div
                        initial={{ scale: 0.8 }}
                        whileHover={{ scale: 1.1 }}
                        className="absolute top-4 left-4 px-3 py-1.5 bg-gradient-to-r from-amber-400 to-orange-400 backdrop-blur rounded-full flex items-center gap-2 shadow-lg"
                      >
                        <Award size={14} className="text-white" />
                        <span className="text-xs font-black text-white">
                          Expert
                        </span>
                      </motion.div>
                    )}

                    {/* VERIFICATION BADGE */}
                    {worker.profileCompletionPercentage === 100 && (
                      <motion.div
                        initial={{ scale: 0.8 }}
                        whileHover={{ scale: 1.1 }}
                        className="absolute bottom-4 left-4 px-3 py-1.5 bg-emerald-500/95 backdrop-blur rounded-full flex items-center gap-2 shadow-lg"
                      >
                        <CheckCircle2 size={14} className="text-white" />
                        <span className="text-xs font-black text-white">
                          Verified
                        </span>
                      </motion.div>
                    )}
                  </div>

                  {/* CONTENT SECTION */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-2xl font-black text-slate-900 mb-1.5 tracking-tight">
                      {worker.name}
                    </h3>
                    <p className="text-[11px] font-black text-[#4F46E5] uppercase tracking-[0.15em] mb-4">
                      {worker.profession} • {worker.experienceYears} yrs exp
                    </p>

                    {/* STATS */}
                    <div className="grid grid-cols-3 gap-3 mb-6 p-3 bg-slate-50 rounded-xl">
                      <div className="text-center">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">
                          Rate
                        </p>
                        <p className="text-sm font-black text-slate-900">
                          ₹{worker.hourlyRate}
                          <span className="text-[9px] text-slate-500">/hr</span>
                        </p>
                      </div>
                      <div className="text-center border-l border-r border-slate-200">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">
                          Jobs
                        </p>
                        <p className="text-sm font-black text-slate-900">
                          {worker.totalJobs || 0}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">
                          Completed
                        </p>
                        <p className="text-sm font-black text-emerald-600">
                          {worker.completedJobs || 0}
                        </p>
                      </div>
                    </div>

                    {/* LOCATION */}
                    <div className="flex items-center gap-2 mb-4 text-sm">
                      <MapPin size={14} className="text-[#4F46E5]" />
                      <span className="font-bold text-slate-700">
                        {worker.serviceArea}
                      </span>
                    </div>

                    {/* BIO */}
                    {worker.bio && (
                      <p className="text-xs text-slate-600 mb-6 line-clamp-2 flex-1">
                        {worker.bio}
                      </p>
                    )}

                    {/* BUTTON */}
                    <motion.button
                      onClick={() =>
                        navigate(`/workers/${worker._id}`, {
                          state: { worker },
                        })
                      }
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full py-4 bg-[#4F46E5] text-white font-black text-sm uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-200/30 hover:bg-[#0F172A] transition-all"
                    >
                      View Profile
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
