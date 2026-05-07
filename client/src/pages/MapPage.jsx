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
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import MapComponent from "../components/MapComponent";
import {
  userService,
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
    const storedUser = localStorage.getItem("skillserverUser");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setRole(userData.role || "user");

      if (userData.location && userData.location.coordinates) {
        const [lng, lat] = userData.location.coordinates;
        setMapCenter([lat, lng]);
      }
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = [position.coords.latitude, position.coords.longitude];
          setUserLocation(coords);
          if (!user || !user.location?.coordinates) {
            setMapCenter(coords);
          }
        },
        (error) => {
          console.warn("Unable to get browser location:", error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
      );
    }
  }, []);

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
        setFocusedMarker({
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
        });
        setMapCenter([lat, lng]);
        if (userLocation) {
          setDistanceLabel(
            `Approx. ${getDistanceKm(userLocation, [lat, lng]).toFixed(1)} km from your current location`,
          );
        }
      } else {
        setFocusedMarker(null);
        if (userLocation) {
          setDistanceLabel("");
        }
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
    // This could be used to update user's location or select a service location
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-28 md:pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-6 py-12 flex items-center justify-center">
          <div className="flex flex-col items-center gap-6">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-lg font-semibold text-slate-700">
              Loading map...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header - Fixed Position */}
      <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/95 border-b border-slate-200/60 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <button
                onClick={() =>
                  navigate(
                    role === "worker" ? "/worker-dashboard" : "/user-dashboard",
                  )
                }
                className="group p-3 hover:bg-slate-100 rounded-xl transition-all duration-200 hover:scale-105"
              >
                <ArrowLeft
                  size={22}
                  className="text-slate-600 group-hover:text-slate-800"
                />
              </button>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                  <MapPin size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                    Service Map
                  </h1>
                  <p className="text-sm font-medium text-slate-600 mt-1">
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
                className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-200 hover:scale-105"
                title="Refresh map"
              >
                <RefreshCw size={20} className="text-slate-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content - Add top padding for fixed header */}
      <div className="max-w-7xl mx-auto px-6 py-8 pt-32 md:pt-36">
        {/* Search and Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/60 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={20}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search locations, services, or workers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-slate-400" />
              <div className="flex bg-slate-100 rounded-xl p-1">
                {[
                  { key: "all", label: "All", icon: MapPin },
                  { key: "worker", label: "Workers", icon: Wrench },
                  { key: "user", label: "Users", icon: Users },
                ].map(({ key, label, icon: IconComponent }) => (
                  <button
                    key={key}
                    onClick={() => setSelectedFilter(key)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      selectedFilter === key
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
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
          className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
        >
          {loading ? (
            <div className="flex items-center justify-center h-[600px]">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                <p className="text-slate-600 font-medium">
                  Loading map data...
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 p-6">
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      {role === "worker"
                        ? "Customer & Service Locations"
                        : "Available Workers & Services"}
                    </h2>
                    <p className="text-sm text-slate-600 mt-2">
                      {filteredMarkers.length} location
                      {filteredMarkers.length !== 1 ? "s" : ""} found
                      {searchQuery && ` for "${searchQuery}"`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 px-4 py-2 rounded-lg">
                    <Navigation size={16} className="text-emerald-600" />
                    <span>Interactive Map</span>
                  </div>
                </div>

                {distanceLabel && (
                  <div className="rounded-3xl border border-slate-200/70 bg-emerald-50 px-5 py-4 text-sm text-slate-700 shadow-sm">
                    <strong className="font-semibold">Distance:</strong>{" "}
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
                onLocationSelect={handleLocationSelect}
                interactive={true}
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
              className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/60 text-center"
            >
              <div className="p-3 bg-blue-100 rounded-xl w-fit mx-auto mb-4">
                <Users size={24} className="text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {markers.filter((m) => m.type === "user").length}
              </div>
              <div className="text-sm text-slate-600">Customers</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/60 text-center"
            >
              <div className="p-3 bg-green-100 rounded-xl w-fit mx-auto mb-4">
                <Wrench size={24} className="text-green-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {markers.filter((m) => m.type === "worker").length}
              </div>
              <div className="text-sm text-slate-600">Workers</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/60 text-center"
            >
              <div className="p-3 bg-emerald-100 rounded-xl w-fit mx-auto mb-4">
                <MapPin size={24} className="text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {markers.length}
              </div>
              <div className="text-sm text-slate-600">Total Locations</div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
