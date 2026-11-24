"use client";

import React, { useMemo } from "react";
import { useAura } from "@/context/AuraContext";
import { TacticalVectorMap } from "@/components/hud/TacticalVectorMap";
import { Cpu, SlidersHorizontal, ShieldAlert, Radio } from "lucide-react";

export function CitySurveillanceGrid() {
  const {
    waypoints,
    selectedWaypointId,
    setSelectedWaypointId,
    updateWaypointOverride,
  } = useAura();

  const selectedWaypoint = useMemo(() => {
    return waypoints.find((w) => w.id === selectedWaypointId) || waypoints[0];
  }, [waypoints, selectedWaypointId]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[var(--bg-canvas)]">
      {/* Top Header for Surveillance Grid */}
      <div className="h-10 px-3 bg-[var(--bg-surface)] border-b border-[var(--border-hairline)] flex items-center justify-between text-xs select-none shrink-0">
        <div className="flex items-center space-x-2">
          <Cpu className="w-3.5 h-3.5 text-[var(--accent-green)]" strokeWidth={1.5} />
          <span className="font-mono text-[10px] text-[var(--text-secondary)] uppercase font-semibold">
            CITY SECTOR SURVEILLANCE // LUCKNOW TRAFFIC POLICE HQ
          </span>
        </div>
        <div className="flex items-center space-x-2 font-mono text-[10px]">
          <span className="text-[var(--text-secondary)]">ACTIVE NODES:</span>
          <span className="font-bold text-[var(--accent-green)]">04 TRACKED</span>
        </div>
      </div>

      {/* Interactive Sector Map Viewport (Full Height) */}
      <div className="flex-1 overflow-hidden relative">
        <TacticalVectorMap />
      </div>

      {/* Compact Police Hardware Override Dock (44px height, replaces raw JSON dump) */}
      <div className="h-11 px-3 bg-[var(--bg-surface)] border-t border-[var(--border-hairline)] flex items-center justify-between text-xs select-none shrink-0 font-mono">
        {/* Left: Signal Node Selector Tabs */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          <div className="hidden sm:flex items-center space-x-1 text-[10px] text-[var(--text-secondary)]">
            <SlidersHorizontal className="w-3 h-3" strokeWidth={1.5} />
            <span className="uppercase">SIGNAL NODE:</span>
          </div>
          <div className="flex items-center space-x-1">
            {waypoints.map((wp) => (
              <button
                key={wp.id}
                type="button"
                onClick={() => setSelectedWaypointId(wp.id)}
                className={`px-2 py-1 rounded-[1px] border text-[10px] font-bold cursor-pointer transition-colors ${
                  selectedWaypointId === wp.id
                    ? "bg-[var(--bg-canvas)] border-[var(--text-primary)] text-[var(--text-primary)] font-bold"
                    : "border-[var(--border-hairline)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {wp.id}
              </button>
            ))}
          </div>
        </div>

        {/* Center: Selected Waypoint Realtime Status Readout */}
        <div className="hidden md:flex items-center space-x-2 text-[10px]">
          <span className="text-[var(--text-secondary)]">TARGET:</span>
          <span className="font-bold text-[var(--text-primary)]">{selectedWaypoint.shortName}</span>
          <span className="text-[var(--border-hairline)]">|</span>
          <span className="text-[var(--text-secondary)]">STATE:</span>
          <span
            className={`font-bold ${
              selectedWaypoint.controllerState === "FORCE_GREEN"
                ? "text-[var(--accent-green)]"
                : "text-[var(--accent-alert)]"
            }`}
          >
            {selectedWaypoint.controllerState}
          </span>
          <span className="text-[var(--border-hairline)]">|</span>
          <span className="text-[var(--accent-green)]">500M GEOFENCE ACTIVE</span>
        </div>

        {/* Right: Tactile Preemption Override Toggle Buttons */}
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={() => updateWaypointOverride(selectedWaypoint.id, "AUTO_PREEMPT")}
            className={`px-2.5 py-1 text-[10px] font-bold rounded-[1px] border cursor-pointer transition-colors ${
              selectedWaypoint.overrideMode === "AUTO_PREEMPT"
                ? "bg-[var(--accent-green)] text-white border-[var(--accent-green)]"
                : "border-[var(--border-hairline)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            AUTO PREEMPT
          </button>
          <button
            type="button"
            onClick={() => updateWaypointOverride(selectedWaypoint.id, "MANUAL_HOLD")}
            className={`px-2.5 py-1 text-[10px] font-bold rounded-[1px] border cursor-pointer transition-colors ${
              selectedWaypoint.overrideMode === "MANUAL_HOLD"
                ? "bg-[var(--accent-alert)] text-white border-[var(--accent-alert)]"
                : "border-[var(--border-hairline)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            MANUAL HOLD
          </button>
        </div>
      </div>
    </div>
  );
}
