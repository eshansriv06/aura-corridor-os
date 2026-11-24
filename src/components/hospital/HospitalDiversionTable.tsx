"use client";

import React from "react";
import { useAura } from "@/context/AuraContext";
import { Table, MapPin, CheckCircle, AlertTriangle } from "lucide-react";

export function HospitalDiversionTable() {
  const { hospitals, isAllBaysOccupied } = useAura();

  return (
    <div className="w-full bg-[var(--bg-surface)] border-t border-[var(--border-hairline)] p-3 select-none">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[var(--border-hairline)]">
        <div className="flex items-center space-x-2">
          <Table className="w-3.5 h-3.5 text-[var(--accent-green)]" strokeWidth={1.5} />
          <span className="font-mono text-xs font-bold text-[var(--text-primary)]">
            REGIONAL TRAUMA NETWORK & DIVERSION COMPARISON TABLE
          </span>
        </div>
        <span className="text-[10px] font-mono text-[var(--text-secondary)]">
          ROUTING ALGORITHM: REAL-TIME DYNAMODB CAPACITY + DISTANCE MATRIX
        </span>
      </div>

      {/* Border-Ruled HTML Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-[var(--border-hairline)] font-mono text-[11px] text-left">
          <thead>
            <tr className="bg-[var(--bg-canvas)] border-b border-[var(--border-hairline)] text-[var(--text-secondary)] uppercase text-[10px]">
              <th className="p-2 border-r border-[var(--border-hairline)] font-semibold">FACILITY NAME</th>
              <th className="p-2 border-r border-[var(--border-hairline)] font-semibold">DISTANCE</th>
              <th className="p-2 border-r border-[var(--border-hairline)] font-semibold">CORRIDOR ETA</th>
              <th className="p-2 border-r border-[var(--border-hairline)] font-semibold">TRAUMA BAYS OPEN</th>
              <th className="p-2 border-r border-[var(--border-hairline)] font-semibold">ICU VENTILATORS</th>
              <th className="p-2 font-semibold">AURA ROUTING DECISION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-hairline)]">
            {hospitals.map((hosp) => {
              const isPrimary = hosp.decision === "PRIMARY_TARGET";
              const isBypassed = hosp.decision === "BYPASSED_FULL";

              return (
                <tr
                  key={hosp.id}
                  className={`transition-colors ${
                    isPrimary
                      ? "bg-[var(--bg-canvas)]"
                      : "hover:bg-[var(--bg-canvas)]"
                  }`}
                >
                  {/* Facility Name & Location */}
                  <td className="p-2.5 border-r border-[var(--border-hairline)]">
                    <div className="font-bold text-[var(--text-primary)]">{hosp.name}</div>
                    <div className="text-[10px] text-[var(--text-secondary)]">{hosp.location}</div>
                  </td>

                  {/* Distance */}
                  <td className="p-2.5 border-r border-[var(--border-hairline)] tabular-nums font-semibold text-[var(--text-primary)]">
                    {hosp.distanceKm} KM
                  </td>

                  {/* Corridor ETA */}
                  <td className="p-2.5 border-r border-[var(--border-hairline)] tabular-nums font-semibold text-[var(--text-primary)]">
                    {hosp.etaMinutes} MIN
                  </td>

                  {/* Trauma Bays Open */}
                  <td className="p-2.5 border-r border-[var(--border-hairline)] tabular-nums">
                    <span
                      className={`font-bold ${
                        hosp.traumaBaysOpen > 0
                          ? "text-[var(--accent-green)]"
                          : "text-[var(--accent-alert)]"
                      }`}
                    >
                      {String(hosp.traumaBaysOpen).padStart(2, "0")} BAYS
                    </span>
                  </td>

                  {/* ICU Ventilators */}
                  <td className="p-2.5 border-r border-[var(--border-hairline)] tabular-nums font-semibold text-[var(--text-primary)]">
                    {hosp.icuVentilators} UNITS
                  </td>

                  {/* Aura Routing Decision */}
                  <td className="p-2.5">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-[1px] tracking-wider uppercase ${
                        isPrimary
                          ? "bg-[var(--accent-green)] text-white"
                          : isBypassed
                          ? "bg-[var(--accent-alert)] text-white font-bold"
                          : "bg-[var(--bg-canvas)] border border-[var(--border-hairline)] text-[var(--text-secondary)]"
                      }`}
                    >
                      {isPrimary
                        ? "PRIMARY TARGET"
                        : isBypassed
                        ? "BYPASSED  -  FULL"
                        : "STANDBY"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
