"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useAura, ROUTE_PATH_COORDINATES } from "@/context/AuraContext";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import {
  Navigation,
  Key,
  Crosshair,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  MapPin,
} from "lucide-react";

// Dark Industrial Utility Google Maps Styling
const DARK_MAP_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#0D0F12" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0D0F12" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8B929E" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#F2F4F7" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#52565E" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#13171D" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#1F232B" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#2A2F38" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#2A2F38" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#16191E" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#16191E" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#080A0D" }],
  },
];

// Tactical Daylight Google Maps Styling
const DAYLIGHT_MAP_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#F4F4F0" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#FFFFFF" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#111214" }] },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#E0E2E8" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#D4D6DC" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#D4D6DC" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#D9E2EC" }],
  },
];

interface GoogleTacticalMapProps {
  onCadFallback?: () => void;
}

export function GoogleTacticalMap({ onCadFallback }: GoogleTacticalMapProps) {
  const {
    ambulance,
    waypoints,
    simulationProgress,
    theme,
    mapMode,
    setMapMode,
    googleMapsApiKey,
    setGoogleMapsApiKey,
    selectedWaypointId,
    setSelectedWaypointId,
  } = useAura();

  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<HTMLDivElement>(null);

  const googleMapInstanceRef = useRef<google.maps.Map | null>(null);
  const ambMarkerRef = useRef<google.maps.Marker | null>(null);
  const geofenceCircleRef = useRef<google.maps.Circle | null>(null);
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const waypointMarkersRef = useRef<google.maps.Marker[]>([]);

  // Leaflet map instance and layers
  const leafletInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const leafletAmbMarkerRef = useRef<any>(null);
  const leafletGeofenceRef = useRef<any>(null);

  const [isGoogleLoaded, setIsGoogleLoaded] = useState<boolean>(false);
  const [googleLoadError, setGoogleLoadError] = useState<string | null>(null);
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [tempApiKey, setTempApiKey] = useState<string>(googleMapsApiKey);

  // Time saved computation
  const timeSavedFormatted = useMemo(() => {
    const totalSec = Math.round(255 + simulationProgress * 150);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `+${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }, [simulationProgress]);

  // Next target calculation
  const nextTargetInfo = useMemo(() => {
    const currentMeters = ambulance.distanceTraveledMeters;
    const targetWp =
      waypoints.find((w) => w.distanceMetersFromStart > currentMeters) ||
      waypoints[waypoints.length - 1];
    const distRem = Math.max(0, targetWp.distanceMetersFromStart - currentMeters);
    return {
      name: `${targetWp.id} ${targetWp.shortName}`,
      distanceM: distRem,
      type: targetWp.type,
    };
  }, [ambulance.distanceTraveledMeters, waypoints]);

  // 1. Initialize Google Maps JavaScript API if API key is provided
  useEffect(() => {
    if (!googleMapsApiKey || mapMode === "SCHEMATIC_CAD") {
      setIsGoogleLoaded(false);
      return;
    }

    try {
      setOptions({
        key: googleMapsApiKey,
        v: "weekly",
      } as any);

      Promise.all([importLibrary("maps"), importLibrary("geometry")])
        .then(() => {
          if (!mapRef.current) return;

          const isDark = theme === "dark";
          const mapType =
            mapMode === "GOOGLE_SATELLITE" ? "satellite" : "roadmap";

          const map = new google.maps.Map(mapRef.current, {
            center: { lat: 26.8552, lng: 80.9324 }, // Center of Lucknow corridor
            zoom: 14,
            mapTypeId: mapType,
            disableDefaultUI: true,
            styles:
              mapMode === "GOOGLE_SATELLITE"
                ? undefined
                : isDark
                ? DARK_MAP_STYLE
                : DAYLIGHT_MAP_STYLE,
          });

          googleMapInstanceRef.current = map;

          // Draw High-Contrast Corridor Polyline along authentic Lucknow road network
          const pathCoords = ROUTE_PATH_COORDINATES.map((p) => ({
            lat: p.lat,
            lng: p.lng,
          }));

          // Dark outer casing for crisp definition against satellite imagery
          new google.maps.Polyline({
            path: pathCoords,
            geodesic: true,
            strokeColor: "#080A0D",
            strokeOpacity: 0.85,
            strokeWeight: 6,
            map,
          });

          const polyline = new google.maps.Polyline({
            path: pathCoords,
            geodesic: true,
            strokeColor: "#00C853",
            strokeOpacity: 0.95,
            strokeWeight: 3.5,
            map,
          });
          polylineRef.current = polyline;

          // 500m Geofence Circle around ambulance
          const circle = new google.maps.Circle({
            strokeColor: "#00C853",
            strokeOpacity: 0.8,
            strokeWeight: 1.5,
            fillColor: "#00C853",
            fillOpacity: 0.08,
            map,
            center: {
              lat: ambulance.currentCoords.lat,
              lng: ambulance.currentCoords.lng,
            },
            radius: 500, // 500 meters
          });
          geofenceCircleRef.current = circle;

          // Moving Ambulance Marker
          const ambMarker = new google.maps.Marker({
            position: {
              lat: ambulance.currentCoords.lat,
              lng: ambulance.currentCoords.lng,
            },
            map,
            title: "AMB-UP32-108",
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: "#FF3B30",
              fillOpacity: 1,
              strokeColor: "#FFFFFF",
              strokeWeight: 2,
            },
          });
          ambMarkerRef.current = ambMarker;

          // Waypoint Markers
          waypointMarkersRef.current.forEach((m) => m.setMap(null));
          waypointMarkersRef.current = waypoints.map((wp) => {
            const isGreen =
              wp.status === "FORCE_GREEN" || wp.controllerState === "FORCE_GREEN";
            const isBarricade = wp.type === "barricade";

            const marker = new google.maps.Marker({
              position: { lat: wp.coords.lat, lng: wp.coords.lng },
              map,
              title: `${wp.id}: ${wp.name}`,
              label: {
                text: wp.shortName,
                color: isDark ? "#F2F4F7" : "#111214",
                fontSize: "10px",
                fontWeight: "bold",
                className: "font-mono",
              },
              icon: {
                path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                scale: 5,
                fillColor: isBarricade
                  ? wp.barricadeStatus === "CLEARED"
                    ? "#00C853"
                    : "#EAB308"
                  : isGreen
                  ? "#00C853"
                  : "#FF3B30",
                fillOpacity: 1,
                strokeColor: "#FFFFFF",
                strokeWeight: 1,
              },
            });

            marker.addListener("click", () => {
              setSelectedWaypointId(wp.id);
            });

            return marker;
          });

          setIsGoogleLoaded(true);
          setGoogleLoadError(null);
        })
        .catch((err: any) => {
          setGoogleLoadError(err?.message || "Failed to initialize Google Maps JS API");
          setIsGoogleLoaded(false);
        });
    } catch (err: any) {
      setGoogleLoadError(err?.message || "Error configuring Google Maps");
      setIsGoogleLoaded(false);
    }
  }, [googleMapsApiKey, mapMode, theme, waypoints, setSelectedWaypointId]);

  // Update Google Maps markers as ambulance moves
  useEffect(() => {
    if (!isGoogleLoaded || !googleMapInstanceRef.current) return;

    const latLng = {
      lat: ambulance.currentCoords.lat,
      lng: ambulance.currentCoords.lng,
    };

    if (ambMarkerRef.current) {
      ambMarkerRef.current.setPosition(latLng);
    }

    if (geofenceCircleRef.current) {
      geofenceCircleRef.current.setCenter(latLng);
    }
  }, [ambulance.currentCoords, isGoogleLoaded]);

  // 2. Leaflet High-Resolution Tile Initialization (renders Google Maps tiles)
  useEffect(() => {
    if (isGoogleLoaded || mapMode === "SCHEMATIC_CAD") return;

    let isMounted = true;

    import("leaflet").then((L) => {
      if (!isMounted || !leafletMapRef.current) return;

      if (!leafletInstanceRef.current) {
        const isDark = theme === "dark";
        const map = L.map(leafletMapRef.current, {
          center: [26.8552, 80.9324],
          zoom: 14,
          zoomControl: false,
          attributionControl: false,
        });

        // Tile layer logic:
        // GOOGLE_SATELLITE: Google Hybrid Satellite imagery
        // GOOGLE_TACTICAL: Dark Carto / Google Maps Roadmap
        let initialTileUrl = isDark
          ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          : "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}";

        if (mapMode === "GOOGLE_SATELLITE") {
          initialTileUrl = "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}";
        }

        tileLayerRef.current = L.tileLayer(initialTileUrl, { maxZoom: 19 }).addTo(map);

        // Emergency Green Corridor Polyline (High-Contrast Dual-Layer Casing)
        const pathCoords: [number, number][] = ROUTE_PATH_COORDINATES.map((p) => [
          p.lat,
          p.lng,
        ]);
        // 1. Dark outer casing for sharp contrast over satellite tiles
        L.polyline(pathCoords, {
          color: "#080A0D",
          weight: 6,
          opacity: 0.85,
        }).addTo(map);
        // 2. High-visibility green corridor arterial centerline
        L.polyline(pathCoords, {
          color: "#00C853",
          weight: 3.5,
          opacity: 0.95,
        }).addTo(map);

        // 500M Geofence Circle
        const circle = L.circle([ambulance.currentCoords.lat, ambulance.currentCoords.lng], {
          radius: 500,
          color: "#00C853",
          weight: 1.5,
          dashArray: "4, 4",
          fillColor: "#00C853",
          fillOpacity: 0.08,
        }).addTo(map);
        leafletGeofenceRef.current = circle;

        // Custom HTML Ambulance Marker
        const ambIcon = L.divIcon({
          className: "custom-amb-marker",
          html: `
            <div style="background:#FF3B30; border:2px solid #FFFFFF; width:28px; height:28px; border-radius:2px; display:flex; align-items:center; justify-content:center; box-shadow:0 0 0 1px #000;">
              <span style="color:#FFF; font-size:9px; font-weight:bold; font-family:monospace;">AMB</span>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const ambMarker = L.marker(
          [ambulance.currentCoords.lat, ambulance.currentCoords.lng],
          { icon: ambIcon }
        ).addTo(map);
        leafletAmbMarkerRef.current = ambMarker;

        // Waypoint Markers
        waypoints.forEach((wp) => {
          const isGreen =
            wp.status === "FORCE_GREEN" || wp.controllerState === "FORCE_GREEN";
          const isBarricade = wp.type === "barricade";

          const bg = isBarricade
            ? wp.barricadeStatus === "CLEARED"
              ? "#00C853"
              : "#EAB308"
            : isGreen
            ? "#00C853"
            : "#FF3B30";

          const wpIcon = L.divIcon({
            className: "custom-wp-marker",
            html: `
              <div style="background:${bg}; border:1px solid #FFFFFF; padding:2px 4px; border-radius:2px; font-size:9px; font-weight:bold; color:#FFF; font-family:monospace; white-space:nowrap; cursor:pointer;">
                ${wp.id}: ${wp.shortName}
              </div>
            `,
            iconSize: [60, 20],
            iconAnchor: [30, 10],
          });

          const m = L.marker([wp.coords.lat, wp.coords.lng], { icon: wpIcon }).addTo(map);
          m.on("click", () => setSelectedWaypointId(wp.id));
        });

        leafletInstanceRef.current = map;
      }
    });

    return () => {
      isMounted = false;
    };
  }, [isGoogleLoaded, mapMode, theme, waypoints, setSelectedWaypointId]);

  // Update tile layer on mode or theme switch
  useEffect(() => {
    if (!leafletInstanceRef.current) return;
    const isDark = theme === "dark";
    let tileUrl = isDark
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}";

    if (mapMode === "GOOGLE_SATELLITE") {
      tileUrl = "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}";
    }

    import("leaflet").then((L) => {
      if (tileLayerRef.current && leafletInstanceRef.current) {
        leafletInstanceRef.current.removeLayer(tileLayerRef.current);
      }
      if (leafletInstanceRef.current) {
        tileLayerRef.current = L.tileLayer(tileUrl, { maxZoom: 19 }).addTo(
          leafletInstanceRef.current
        );
      }
    });
  }, [mapMode, theme]);

  // Update Leaflet marker as ambulance moves
  useEffect(() => {
    if (leafletAmbMarkerRef.current && ambulance.currentCoords) {
      leafletAmbMarkerRef.current.setLatLng([
        ambulance.currentCoords.lat,
        ambulance.currentCoords.lng,
      ]);
    }
    if (leafletGeofenceRef.current && ambulance.currentCoords) {
      leafletGeofenceRef.current.setLatLng([
        ambulance.currentCoords.lat,
        ambulance.currentCoords.lng,
      ]);
    }
  }, [ambulance.currentCoords]);

  // Recenter handler
  const handleRecenter = useCallback(() => {
    const lat = ambulance.currentCoords.lat;
    const lng = ambulance.currentCoords.lng;

    if (isGoogleLoaded && googleMapInstanceRef.current) {
      googleMapInstanceRef.current.panTo({ lat, lng });
      googleMapInstanceRef.current.setZoom(15);
    } else if (leafletInstanceRef.current) {
      leafletInstanceRef.current.setView([lat, lng], 15);
    }
  }, [ambulance.currentCoords, isGoogleLoaded]);

  // Zoom handlers
  const handleZoomIn = () => {
    if (isGoogleLoaded && googleMapInstanceRef.current) {
      googleMapInstanceRef.current.setZoom(
        (googleMapInstanceRef.current.getZoom() || 14) + 1
      );
    } else if (leafletInstanceRef.current) {
      leafletInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (isGoogleLoaded && googleMapInstanceRef.current) {
      googleMapInstanceRef.current.setZoom(
        (googleMapInstanceRef.current.getZoom() || 14) - 1
      );
    } else if (leafletInstanceRef.current) {
      leafletInstanceRef.current.zoomOut();
    }
  };

  return (
    <div className="relative w-full h-full min-h-[380px] bg-[var(--bg-canvas)] overflow-hidden select-none border-b border-[var(--border-hairline)] flex items-center justify-center">
      {/* 1. Google Maps JS API Container */}
      <div
        ref={mapRef}
        className={`w-full h-full absolute inset-0 ${
          isGoogleLoaded && mapMode !== "SCHEMATIC_CAD" ? "block" : "hidden"
        }`}
      />

      {/* 2. Interactive High-Resolution Cartography Container (Google Maps Tiles) */}
      <div
        ref={leafletMapRef}
        className={`w-full h-full absolute inset-0 z-0 ${
          !isGoogleLoaded && mapMode !== "SCHEMATIC_CAD" ? "block" : "hidden"
        }`}
      />

      {/* Overlaid Top-Left Compact Telemetry Box (1px border, solid --bg-surface) */}
      <div className="absolute top-3 left-3 bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-2.5 rounded-[2px] select-none text-xs z-20 pointer-events-none">
        <div className="flex items-center space-x-1.5 mb-1.5 pb-1 border-b border-[var(--border-hairline)]">
          <Navigation
            className="w-3.5 h-3.5 text-[var(--accent-green)]"
            strokeWidth={1.5}
          />
          <span className="font-mono text-[10px] text-[var(--text-secondary)] tracking-wider uppercase font-semibold">
            TELEMETRY // {mapMode === "GOOGLE_SATELLITE" ? "GOOGLE SATELLITE ACTIVE" : isGoogleLoaded ? "GOOGLE MAPS SDK ACTIVE" : "GOOGLE MAPS CARTOGRAPHY"}
          </span>
        </div>

        <div className="space-y-1 font-mono">
          <div className="flex items-center justify-between space-x-3">
            <span className="text-[10px] text-[var(--text-secondary)]">
              NEXT SIGNAL:
            </span>
            <span className="font-semibold text-[var(--text-primary)]">
              {nextTargetInfo.name}
            </span>
          </div>

          <div className="flex items-center justify-between space-x-3">
            <span className="text-[10px] text-[var(--text-secondary)]">
              DISTANCE:
            </span>
            <span className="font-semibold text-[var(--text-primary)] tabular-nums">
              {nextTargetInfo.distanceM} M
            </span>
          </div>

          <div className="flex items-center justify-between space-x-3">
            <span className="text-[10px] text-[var(--text-secondary)]">
              TIME SAVED:
            </span>
            <span className="font-bold text-[var(--accent-green)] tabular-nums">
              {timeSavedFormatted}
            </span>
          </div>
        </div>
      </div>

      {/* Top-Right Tactical Controls Strip */}
      <div className="absolute top-3 right-3 flex items-center space-x-1.5 z-20">
        {/* Map Mode Toggles */}
        <div className="flex items-center p-0.5 bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-[2px] font-mono text-[10px]">
          <button
            type="button"
            onClick={() => setMapMode("GOOGLE_TACTICAL")}
            className={`px-2 py-1 rounded-[1px] font-semibold transition-colors cursor-pointer ${
              mapMode === "GOOGLE_TACTICAL"
                ? "bg-[var(--text-primary)] text-[var(--bg-surface)] font-bold"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            ROADMAP
          </button>
          <button
            type="button"
            onClick={() => setMapMode("GOOGLE_SATELLITE")}
            className={`px-2 py-1 rounded-[1px] font-semibold transition-colors cursor-pointer ${
              mapMode === "GOOGLE_SATELLITE"
                ? "bg-[var(--text-primary)] text-[var(--bg-surface)] font-bold"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            SATELLITE
          </button>
          <button
            type="button"
            onClick={() => {
              setMapMode("SCHEMATIC_CAD");
              if (onCadFallback) onCadFallback();
            }}
            className={`px-2 py-1 rounded-[1px] font-semibold transition-colors cursor-pointer ${
              mapMode === "SCHEMATIC_CAD"
                ? "bg-[var(--text-primary)] text-[var(--bg-surface)] font-bold"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            SCHEMATIC CAD
          </button>
        </div>

        {/* Open In Google Maps Route Link */}
        <a
          href="https://www.google.com/maps/dir/26.8467,80.9462/26.8552,80.9324/26.8624,80.9205/26.8694,80.9135"
          target="_blank"
          rel="noopener noreferrer"
          title="Open Emergency Corridor Navigation in Google Maps"
          className="p-1.5 bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-[var(--text-primary)] hover:border-[var(--text-secondary)] rounded-[2px] transition-colors cursor-pointer flex items-center space-x-1"
        >
          <ExternalLink className="w-3.5 h-3.5 text-[var(--accent-green)]" strokeWidth={1.5} />
          <span className="text-[10px] font-mono hidden xl:inline">GOOGLE NAV</span>
        </a>

        {/* API Key Modal Button */}
        <button
          type="button"
          onClick={() => setShowKeyModal(true)}
          title="Google Maps JavaScript API Key Settings"
          className="p-1.5 bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-[var(--text-primary)] hover:border-[var(--text-secondary)] rounded-[2px] transition-colors cursor-pointer flex items-center space-x-1"
        >
          <Key className="w-3.5 h-3.5 text-amber-500" strokeWidth={1.5} />
          <span className="text-[10px] font-mono hidden md:inline">API KEY</span>
        </button>

        {/* Recenter Button */}
        <button
          type="button"
          onClick={handleRecenter}
          title="Recenter on Ambulance"
          className="p-1.5 bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-[var(--text-primary)] hover:border-[var(--text-secondary)] rounded-[2px] transition-colors cursor-pointer"
        >
          <Crosshair className="w-3.5 h-3.5 text-[var(--accent-green)]" strokeWidth={1.5} />
        </button>

        {/* Zoom Controls */}
        <div className="flex flex-col border border-[var(--border-hairline)] bg-[var(--bg-surface)] rounded-[2px] overflow-hidden">
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-1.5 hover:bg-[var(--bg-canvas)] text-[var(--text-primary)] transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3 h-3" strokeWidth={1.5} />
          </button>
          <div className="h-[1px] bg-[var(--border-hairline)]" />
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-1.5 hover:bg-[var(--bg-canvas)] text-[var(--text-primary)] transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3 h-3" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Cartography Legend Indicator (Bottom Right) */}
      <div className="absolute bottom-3 right-3 bg-[var(--bg-surface)] border border-[var(--border-hairline)] px-2.5 py-1 rounded-[2px] text-[9px] font-mono text-[var(--text-secondary)] flex items-center space-x-3 z-20">
        <span className="flex items-center space-x-1">
          <span className="w-2 h-2 bg-[var(--accent-green)] rounded-[1px] inline-block" />
          <span>GREEN CORRIDOR</span>
        </span>
        <span className="flex items-center space-x-1">
          <span className="w-2 h-2 bg-[#EAB308] rounded-[1px] inline-block" />
          <span>BAR-03</span>
        </span>
        <span className="flex items-center space-x-1">
          <span className="w-2 h-2 border border-dashed border-[var(--accent-green)] rounded-full inline-block" />
          <span>500M GEOFENCE</span>
        </span>
        <span className="flex items-center space-x-1">
          <span className="w-2 h-2 bg-[var(--accent-alert)] rounded-[1px] inline-block" />
          <span>AMB-UP32-108</span>
        </span>
      </div>

      {/* Google Maps API Key Modal / Drawer */}
      {showKeyModal && (
        <div className="absolute inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-4 rounded-[2px] space-y-3 font-mono text-xs shadow-none">
            <div className="flex items-center justify-between border-b border-[var(--border-hairline)] pb-2">
              <div className="flex items-center space-x-1.5">
                <Key className="w-4 h-4 text-amber-500" strokeWidth={1.5} />
                <span className="font-bold text-[var(--text-primary)] uppercase">
                  GOOGLE MAPS JAVASCRIPT API CONFIGURATION
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm cursor-pointer"
              >
                &times;
              </button>
            </div>

            <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
              Enter your Google Maps JavaScript API Key below or set{" "}
              <code className="text-[var(--accent-green)]">
                NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
              </code>{" "}
              in your environment. When left blank, Aura renders authentic Google Maps cartography tiles with active corridor tracking automatically.
            </p>

            <div className="space-y-1">
              <label className="text-[10px] text-[var(--text-secondary)] uppercase">
                Google Maps API Key:
              </label>
              <input
                type="text"
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-[var(--bg-canvas)] border border-[var(--border-hairline)] p-2 text-[11px] font-mono text-[var(--text-primary)] rounded-[2px] outline-none focus:border-[var(--text-primary)]"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[var(--border-hairline)]">
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                className="px-3 py-1.5 border border-[var(--border-hairline)] rounded-[2px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={() => {
                  setGoogleMapsApiKey(tempApiKey);
                  setShowKeyModal(false);
                }}
                className="px-3 py-1.5 bg-[var(--accent-green)] text-white font-bold rounded-[2px] hover:opacity-90 cursor-pointer"
              >
                APPLY & INITIALIZE GOOGLE MAPS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
