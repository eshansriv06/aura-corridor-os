"use client";

import React from "react";
import { useAura } from "@/context/AuraContext";
import { ShieldAlert, ArrowRight, Radio, CheckCircle2 } from "lucide-react";

export function JunctionHardwareStrip() {
  const { waypoints, selectedWaypointId, setSelectedWaypointId } = useAura();

  return (
    <div className="h-16 w-full bg-[var(--bg-surface)] border-b border-[var(--border-hairline)] px-2 sm:px-4 flex items-center select-none overflow-x-auto shrink-0">
      <div className="flex items-center min-w-[700px] w-full justify-between space-x-2">
        {waypoints.map((wp, index) => {
          const isSelected = selectedWaypointId === wp.id;
          const isSignal = wp.type === "signal";
          const isBarricade = wp.type === "barricade";
          const isDestination = wp.type === "destination";

          // Determine Badge appearance strictly matching requirements:
          // RED HOLD (--accent-alert)
          // 500M GEOFENCE (high-contrast bordered state)
          // FORCE GREEN (--accent-green solid fill with #FFFFFF text)
          let badgeText = "RED HOLD";
          let badgeClasses = "bg-[var(--accent-alert)] text-white font-bold";

          if (isBarricade) {
            if (wp.barricadeStatus === "CLEARED" || wp.controllerState === "FORCE_GREEN") {
              badgeText = "FORCE GREEN";
              badgeClasses = "bg-[var(--accent-green)] text-white font-bold";
            } else if (wp.status === "500M_ALERT" || wp.status === "GEOFENCE_500M") {
              badgeText = "500M GEOFENCE";
              badgeClasses = "border-2 border-amber-500 text-[var(--text-primary)] bg-[var(--bg-canvas)] font-bold";
            } else {
              badgeText = "RED HOLD";
              badgeClasses = "bg-[var(--accent-alert)] text-white font-bold";
            }
          } else if (wp.status === "FORCE_GREEN" || wp.controllerState === "FORCE_GREEN") {
            badgeText = "FORCE GREEN";
            badgeClasses = "bg-[var(--accent-green)] text-white font-bold";
          } else if (wp.status === "GEOFENCE_500M") {
            badgeText = "500M GEOFENCE";
            badgeClasses = "border-2 border-[var(--accent-green)] text-[var(--text-primary)] bg-[var(--bg-canvas)] font-bold";
          } else {
            badgeText = "RED HOLD";
            badgeClasses = "bg-[var(--accent-alert)] text-white font-bold";
          }

          return (
            <React.Fragment key={wp.id}>
              {/* Waypoint Node Box */}
              <button
                type="button"
                onClick={() => setSelectedWaypointId(wp.id)}
                className={`flex-1 h-12 p-1.5 border rounded-[2px] transition-colors flex flex-col justify-between text-left cursor-pointer ${
                  isSelected
                    ? "border-[var(--text-primary)] bg-[var(--bg-canvas)]"
                    : "border-[var(--border-hairline)] bg-[var(--bg-surface)] hover:border-[var(--text-secondary)]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-wider text-[var(--text-secondary)] font-semibold">
                    {wp.id}
                  </span>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-[1px] uppercase tracking-wider font-mono ${badgeClasses}`}
                  >
                    {badgeText}
                  </span>
                </div>

                <div className="flex items-center space-x-1.5 truncate">
                  {isBarricade ? (
                    <ShieldAlert className="w-3 h-3 text-amber-500 shrink-0" strokeWidth={1.5} />
                  ) : isDestination ? (
                    <CheckCircle2 className="w-3 h-3 text-[var(--accent-green)] shrink-0" strokeWidth={1.5} />
                  ) : (
                    <Radio className="w-3 h-3 text-[var(--accent-green)] shrink-0" strokeWidth={1.5} />
                  )}
                  <span className="text-[11px] font-semibold text-[var(--text-primary)] truncate font-mono">
                    {wp.shortName}
                  </span>
                </div>
              </button>

              {/* Sequential Connector Arrow */}
              {index < waypoints.length - 1 && (
                <div className="flex items-center text-[var(--text-secondary)] px-0.5 shrink-0">
                  <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
