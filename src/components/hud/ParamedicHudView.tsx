"use client";

import React from "react";
import { useAura } from "@/context/AuraContext";
import { JunctionHardwareStrip } from "./JunctionHardwareStrip";
import { TacticalVectorMap } from "./TacticalVectorMap";
import { TriageControlDock } from "./TriageControlDock";
import { ParamedicCabinVitals } from "./ParamedicCabinVitals";
import { Gauge, MapPin } from "lucide-react";

export function ParamedicHudView() {
  const { ambulance } = useAura();

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[var(--bg-canvas)]">
      {/* Top Telemetry Status Strip (1px bordered horizontal bar) */}
      <div className="h-10 w-full bg-[var(--bg-surface)] border-b border-[var(--border-hairline)] px-3 sm:px-4 flex items-center justify-between text-xs select-none shrink-0">
        {/* Left: Unit ID & AWS IoT Core MQTT Link */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="flex items-center space-x-1.5 font-mono">
            <span className="text-[10px] text-[var(--text-secondary)] font-medium">UNIT:</span>
            <span className="font-bold text-[var(--text-primary)]">{ambulance.unitId}</span>
          </div>

          <div className="h-3 w-[1px] bg-[var(--border-hairline)]" />

          <div className="flex items-center space-x-1.5 font-mono">
            <div className="w-2 h-2 rounded-full bg-[var(--accent-green)] animate-pulse" />
            <span className="text-[11px] font-semibold text-[var(--accent-green)]">
              MQTT CONNECTED • {ambulance.mqttLatencyMs}ms
            </span>
          </div>
        </div>

        {/* Right: Live GPS Coordinates & Vehicle Speed */}
        <div className="flex items-center space-x-3 sm:space-x-4 font-mono">
          <div className="flex items-center space-x-1 text-[var(--text-secondary)]">
            <MapPin className="w-3.5 h-3.5 text-[var(--text-primary)]" strokeWidth={1.5} />
            <span className="tabular-nums font-medium text-[var(--text-primary)]">
              {ambulance.currentCoords.lat.toFixed(4)}° N, {ambulance.currentCoords.lng.toFixed(4)}° E
            </span>
          </div>

          <div className="h-3 w-[1px] bg-[var(--border-hairline)] hidden sm:block" />

          <div className="flex items-center space-x-1 font-bold text-[var(--text-primary)]">
            <Gauge className="w-3.5 h-3.5 text-[var(--accent-green)]" strokeWidth={1.5} />
            <span className="tabular-nums text-sm">{ambulance.currentSpeedKmh}</span>
            <span className="text-[10px] text-[var(--text-secondary)] font-normal">KM/H</span>
          </div>
        </div>
      </div>

      {/* Signature Element : Deterministic Corridor Junction Strip (64px height) */}
      <JunctionHardwareStrip />

      {/* 70/30 split on desktop (>= 1024px), single-column thumb-first on mobile/tablet (< 768px) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-10 gap-[1px] bg-[var(--border-hairline)] overflow-hidden">
        {/* 70% Primary Viewport (Mobile Single-Column Thumb-First): Tactical Vector Canvas + Pinned Control Dock */}
        <div className="lg:col-span-7 flex flex-col h-full bg-[var(--bg-canvas)] overflow-hidden">
          {/* Tactical Vector Route Canvas */}
          <div className="flex-1 min-h-[260px] overflow-hidden relative">
            <TacticalVectorMap />
          </div>

          {/* Bottom Tactile Control Dock (Pinned to bottom thumb zone) */}
          <TriageControlDock />
        </div>

        {/* 30% Desktop Cabin Telemetry & Patient Vitals Panel */}
        <div className="hidden lg:flex lg:col-span-3 flex-col h-full bg-[var(--bg-surface)] overflow-hidden">
          <ParamedicCabinVitals />
        </div>
      </div>
    </div>
  );
}
