"use client";

import React from "react";
import { CommandKpiStrip } from "./CommandKpiStrip";
import { CitySurveillanceGrid } from "./CitySurveillanceGrid";
import { OperationalDispatchFeed } from "./OperationalDispatchFeed";

export function CommandCenterView() {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[var(--bg-canvas)]">
      {/* Top 4-Cell KPI Strip (1px vertical dividers, zero shadows) */}
      <CommandKpiStrip />

      {/* 12-Column Hairline-Bordered Grid (gap: 1px) on Desktop that stacks cleanly on mobile/tablet */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-[1px] bg-[var(--border-hairline)] overflow-hidden">
        {/* Left/Center Workspace (8 columns on desktop): City Signal & Geofence Surveillance Grid */}
        <div className="lg:col-span-8 flex flex-col h-full bg-[var(--bg-canvas)] overflow-hidden">
          <CitySurveillanceGrid />
        </div>

        {/* Right Workspace (4 columns on desktop): Dual-Tab Operational Dispatch Feed */}
        <div className="lg:col-span-4 flex flex-col h-full bg-[var(--bg-surface)] overflow-hidden">
          <OperationalDispatchFeed />
        </div>
      </div>
    </div>
  );
}
