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
  const [showStickyControls, setShowStickyControls] = useState(true);
  const [onlyNearby, setOnlyNearby] = useState(false);
  const [userCoords, setUserCoords] = useState(null);

  const toRadians = (degrees) => degrees * (Math.PI / 180);
  const getDistanceKm = (coordA, coordB) => {
    const [lat1, lon1] = coordA;
    const [lat2, lon2] = coordB;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return 6371 * c;
  };

  const handleNearbyToggle = () => {
    if (onlyNearby) {
      setOnlyNearby(false);
    } else {
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser");
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoords([position.coords.latitude, position.coords.longitude]);
          setOnlyNearby(true);
        },
        (err) => {
          console.error("Geolocation error:", err);
          alert("Could not access your location. Please check browser permissions.");
        }
      );
    }
  };

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
    if (onlyNearby && userCoords) {
      filtered = filtered.map(worker => {
        if (worker.location?.coordinates) {
          const [lng, lat] = worker.location.coordinates;
          const distance = getDistanceKm(userCoords, [lat, lng]);
          return { ...worker, distance };
        }
        return worker;
      });

      // Sort by distance (closest first)
      filtered.sort((a, b) => {
        if (a.distance !== undefined && b.distance !== undefined) {
          return a.distance - b.distance;
        }
        return 0;
      });
    } else {
      // Remove temporary distance property if onlyNearby is false
      filtered = filtered.map(worker => {
        const { distance, ...rest } = worker;
        return rest;
      });

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
        filtered.sort((a, b) => getWorkerJobsCount(b) - getWorkerJobsCount(a));
      }
    }

    setFilteredWorkers(filtered);
    if (socket) {
      socket.emit("request_workers", { serviceFilter, activeArea });
    }
  };

  useEffect(() => {
    applyFilters(workers);
  }, [serviceFilter, activeArea, sortBy, onlyNearby, userCoords]);

  const clearFilters = () => {
    setServiceFilter("All");
    setActiveArea("All Areas");
    setAreaInput("");
  };

  const getWorkerJobsCount = (worker) => {
    return (
      worker.totalJobs ??
      worker.totalBookings ??
      worker.jobsCount ??
      worker.bookingsCount ??
      0
    );
  };

  const getWorkerCompletedJobsCount = (worker) => {
    return (
      worker.completedJobs ??
      worker.completedBookings ??
      worker.completedJobCount ??
      worker.jobsCompleted ??
      0
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070B16] pt-32 pb-24 px-4 md:px-8 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <header className="mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#4F46E5]/10 dark:bg-[#4F46E5]/20 rounded-full">
            <UserCheck size={14} className="text-[#4F46E5] dark:text-indigo-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#4F46E5] dark:text-indigo-400">
              Direct Matching
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter">
            Choose your <span className="text-[#4F46E5]">Expert</span>
          </h1>
        </header>

        {/* SEARCH + FILTER */}
        {showStickyControls && (
          <div
            className="relative z-10 mb-12 bg-slate-50 dark:bg-[#070B16] py-4 -mx-4 md:-mx-8 px-4 md:px-8 space-y-4 transition-colors"
          >
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {serviceCategories.map((cat) => (
                <motion.button
                  key={cat.id}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setServiceFilter(cat.id)}
                  className={`px-4 py-3 rounded-2xl font-bold text-sm whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                    serviceFilter === cat.id
                      ? "bg-[#4F46E5] text-white shadow-lg shadow-indigo-200/30 dark:shadow-none"
                      : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-800/80 hover:border-[#4F46E5]/30"
                  }`}
                >
                  <span className="text-lg">{cat.icon}</span>
                  {cat.label}
                </motion.button>
              ))}
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="p-4 bg-white/75 dark:bg-slate-900/80 backdrop-blur-2xl border border-white dark:border-slate-805 rounded-[2rem] shadow-xl shadow-indigo-100/20 dark:shadow-none flex flex-col md:flex-row items-center gap-4 transition-colors"
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
                  onKeyDown={(e) =>
                    e.key === "Enter" && setActiveArea(areaInput)
                  }
                  className="w-full pl-12 pr-24 py-4 bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-[#4F46E5]/5 transition-all"
                />
                <button
                  onClick={() => setActiveArea(areaInput || "All Areas")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-slate-900 dark:bg-indigo-650 text-white text-[10px] font-black uppercase rounded-xl hover:bg-[#4F46E5] dark:hover:bg-indigo-700 transition-colors cursor-pointer"
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
                  className="w-full pl-12 pr-10 py-4 bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest outline-none appearance-none cursor-pointer"
                >
                  <option value="rating">Top Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="experience">Most Experienced</option>
                  <option value="jobs">Most Active</option>
                </select>
              </div>

              {/* Clear Button */}
              {(serviceFilter !== "All" || activeArea !== "All Areas" || onlyNearby) && (
                <button
                  onClick={() => {
                    clearFilters();
                    setOnlyNearby(false);
                  }}
                  className="px-4 py-2 text-[10px] font-black text-red-500 dark:text-red-400 uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all cursor-pointer"
                >
                  Clear All
                </button>
              )}

              {/* Nearby Workers Toggle Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNearbyToggle}
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                  onlyNearby
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200/30"
                    : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 text-slate-800"
                }`}
              >
                <MapPin size={14} className={onlyNearby ? "text-white" : "text-[#4F46E5]"} />
                {onlyNearby ? "Showing Nearby" : "Nearby Workers"}
              </motion.button>
            </motion.div>
          </div>
        )}

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
                  className="group bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-200/50 dark:border-slate-800/60 hover:shadow-2xl transition-all duration-300 flex flex-col"
                >
                  {/* PROFILE PHOTO SECTION */}
                  <div className="relative h-44 bg-gradient-to-br from-[#4F46E5]/20 to-[#0F172A]/20 overflow-hidden">
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
                          <div className="text-5xl font-black text-white mb-1">
                            {worker.name.charAt(0).toUpperCase()}
                          </div>
                          <p className="text-white/60 text-xs font-bold">
                            {worker.profession}
                          </p>
                        </div>
                      </div>
                    )}
                    {/* RATING BADGE */}
                    <motion.div
                      initial={{ scale: 0.8 }}
                      whileHover={{ scale: 1.1 }}
                      className="absolute top-3 right-3 px-2.5 py-1 bg-white/95 dark:bg-slate-905/95 backdrop-blur rounded-full flex items-center gap-1 shadow-lg"
                    >
                      <Star
                        size={10}
                        className="fill-amber-400 text-amber-400"
                      />
                      <span className="text-[10px] font-black text-slate-900 dark:text-white">
                        {worker.rating || 4.8}
                      </span>
                    </motion.div>

                    {/* EXPERTISE BADGE (5+ years) */}
                    {worker.experienceYears >= 5 && (
                      <motion.div
                        initial={{ scale: 0.8 }}
                        whileHover={{ scale: 1.1 }}
                        className="absolute top-3 left-3 px-2.5 py-1 bg-gradient-to-r from-amber-400 to-orange-400 backdrop-blur rounded-full flex items-center gap-1.5 shadow-lg"
                      >
                        <Award size={12} className="text-white" />
                        <span className="text-[10px] font-black text-white">
                          Expert
                        </span>
                      </motion.div>
                    )}

                    {/* VERIFICATION BADGE */}
                    {worker.profileCompletionPercentage === 100 && (
                      <motion.div
                        initial={{ scale: 0.8 }}
                        whileHover={{ scale: 1.1 }}
                        className="absolute bottom-3 left-3 px-2.5 py-1 bg-emerald-500/95 backdrop-blur rounded-full flex items-center gap-1.5 shadow-lg"
                      >
                        <CheckCircle2 size={12} className="text-white" />
                        <span className="text-[10px] font-black text-white">
                          Verified
                        </span>
                      </motion.div>
                    )}
                  </div>

                  {/* CONTENT SECTION */}
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1 tracking-tight">
                      {worker.name}
                    </h3>
                    <p className="text-[10px] font-black text-indigo-650 dark:text-indigo-400 uppercase tracking-[0.15em] mb-3">
                      {worker.profession} • {worker.experienceYears} yrs exp
                    </p>

                    {/* DISTANCE BADGE */}
                    {worker.distance !== undefined && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/20 text-emerald-600 dark:text-emerald-450 text-[9px] font-black uppercase tracking-widest rounded-full self-start mb-2.5 transition-colors">
                        <span className="w-1.2 h-1.2 bg-emerald-500 rounded-full animate-pulse" />
                        {worker.distance.toFixed(1)} km away
                      </div>
                    )}

                    {/* STATS */}
                    <div className="grid grid-cols-3 gap-2 mb-4 p-2.5 bg-slate-50 dark:bg-slate-950/40 rounded-xl transition-colors">
                      <div className="text-center">
                        <p className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">
                          Rate
                        </p>
                        <p className="text-xs font-black text-slate-900 dark:text-slate-200">
                          ₹{worker.hourlyRate}
                          <span className="text-[8px] text-slate-550 dark:text-slate-400">/hr</span>
                        </p>
                      </div>
                      <div className="text-center border-l border-r border-slate-200 dark:border-slate-800">
                        <p className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">
                          Jobs
                        </p>
                        <p className="text-xs font-black text-slate-900 dark:text-slate-200">
                          {getWorkerJobsCount(worker)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">
                          Completed
                        </p>
                        <p className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                          {getWorkerCompletedJobsCount(worker)}
                        </p>
                      </div>
                    </div>

                    {/* LOCATION */}
                    <div className="flex items-center gap-2 mb-3 text-xs">
                      <MapPin size={12} className="text-indigo-650 dark:text-indigo-400" />
                      <span className="font-bold text-slate-700 dark:text-slate-355">
                        {worker.serviceArea}
                      </span>
                    </div>

                    {/* BIO */}
                    {worker.bio && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 line-clamp-2 flex-1">
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
                      className="w-full py-3 bg-[#4F46E5] text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-200/30 dark:shadow-none hover:bg-slate-900 dark:hover:bg-slate-800 transition-all cursor-pointer"
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
