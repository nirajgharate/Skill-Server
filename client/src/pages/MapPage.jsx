import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Navigation,
  Search,
  Filter,
  Users,
  Wrench,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import MapComponent from "../components/MapComponent";
import {
  bookingService,
  workerService,
} from "../services/api.service";

export default function MapPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("user");
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [focusedMarker, setFocusedMarker] = useState(null);
  const [distanceLabel, setDistanceLabel] = useState("");
  const [mapCenter, setMapCenter] = useState([28.6139, 77.209]); // Default to Delhi

  const toRadians = (degrees) => degrees * (Math.PI / 180);

  const getDistanceKm = (coordA, coordB) => {
    if (!coordA || !coordB) return 0;
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

  useEffect(() => {
    let initialUserCoords = null;
    const storedUser = localStorage.getItem("skillserverUser");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setRole(userData.role || "user");

      if (userData.location && userData.location.coordinates) {
        const [lng, lat] = userData.location.coordinates;
        initialUserCoords = [lat, lng];
        setMapCenter(initialUserCoords);
        setUserLocation(initialUserCoords);
      }
    }

    // Check if we have bookingContext location payload to override
    const bookingContext = location.state?.bookingContext;
    if (bookingContext) {
      if (bookingContext.userId?.location?.coordinates) {
        const [uLng, uLat] = bookingContext.userId.location.coordinates;
        initialUserCoords = [uLat, uLng];
        setUserLocation(initialUserCoords);
      }
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = [position.coords.latitude, position.coords.longitude];
          setUserLocation(coords);
          if (!initialUserCoords) {
            setMapCenter(coords);
          }
        },
        (error) => {
          console.warn("Unable to get browser location:", error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
      );
    }
  }, [location.state]);

  useEffect(() => {
    if (role) {
      loadMapData();
    }
  }, [role, location.state, userLocation]);

  const loadMapData = async () => {
    try {
      setLoading(true);
      const newMarkers = [];
      const focusWorker = location.state?.focusWorker;
      const focusUser = location.state?.focusUser;

      if (role === "worker") {
        const bookings = await bookingService.getWorkerBookings();
        if (Array.isArray(bookings)) {
          bookings.forEach((booking) => {
            if (booking.userId?.location?.coordinates) {
              const [lng, lat] = booking.userId.location.coordinates;
              const distanceValue = userLocation
                ? getDistanceKm(userLocation, [lat, lng])
                : null;

              newMarkers.push({
                id: `user-${booking.userId._id}`,
                type: "user",
                position: [lat, lng],
                title: booking.userId.name || "Customer",
                description: `Booked: ${booking.serviceId?.name || "Service"}`,
                address: booking.address || "Address not provided",
                phone: booking.userId.phone || "",
                distance: distanceValue
                  ? `${distanceValue.toFixed(1)} km away`
                  : undefined,
                distanceValue,
              });
            }
          });
        }
      } else {
        const response = await workerService.getAllWorkers();
        const workers = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
            ? response.data
            : response?.data || [];

        workers.forEach((workerData) => {
          if (workerData?.location?.coordinates) {
            const [lng, lat] = workerData.location.coordinates;
            const distanceValue = userLocation
              ? getDistanceKm(userLocation, [lat, lng])
              : null;

            newMarkers.push({
              id: `worker-${workerData._id}`,
              type: "worker",
              position: [lat, lng],
              title: workerData.name || "Worker",
              description: `Service: ${workerData.profession || workerData.service || "Service"}`,
              rating: workerData.rating || 5.0,
              address:
                workerData.location?.address ||
                workerData.address ||
                "Service location",
              phone: workerData.phone || "",
              distance: distanceValue
                ? `${distanceValue.toFixed(1)} km away`
                : undefined,
              distanceValue,
            });
          }
        });

        if (userLocation) {
          newMarkers.sort(
            (a, b) => (a.distanceValue || 0) - (b.distanceValue || 0),
          );
          newMarkers.splice(10); // keep the 10 nearest workers only
        }
      }

      if (focusWorker?.location?.coordinates) {
        const [lng, lat] = focusWorker.location.coordinates;
        const focused = {
          id: `focus-worker-${focusWorker._id}`,
          type: "worker",
          position: [lat, lng],
          title: focusWorker.name || "Selected worker",
          description:
            focusWorker.profession || focusWorker.service || "Selected worker",
          address: focusWorker.location?.address || focusWorker.address || "",
          distance: userLocation
            ? `${getDistanceKm(userLocation, [lat, lng]).toFixed(1)} km away`
            : undefined,
        };
        setFocusedMarker(focused);
        setMapCenter([lat, lng]);
        if (userLocation) {
          setDistanceLabel(
            `Approx. ${getDistanceKm(userLocation, [lat, lng]).toFixed(1)} km from your current location`,
          );
        }
      } else if (focusUser?.location?.coordinates) {
        const [lng, lat] = focusUser.location.coordinates;
        const focused = {
          id: `focus-user-${focusUser._id}`,
          type: "user",
          position: [lat, lng],
          title: focusUser.name || "Selected customer",
          description: "Service address location",
          address: focusUser.location?.address || focusUser.address || "",
          distance: userLocation
            ? `${getDistanceKm(userLocation, [lat, lng]).toFixed(1)} km away`
            : undefined,
        };
        setFocusedMarker(focused);
        setMapCenter([lat, lng]);
        if (userLocation) {
          setDistanceLabel(
            `Approx. ${getDistanceKm(userLocation, [lat, lng]).toFixed(1)} km from your location`,
          );
        }
      } else {
        setFocusedMarker(null);
        setDistanceLabel("");
      }

      setMarkers(newMarkers);
    } catch (error) {
      console.error("Error loading map data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMarkers = markers.filter((marker) => {
    const matchesFilter =
      selectedFilter === "all" || marker.type === selectedFilter;
    const matchesSearch =
      !searchQuery ||
      marker.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      marker.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const displayMarkers = focusedMarker
    ? [
        focusedMarker,
        ...filteredMarkers.filter((marker) => marker.id !== focusedMarker.id),
      ]
    : filteredMarkers;

  const handleLocationSelect = (coordinates) => {
    console.log("Selected location:", coordinates);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#070B16] pt-28 md:pt-32 pb-12 flex items-center justify-center transition-colors duration-500">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">
            Loading map...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070B16] transition-colors duration-500">
      {/* Header - Fixed Position */}
      <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/95 dark:bg-slate-900/95 border-b border-slate-200/60 dark:border-slate-800 shadow-sm transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <button
                onClick={() =>
                  navigate(
                    role === "worker" ? "/worker-dashboard" : "/user-dashboard",
                  )
                }
                className="group p-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-all duration-200 hover:scale-105 cursor-pointer text-slate-600 dark:text-slate-300"
              >
                <ArrowLeft
                  size={22}
                  className="group-hover:text-slate-800 dark:group-hover:text-white"
                />
              </button>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                  <MapPin size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    Service Map
                  </h1>
                  <p className="text-sm font-medium text-slate-550 dark:text-slate-400 mt-1">
                    {role === "worker"
                      ? "Find your customers and service locations"
                      : "Discover workers and services near you"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={loadMapData}
                className="p-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-all duration-200 hover:scale-105 cursor-pointer text-slate-650 dark:text-slate-305"
                title="Refresh map"
              >
                <RefreshCw size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content - Add top padding for fixed header */}
      <div className="max-w-7xl mx-auto px-6 py-8 pt-32 md:pt-36">
        {/* Search and Filters */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/60 dark:border-slate-800 mb-6 transition-colors duration-500">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search
                size={20}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500"
              />
              <input
                type="text"
                placeholder="Search locations, services, or workers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Filter size={20} className="text-slate-400 dark:text-slate-500 hidden md:block" />
              <div className="flex bg-slate-100 dark:bg-slate-950 rounded-xl p-1 border border-transparent dark:border-slate-850 w-full md:w-auto">
                {[
                  { key: "all", label: "All", icon: MapPin },
                  { key: "worker", label: "Workers", icon: Wrench },
                  { key: "user", label: "Users", icon: Users },
                ].map(({ key, label, icon: IconComponent }) => (
                  <button
                    key={key}
                    onClick={() => setSelectedFilter(key)}
                    className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                      selectedFilter === key
                        ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <IconComponent size={16} />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Map Container - Professional Styling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-200/60 dark:border-slate-800 overflow-hidden transition-colors duration-500"
        >
          {loading ? (
            <div className="flex items-center justify-center h-[600px]">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-emerald-200 dark:border-emerald-900 border-t-emerald-600 rounded-full animate-spin"></div>
                <p className="text-slate-600 dark:text-slate-400 font-medium">
                  Loading map data...
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 p-6">
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                      {role === "worker"
                        ? "Customer & Service Locations"
                        : "Available Workers & Services"}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                      {filteredMarkers.length} location
                      {filteredMarkers.length !== 1 ? "s" : ""} found
                      {searchQuery && ` for "${searchQuery}"`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-505 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/60 border border-transparent dark:border-slate-850 px-4 py-2 rounded-lg w-fit">
                    <Navigation size={16} className="text-emerald-500" />
                    <span>Interactive Map</span>
                  </div>
                </div>

                {distanceLabel && (
                  <div className="rounded-3xl border border-emerald-100/30 dark:border-emerald-900/30 bg-emerald-50 dark:bg-emerald-950/20 px-5 py-4 text-sm text-emerald-800 dark:text-emerald-400 font-bold shadow-sm">
                    <strong className="font-extrabold">Route details:</strong>{" "}
                    {distanceLabel}
                  </div>
                )}
              </div>

              <MapComponent
                center={mapCenter}
                zoom={13}
                markers={displayMarkers}
                height="650px"
                showUserLocation={true}
                userLocation={userLocation}
                onLocationSelect={handleLocationSelect}
                interactive={true}
                paths={
                  userLocation && focusedMarker?.position
                    ? [[userLocation, focusedMarker.position]]
                    : []
                }
              />
            </div>
          )}
        </motion.div>

        {/* Stats */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/60 dark:border-slate-800 text-center transition-colors duration-500"
            >
              <div className="p-3 bg-blue-100 dark:bg-blue-950/40 rounded-xl w-fit mx-auto mb-4 text-blue-600 dark:text-blue-400">
                <Users size={24} />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {markers.filter((m) => m.type === "user").length}
              </div>
              <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">Customers</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/60 dark:border-slate-800 text-center transition-colors duration-500"
            >
              <div className="p-3 bg-green-100 dark:bg-green-950/40 rounded-xl w-fit mx-auto mb-4 text-green-600 dark:text-green-400">
                <Wrench size={24} />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {markers.filter((m) => m.type === "worker").length}
              </div>
              <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">Workers</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/60 dark:border-slate-800 text-center transition-colors duration-500"
            >
              <div className="p-3 bg-emerald-100 dark:bg-emerald-950/40 rounded-xl w-fit mx-auto mb-4 text-emerald-600 dark:text-emerald-400">
                <MapPin size={24} />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {markers.length}
              </div>
              <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">Total Locations</div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
