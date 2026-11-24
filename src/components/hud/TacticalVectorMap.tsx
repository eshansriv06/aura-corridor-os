"use client";

import React, { useMemo } from "react";
import { useAura, ROUTE_PATH_COORDINATES } from "@/context/AuraContext";
import { Shield, Navigation, AlertTriangle, Radio, Layers, Key } from "lucide-react";
import { GoogleTacticalMap } from "@/components/map/GoogleTacticalMap";

export function TacticalVectorMap() {
  const {
    ambulance,
    waypoints,
    simulationProgress,
    theme,
    selectedWaypointId,
    setSelectedWaypointId,
    mapMode,
    setMapMode,
  } = useAura();

  // If user selected Google Tactical or Google Satellite, render the Google Tactical Map component
  if (mapMode === "GOOGLE_TACTICAL" || mapMode === "GOOGLE_SATELLITE") {
    return <GoogleTacticalMap onCadFallback={() => setMapMode("SCHEMATIC_CAD")} />;
  }

  // Convert GPS Coordinates to SVG Canvas Coordinates
  // Bounding box of Lucknow emergency corridor:
  // Min Lat: 26.8440, Max Lat: 26.8720
  // Min Lng: 80.9100, Max Lng: 80.9500
  const canvasWidth = 900;
  const canvasHeight = 520;

  const minLat = 26.844;
  const maxLat = 26.872;
  const minLng = 80.910;
  const maxLng = 80.950;

  const project = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * (canvasWidth - 140) + 70;
    const y = canvasHeight - (((lat - minLat) / (maxLat - minLat)) * (canvasHeight - 120) + 60);
    return { x, y };
  };

  // Road Polyline points string
  const roadPointsString = ROUTE_PATH_COORDINATES.map((pt) => {
    const { x, y } = project(pt.lat, pt.lng);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");

  // Current Ambulance Position on canvas
  const ambPos = project(ambulance.currentCoords.lat, ambulance.currentCoords.lng);

  // Next waypoint target & distance calculation
  const currentMeters = ambulance.distanceTraveledMeters;
  const targetWp =
    waypoints.find((w) => w.distanceMetersFromStart > currentMeters) ||
    waypoints[waypoints.length - 1];
  const distRem = Math.max(0, targetWp.distanceMetersFromStart - currentMeters);
  const nextTargetInfo = {
    name: `${targetWp.id} ${targetWp.shortName}`,
    distanceM: distRem,
    type: targetWp.type,
  };

  const totalSec = Math.round(255 + simulationProgress * 150);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  const timeSavedFormatted = `+${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;

  // Style colors for industrial schematic
  const isDark = theme === "dark";
  const roadArterialColor = isDark ? "#2A2F38" : "#D4D6DC";
  const roadCorridorActiveColor = "#00C853";
  const gridLineColor = isDark ? "#16191E" : "#E8EAE6";

  return (
    <div className="relative w-full h-full min-h-[380px] bg-[var(--bg-canvas)] overflow-hidden select-none border-b border-[var(--border-hairline)] flex items-center justify-center">
      {/* Tactical Schematic SVG Canvas */}
      <svg
        viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
        className="w-full h-full max-h-[700px] object-contain"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <pattern id="tacticalGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke={gridLineColor}
              strokeWidth="1"
            />
          </pattern>
        </defs>

        {/* Flat Grid Background */}
        <rect width="100%" height="100%" fill="url(#tacticalGrid)" />

        {/* Secondary Cross Arteries in Lucknow (Schematic lines) */}
        <g stroke={roadArterialColor} strokeWidth="2" strokeDasharray="4 4" fill="none">
          <line x1="80" y1="280" x2="820" y2="280" />
          <line x1="280" y1="40" x2="280" y2="480" />
          <line x1="560" y1="40" x2="560" y2="480" />
          <line x1="120" y1="440" x2="780" y2="120" strokeWidth="1" />
        </g>

        {/* Sector Labels */}
        <text x="75" y="495" fill="var(--text-secondary)" fontSize="10" fontFamily="monospace">
          SECTOR-01 // HAZRATGANJ ARTERIAL
        </text>
        <text x="360" y="55" fill="var(--text-secondary)" fontSize="10" fontFamily="monospace">
          SECTOR-02 // KAISERBAGH JUNCTION
        </text>
        <text x="620" y="495" fill="var(--text-secondary)" fontSize="10" fontFamily="monospace">
          SECTOR-03 // CHOWK MEDICAL DISTRICT
        </text>

        {/* Primary Arterial Emergency Road Bed (Wide Stroke) */}
        <polyline
          points={roadPointsString}
          fill="none"
          stroke={roadArterialColor}
          strokeWidth="16"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />

        {/* Green Corridor Active Path (Solid Green Track) */}
        <polyline
          points={roadPointsString}
          fill="none"
          stroke={roadCorridorActiveColor}
          strokeWidth="6"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />

        {/* Road Center Line (1px White Hairline Dash) */}
        <polyline
          points={roadPointsString}
          fill="none"
          stroke="white"
          strokeWidth="1"
          strokeDasharray="6 6"
        />

        {/* Waypoints & Junction Nodes */}
        {waypoints.map((wp) => {
          const { x, y } = project(wp.coords.lat, wp.coords.lng);
          const isSignal = wp.type === "signal";
          const isBarricade = wp.type === "barricade";
          const isDest = wp.type === "destination";
          const isForceGreen =
            wp.controllerState === "FORCE_GREEN" || wp.status === "FORCE_GREEN";

          return (
            <g
              key={wp.id}
              transform={`translate(${x}, ${y})`}
              className="cursor-pointer"
              onClick={() => setSelectedWaypointId(wp.id)}
            >
              {/* 500M Amazon Location Service Geofence Ring around Junction */}
              <circle
                r="42"
                fill="none"
                stroke={isForceGreen ? "var(--accent-green)" : "var(--border-hairline)"}
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="0.8"
              />

              {/* Waypoint Base Pin */}
              <rect
                x="-12"
                y="-12"
                width="24"
                height="24"
                fill="var(--bg-surface)"
                stroke={
                  isBarricade
                    ? wp.barricadeStatus === "CLEARED"
                      ? "var(--accent-green)"
                      : "#EAB308"
                    : isForceGreen
                    ? "var(--accent-green)"
                    : "var(--accent-alert)"
                }
                strokeWidth="2"
                rx="2"
              />

              {/* Icon inside node */}
              {isBarricade ? (
                <text
                  x="0"
                  y="4"
                  textAnchor="middle"
                  fill={wp.barricadeStatus === "CLEARED" ? "var(--accent-green)" : "#EAB308"}
                  fontSize="9"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  BAR
                </text>
              ) : isDest ? (
                <text
                  x="0"
                  y="4"
                  textAnchor="middle"
                  fill="var(--accent-green)"
                  fontSize="9"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  HOSP
                </text>
              ) : (
                <circle
                  cx="0"
                  cy="0"
                  r="4"
                  fill={isForceGreen ? "var(--accent-green)" : "var(--accent-alert)"}
                />
              )}

              {/* Label Tag Box */}
              <g transform="translate(18, -14)">
                <rect
                  x="0"
                  y="0"
                  width="135"
                  height="26"
                  fill="var(--bg-surface)"
                  stroke={
                    selectedWaypointId === wp.id
                      ? "var(--text-primary)"
                      : "var(--border-hairline)"
                  }
                  strokeWidth="1"
                  rx="1"
                />
                <text
                  x="6"
                  y="12"
                  fill="var(--text-primary)"
                  fontSize="9"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {wp.id} // {wp.shortName}
                </text>
                <text
                  x="6"
                  y="22"
                  fill={
                    isBarricade
                      ? wp.barricadeStatus === "CLEARED"
                        ? "var(--accent-green)"
                        : "#EAB308"
                      : isForceGreen
                      ? "var(--accent-green)"
                      : "var(--accent-alert)"
                  }
                  fontSize="8"
                  fontWeight="600"
                  fontFamily="monospace"
                >
                  {isBarricade
                    ? `BARRICADE: ${wp.barricadeStatus}`
                    : `STATE: ${wp.controllerState}`}
                </text>
              </g>
            </g>
          );
        })}

        {/* Live Moving Ambulance Marker */}
        <g transform={`translate(${ambPos.x}, ${ambPos.y})`}>
          {/* 1px Dashed 500m Amazon Location Service Geofence Ring Around Ambulance */}
          <circle
            r="48"
            fill="none"
            stroke="var(--accent-green)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />

          {/* Solid 2px Radius Ambulance Carrier Box */}
          <rect
            x="-14"
            y="-14"
            width="28"
            height="28"
            fill="var(--accent-alert)"
            stroke="white"
            strokeWidth="2"
            rx="2"
          />

          {/* Unit Designation Text */}
          <text
            x="0"
            y="4"
            textAnchor="middle"
            fill="white"
            fontSize="8"
            fontWeight="bold"
            fontFamily="monospace"
          >
            AMB
          </text>

          {/* Heading Radar Ping Beam */}
          <line
            x1="0"
            y1="-14"
            x2="0"
            y2="-32"
            stroke="var(--accent-alert)"
            strokeWidth="2"
            strokeDasharray="2 2"
          />

          {/* Live Tabular Coordinates Tag floating right */}
          <g transform="translate(18, -12)">
            <rect
              x="0"
              y="0"
              width="115"
              height="24"
              fill="var(--bg-surface)"
              stroke="var(--text-primary)"
              strokeWidth="1"
              rx="1"
            />
            <text
              x="5"
              y="11"
              fill="var(--text-primary)"
              fontSize="9"
              fontWeight="bold"
              fontFamily="monospace"
            >
              AMB-UP32-108
            </text>
            <text
              x="5"
              y="20"
              fill="var(--accent-green)"
              fontSize="8"
              fontWeight="bold"
              fontFamily="monospace"
            >
              SPEED: {ambulance.currentSpeedKmh} KM/H
            </text>
          </g>
        </g>
      </svg>

      {/* Overlaid Top-Left Compact Telemetry Box (1px border, solid --bg-surface) */}
      <div className="absolute top-3 left-3 bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-2.5 rounded-[2px] select-none text-xs z-20 pointer-events-none">
        <div className="flex items-center space-x-1.5 mb-1.5 pb-1 border-b border-[var(--border-hairline)]">
          <Navigation className="w-3.5 h-3.5 text-[var(--accent-green)]" strokeWidth={1.5} />
          <span className="font-mono text-[10px] text-[var(--text-secondary)] tracking-wider uppercase font-semibold">
            TELEMETRY // SCHEMATIC CAD VIEW
          </span>
        </div>

        <div className="space-y-1 font-mono">
          <div className="flex items-center justify-between space-x-3">
            <span className="text-[10px] text-[var(--text-secondary)]">NEXT SIGNAL:</span>
            <span className="font-semibold text-[var(--text-primary)]">{nextTargetInfo.name}</span>
          </div>

          <div className="flex items-center justify-between space-x-3">
            <span className="text-[10px] text-[var(--text-secondary)]">DISTANCE:</span>
            <span className="font-semibold text-[var(--text-primary)] tabular-nums">
              {nextTargetInfo.distanceM} M
            </span>
          </div>

          <div className="flex items-center justify-between space-x-3">
            <span className="text-[10px] text-[var(--text-secondary)]">TIME SAVED:</span>
            <span className="font-bold text-[var(--accent-green)] tabular-nums">
              {timeSavedFormatted}
            </span>
          </div>
        </div>
      </div>

      {/* Top-Right Map Mode Switcher */}
      <div className="absolute top-3 right-3 flex items-center space-x-1.5 z-20">
        <div className="flex items-center p-0.5 bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-[2px] font-mono text-[10px]">
          <button
            type="button"
            onClick={() => setMapMode("GOOGLE_TACTICAL")}
            className="px-2 py-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-[1px] font-semibold cursor-pointer"
          >
            GOOGLE TACTICAL
          </button>
          <button
            type="button"
            onClick={() => setMapMode("GOOGLE_SATELLITE")}
            className="px-2 py-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-[1px] font-semibold cursor-pointer"
          >
            SATELLITE
          </button>
          <button
            type="button"
            onClick={() => setMapMode("SCHEMATIC_CAD")}
            className="px-2 py-1 bg-[var(--text-primary)] text-[var(--bg-surface)] font-bold rounded-[1px] cursor-pointer"
          >
            SCHEMATIC CAD
          </button>
        </div>
      </div>

      {/* Cartography Legend Indicator (Bottom Right) */}
      <div className="absolute bottom-3 right-3 bg-[var(--bg-surface)] border border-[var(--border-hairline)] px-2 py-1 rounded-[2px] text-[9px] font-mono text-[var(--text-secondary)] flex items-center space-x-2 z-20 hidden sm:flex">
        <span className="flex items-center space-x-1">
          <span className="w-2 h-2 bg-[var(--accent-green)] rounded-[1px] inline-block" />
          <span>GREEN LATCH</span>
        </span>
        <span className="flex items-center space-x-1">
          <span className="w-2 h-2 bg-[#EAB308] rounded-[1px] inline-block" />
          <span>BAR-03 (POLICE)</span>
        </span>
        <span className="flex items-center space-x-1">
          <span className="w-2 h-2 border border-dashed border-[var(--accent-green)] rounded-full inline-block" />
          <span>500M GEOFENCE</span>
        </span>
        <span className="flex items-center space-x-1">
          <span className="w-2 h-2 bg-[var(--accent-alert)] rounded-[1px] inline-block" />
          <span>AMB UNIT</span>
        </span>
      </div>
    </div>
  );
}
