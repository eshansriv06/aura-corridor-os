"use client";

import React from "react";
import { useAura } from "@/context/AuraContext";
import { Radio, Cpu, Clock, ShieldAlert } from "lucide-react";

export function CommandKpiStrip() {
  const { simulationMetrics, ambulance } = useAura();

  const minutesSaved = Math.floor(simulationMetrics.goldenHourTimeSavedSeconds / 60);
  const secondsSaved = simulationMetrics.goldenHourTimeSavedSeconds % 60;
  const goldenHourFormatted = `${String(minutesSaved).padStart(2, "0")} MIN ${String(secondsSaved).padStart(2, "0")} SEC`;

  return (
    <div className="w-full bg-[var(--bg-surface)] border-b border-[var(--border-hairline)] grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[var(--border-hairline)] shrink-0 select-none">
      {/* Cell 1: Active Green Corridors */}
      <div className="p-3 flex flex-col justify-between">
        <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-secondary)] mb-1">
          <span className="flex items-center space-x-1">
            <Radio className="w-3 h-3 text-[var(--accent-green)]" strokeWidth={1.5} />
            <span>ACTIVE GREEN CORRIDORS</span>
          </span>
          <span className="w-2 h-2 rounded-full bg-[var(--accent-green)] animate-pulse" />
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-xl font-bold font-mono text-[var(--text-primary)] tabular-nums">
            01
          </span>
          <span className="text-[11px] font-mono text-[var(--text-secondary)] font-medium">
            ({ambulance.unitId})
          </span>
        </div>
      </div>

      {/* Cell 2: Signals Preempted */}
      <div className="p-3 flex flex-col justify-between">
        <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-secondary)] mb-1">
          <span className="flex items-center space-x-1">
            <Cpu className="w-3 h-3 text-sky-500" strokeWidth={1.5} />
            <span>SIGNALS PREEMPTED (IOT CORE)</span>
          </span>
          <span className="text-[9px] font-mono text-[var(--accent-green)]">LATCHED</span>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-xl font-bold font-mono text-[var(--text-primary)] tabular-nums">
            03 / 03
          </span>
          <span className="text-[11px] font-mono text-[var(--text-secondary)]">
            JUNCTIONS
          </span>
        </div>
      </div>

      {/* Cell 3: Golden Hour Time Saved */}
      <div className="p-3 flex flex-col justify-between">
        <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-secondary)] mb-1">
          <span className="flex items-center space-x-1">
            <Clock className="w-3 h-3 text-[var(--accent-green)]" strokeWidth={1.5} />
            <span>GOLDEN HOUR TIME SAVED</span>
          </span>
          <span className="text-[9px] font-mono text-[var(--accent-green)] font-semibold">+68% PRESERVED</span>
        </div>
        <div className="flex items-baseline space-x-1">
          <span className="text-xl font-bold font-mono text-[var(--accent-green)] tabular-nums">
            {goldenHourFormatted}
          </span>
        </div>
      </div>

      {/* Cell 4: Barricade Response (SNS) */}
      <div className="p-3 flex flex-col justify-between">
        <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-secondary)] mb-1">
          <span className="flex items-center space-x-1">
            <ShieldAlert className="w-3 h-3 text-amber-500" strokeWidth={1.5} />
            <span>BARRICADE RESPONSE (SNS)</span>
          </span>
          <span className="text-[9px] font-mono text-[var(--accent-green)]">NOMINAL</span>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-xl font-bold font-mono text-[var(--text-primary)] tabular-nums">
            19 SEC
          </span>
          <span className="text-[11px] font-mono text-[var(--text-secondary)]">
            AVG CLEARANCE
          </span>
        </div>
      </div>
    </div>
  );
}
