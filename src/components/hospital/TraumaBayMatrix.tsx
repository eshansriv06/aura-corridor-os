"use client";

import React from "react";
import { useAura } from "@/context/AuraContext";
import { Building2, Database, CheckCircle, AlertCircle, Bookmark } from "lucide-react";

export function TraumaBayMatrix() {
  const { traumaBays, toggleBayStatus } = useAura();

  return (
    <div className="w-full bg-[var(--bg-canvas)] p-3 select-none">
      {/* Header with Facility name & DynamoDB Latency */}
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-[var(--border-hairline)]">
        <div className="flex items-center space-x-2">
          <Building2 className="w-4 h-4 text-[var(--accent-green)]" strokeWidth={1.5} />
          <span className="font-mono text-xs font-bold text-[var(--text-primary)]">
            KGMU TRAUMA CENTRE  -  CHOWK, LUCKNOW
          </span>
        </div>

        <div className="flex items-center space-x-1.5 font-mono text-[10px] text-[var(--text-secondary)]">
          <Database className="w-3 h-3 text-[var(--accent-green)]" strokeWidth={1.5} />
          <span>DYNAMODB SYNC:</span>
          <span className="font-bold text-[var(--accent-green)] tabular-nums">4.1ms</span>
        </div>
      </div>

      {/* 4-column desktop / 2-column mobile grid of 8 physical bays */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {traumaBays.map((bay) => {
          const isReserved = bay.status === "RESERVED";
          const isOccupied = bay.status === "OCCUPIED";
          const isAvailable = bay.status === "AVAILABLE";

          return (
            <button
              key={bay.id}
              type="button"
              onClick={() => toggleBayStatus(bay.id)}
              className={`p-3 border rounded-[2px] text-left transition-all cursor-pointer flex flex-col justify-between h-28 relative ${
                isReserved
                  ? "border-[var(--text-primary)] bg-[var(--bg-surface)]"
                  : isOccupied
                  ? "border-[var(--border-hairline)] bg-[var(--bg-surface)] opacity-85"
                  : "border-[var(--border-hairline)] bg-[var(--bg-surface)] hover:border-[var(--text-secondary)]"
              }`}
            >
              {/* Bay ID & Status Badge */}
              <div className="flex items-center justify-between w-full">
                <span className="font-mono text-xs font-bold text-[var(--text-primary)]">
                  {bay.id}
                </span>

                <span
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded-[1px] font-bold uppercase tracking-wider ${
                    isReserved
                      ? "bg-[var(--text-primary)] text-[var(--bg-surface)]"
                      : isOccupied
                      ? "bg-[var(--accent-alert)] text-white"
                      : "bg-[var(--accent-green)] text-white"
                  }`}
                >
                  {isReserved
                    ? "RESERVED"
                    : isOccupied
                    ? "OCCUPIED"
                    : "AVAILABLE"}
                </span>
              </div>

              {/* Bay Name & Unit */}
              <div>
                <div className="font-mono text-[11px] font-semibold text-[var(--text-primary)]">
                  {bay.name}
                </div>
                <div className="text-[10px] font-mono text-[var(--text-secondary)]">
                  {bay.unit}
                </div>
              </div>

              {/* Footer info: Ventilator & Reserved note */}
              <div className="w-full pt-1 border-t border-[var(--border-hairline)] flex items-center justify-between text-[9px] font-mono text-[var(--text-secondary)]">
                <span>
                  {isReserved ? (
                    <span className="text-[var(--accent-green)] font-bold">RESERVED: AMB-UP32-108</span>
                  ) : (
                    <span>VENTILATOR: {bay.ventilatorReady ? "READY" : "OFFLINE"}</span>
                  )}
                </span>
                <span className="tabular-nums">{bay.lastSyncedMs}ms</span>
              </div>
            </button>
          );
        })}
      </div>
      <div className="mt-2 text-right">
        <span className="font-mono text-[9px] text-[var(--text-secondary)]">
          * Click any bay to toggle AVAILABLE &harr; OCCUPIED (Fill all 8 to simulate AWS DynamoDB emergency diversion trigger)
        </span>
      </div>
    </div>
  );
}
