import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
  useMapEvent,
} from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers in react-leaflet
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom icons for different types
const userIcon = new Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const workerIcon = new Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const serviceIcon = new Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Component to handle map center updates
function MapController({ center, zoom }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, zoom || 13);
    }
  }, [center, zoom, map]);

  return null;
}

function MapClickHandler({
  onLocationSelect,
  interactive,
  setSelectedPosition,
}) {
  useMapEvent("click", (e) => {
    if (!interactive || !onLocationSelect) return;
    const { lat, lng } = e.latlng;
    setSelectedPosition([lat, lng]);
    onLocationSelect([lat, lng]);
  });

  return null;
}

export default function MapComponent({
  center = [28.6139, 77.209], // Default to Delhi, India
  zoom = 13,
  markers = [],
  paths = [],
  height = "500px",
  showUserLocation = false,
  userLocation: propUserLocation = null,
  onLocationSelect = null,
  interactive = true,
}) {
  const [userLocation, setUserLocation] = useState(propUserLocation || null);
  const [mapCenter, setMapCenter] = useState(center);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains("dark"));

  // Listen to dark mode toggles on document root
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // Sync propUserLocation with local state
  useEffect(() => {
    if (propUserLocation) {
      setUserLocation(propUserLocation);
      if (!center || center[0] === 28.6139) {
        setMapCenter(propUserLocation);
      }
    }
  }, [propUserLocation]);

  // Get user's current location from browser as fallback
  useEffect(() => {
    if (showUserLocation && !propUserLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          if (!center || center[0] === 28.6139) {
            // If default center, use user location
            setMapCenter([latitude, longitude]);
          }
        },
        (error) => {
          console.warn("Error getting user location:", error);
        },
      );
    }
  }, [showUserLocation, propUserLocation, center]);

  const handleMapClick = (e) => {
    if (onLocationSelect && interactive) {
      const { lat, lng } = e.latlng;
      onLocationSelect([lat, lng]);
    }
  };

  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-xl border border-slate-200/60 dark:border-slate-800 relative z-10 transition-colors">
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height, width: "100%" }}
        onClick={handleMapClick}
        zoomControl={interactive}
        scrollWheelZoom={interactive}
        doubleClickZoom={interactive}
        dragging={interactive}
      >
        <TileLayer
          attribution={isDark ? '&copy; <a href="https://carto.com/">CartoDB</a>' : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}
          url={isDark ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
        />

        <MapController center={mapCenter} zoom={zoom} />
        {onLocationSelect && interactive && (
          <MapClickHandler
            onLocationSelect={onLocationSelect}
            interactive={interactive}
            setSelectedPosition={setSelectedPosition}
          />
        )}

        {/* Selected click marker */}
        {selectedPosition && (
          <Marker position={selectedPosition} icon={serviceIcon}>
            <Popup>
              <div className="text-center dark:text-slate-200">
                <div className="font-semibold text-slate-900 dark:text-white">
                  Selected Location
                </div>
                <div className="text-sm text-slate-650 dark:text-slate-400 mt-1">
                  {selectedPosition[0].toFixed(6)},{" "}
                  {selectedPosition[1].toFixed(6)}
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* User location marker */}
        {userLocation && showUserLocation && (
          <Marker position={userLocation} icon={userIcon}>
            <Popup>
              <div className="text-center dark:text-slate-200">
                <div className="font-semibold text-blue-600 dark:text-blue-400">
                  📍 Your Location
                </div>
                <div className="text-sm text-slate-650 dark:text-slate-400 mt-1">
                  {userLocation[0].toFixed(6)}, {userLocation[1].toFixed(6)}
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Path lines */}
        {paths.map((path, index) => (
          <Polyline
            key={`path-${index}`}
            positions={path}
            pathOptions={{ color: isDark ? "#818CF8" : "#2563EB", weight: 4, opacity: 0.75 }}
          />
        ))}

        {/* Custom markers */}
        {markers.map((marker, index) => (
          <Marker
            key={marker.id || index}
            position={marker.position}
            icon={
              marker.type === "worker"
                ? workerIcon
                : marker.type === "service"
                  ? serviceIcon
                  : userIcon
            }
          >
            <Popup>
              <div className="min-w-[200px] dark:text-slate-200">
                <div className="font-semibold text-slate-900 dark:text-white mb-2">
                  {marker.type === "worker"
                    ? "👷"
                    : marker.type === "service"
                      ? "🔧"
                      : "👤"}{" "}
                  {marker.title}
                </div>
                {marker.description && (
                  <div className="text-sm text-slate-650 dark:text-slate-400 mb-2">
                    {marker.description}
                  </div>
                )}
                {marker.rating && (
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-sm font-medium">{marker.rating}</span>
                  </div>
                )}
                {marker.address && (
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    📍 {marker.address}
                  </div>
                )}
                {marker.distance && (
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    📏 {marker.distance}
                  </div>
                )}
                {marker.phone && (
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    📞 {marker.phone}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Controls */}
      {interactive && (
        <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-slate-200/60 dark:border-slate-800 z-[1000] transition-colors duration-300">
          <div className="flex flex-col gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-slate-605 dark:text-slate-300 font-semibold">Users</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-slate-605 dark:text-slate-300 font-semibold">Workers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-slate-605 dark:text-slate-300 font-semibold">Services</span>
            </div>
          </div>
        </div>
      )}

      {/* Location selector hint */}
      {onLocationSelect && interactive && (
        <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-slate-200/60 dark:border-slate-800 z-[1000] transition-colors duration-300">
          <div className="text-xs text-slate-650 dark:text-slate-300 flex items-center gap-2 font-semibold">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            Click on the map to select location
          </div>
        </div>
      )}
    </div>
  );
}
