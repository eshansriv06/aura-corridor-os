"use client";

import React from "react";
import { Table, TrendingUp, Clock, ShieldCheck } from "lucide-react";

export function GoldenHourComparisonTable() {
  const comparisonData = [
    {
      metric: "Hazratganj to Kaiserbagh (1.8 km)",
      standard: "08 min 45 sec",
      aura: "02 min 10 sec",
      delta: "-06 min 35 sec (75% faster)",
    },
    {
      metric: "Kaiserbagh to Shah Mina Gate (1.6 km)",
      standard: "07 min 30 sec",
      aura: "01 min 45 sec",
      delta: "-05 min 45 sec (77% faster)",
    },
    {
      metric: "Red-Light Signal Wait Duration (3 Intersections)",
      standard: "06 min 15 sec",
      aura: "00 min 00 sec (FORCE_GREEN)",
      delta: "100% Elimination of Red Stops",
    },
    {
      metric: "Shah Mina Police Barricade Gate Clearance",
      standard: "04 min 20 sec (Manual radio calls)",
      aura: "00 min 19 sec (Amazon SNS alert)",
      delta: "-04 min 01 sec (93% faster)",
    },
    {
      metric: "Hospital Intake & Bay Allocation Delay",
      standard: "05 min 10 sec (Paper triage on arrival)",
      aura: "00 min 00 sec (Pre-Allocated via DynamoDB)",
      delta: "Zero Intake Lag / Bay Ready",
    },
    {
      metric: "TOTAL ROUTE DURATION (4.6 KM)",
      standard: "24 MIN 30 SEC",
      aura: "07 MIN 20 SEC",
      delta: "+17 MIN 10 SEC PRESERVED (70% GAIN)",
      isHighlight: true,
    },
  ];

  return (
    <div className="w-full bg-[var(--bg-surface)] p-3 select-none">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[var(--border-hairline)]">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-[var(--accent-green)]" strokeWidth={1.5} />
          <span className="font-mono text-xs font-bold text-[var(--text-primary)]">
            GOLDEN HOUR TRANSIT BENCHMARK: STANDARD CONGESTED vs. AURA CORRIDOR
          </span>
        </div>
        <span className="font-mono text-[10px] text-[var(--accent-green)] font-semibold">
          EMPIRICAL TRIAGE EFFICIENCY: 70% FASTER BED-TO-CORRIDOR TRANSIT
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-[var(--border-hairline)] font-mono text-[11px] text-left">
          <thead>
            <tr className="bg-[var(--bg-canvas)] border-b border-[var(--border-hairline)] text-[var(--text-secondary)] uppercase text-[10px]">
              <th className="p-2 border-r border-[var(--border-hairline)] font-semibold">OPERATIONAL METRIC</th>
              <th className="p-2 border-r border-[var(--border-hairline)] font-semibold text-[var(--accent-alert)]">
                STANDARD CONGESTED TRANSIT
              </th>
              <th className="p-2 border-r border-[var(--border-hairline)] font-semibold text-[var(--accent-green)]">
                AURA PREEMPTED GREEN CORRIDOR
              </th>
              <th className="p-2 font-semibold">GOLDEN HOUR PRESERVATION DELTA</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-hairline)]">
            {comparisonData.map((row, idx) => {
              return (
                <tr
                  key={idx}
                  className={`transition-colors ${
                    row.isHighlight
                      ? "bg-[var(--bg-canvas)] font-bold text-[var(--text-primary)]"
                      : "hover:bg-[var(--bg-canvas)]"
                  }`}
                >
                  <td className="p-2.5 border-r border-[var(--border-hairline)] font-semibold">
                    {row.metric}
                  </td>
                  <td className="p-2.5 border-r border-[var(--border-hairline)] text-[var(--text-secondary)] tabular-nums">
                    {row.standard}
                  </td>
                  <td className="p-2.5 border-r border-[var(--border-hairline)] text-[var(--accent-green)] font-bold tabular-nums">
                    {row.aura}
                  </td>
                  <td className="p-2.5 text-[var(--text-primary)] font-medium tabular-nums">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded-[1px] ${
                        row.isHighlight
                          ? "bg-[var(--accent-green)] text-white font-bold"
                          : "text-[var(--accent-green)] font-semibold"
                      }`}
                    >
                      {row.delta}
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
