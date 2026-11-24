"use client";

import React from "react";
import { useAura } from "@/context/AuraContext";
import { TriageSeverity } from "@/types/aura";
import { CheckCircle, Zap } from "lucide-react";

export function TriageControlDock() {
  const { ambulance, setTriageSeverity, toggleCorridorLatch } = useAura();

  const severities: { key: TriageSeverity; label: string; sub: string }[] = [
    {
      key: "CRITICAL",
      label: "CRITICAL",
      sub: "TRAUMA / CARDIAC",
    },
    {
      key: "SEVERE",
      label: "SEVERE",
      sub: "MULTIPLE FRACTURES",
    },
    {
      key: "MODERATE",
      label: "MODERATE",
      sub: "STABLE CONCUSSION",
    },
  ];

  return (
    <div className="w-full bg-[var(--bg-surface)] border-t border-[var(--border-hairline)] p-2 sm:p-3 select-none flex flex-col space-y-2 shrink-0">
      {/* Triage Severity Selector (3-Cell Segmented Toggle) */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-1">
          <span className="font-mono text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">
            TRIAGE SEVERITY // HOSPITAL PROTOCOL LOCK
          </span>
          <span className="font-mono text-[10px] text-[var(--accent-green)] font-semibold">
            LOCKED DESTINATION: KGMU CHOWK [{ambulance.assignedBayId}]
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1.5 p-1 bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded-[2px]">
          {severities.map((sev) => {
            const isSelected = ambulance.severity === sev.key;
            const isCritical = sev.key === "CRITICAL";

            return (
              <button
                key={sev.key}
                type="button"
                onClick={() => setTriageSeverity(sev.key)}
                className={`py-2 px-1 text-center rounded-[2px] transition-all cursor-pointer flex flex-col items-center justify-center border ${
                  isSelected
                    ? isCritical
                      ? "bg-[var(--accent-alert)] text-white border-[var(--accent-alert)] font-bold"
                      : "bg-[var(--text-primary)] text-[var(--bg-surface)] border-[var(--text-primary)] font-bold"
                    : "bg-transparent text-[var(--text-secondary)] border-transparent hover:text-[var(--text-primary)] hover:border-[var(--border-hairline)]"
                }`}
              >
                <span className="text-[11px] sm:text-[12px] font-mono tracking-wide leading-tight">
                  {sev.label}
                </span>
                <span className="text-[8px] sm:text-[9px] font-mono opacity-80 leading-tight">
                  {sev.sub}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Master Corridor Latch Button (64px height, full width, 2px radius) */}
      <div className="w-full">
        <button
          type="button"
          onClick={toggleCorridorLatch}
          className={`h-16 w-full rounded-[2px] font-mono tracking-wider text-xs sm:text-sm font-bold uppercase cursor-pointer transition-all flex items-center justify-center space-x-2 border-2 ${
            ambulance.corridorLatched
              ? "bg-[var(--accent-green)] text-white border-[var(--accent-green)] hover:opacity-95"
              : "bg-[var(--accent-alert)] text-white border-[var(--accent-alert)] hover:opacity-95"
          }`}
        >
          {ambulance.corridorLatched ? (
            <>
              <CheckCircle className="w-5 h-5 shrink-0" strokeWidth={2} />
              <div className="flex flex-col text-left">
                <span>CORRIDOR LATCHED // COMPLETE TRIP</span>
                <span className="text-[9px] font-normal tracking-tight opacity-90">
                  ALL 4 SIGNALS LOCKED TO FORCE GREEN • AWS LAMBDA PREEMPTION ACTIVE
                </span>
              </div>
            </>
          ) : (
            <>
              <Zap className="w-5 h-5 shrink-0 fill-current" strokeWidth={1.5} />
              <div className="flex flex-col text-left">
                <span>ACTIVATE GREEN CORRIDOR : ONE TAP</span>
                <span className="text-[9px] font-normal tracking-tight opacity-90">
                  ENGAGE EMERGENCY PREEMPTION PROTOCOL • AP-SOUTH-1 IOT CORE
                </span>
              </div>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
