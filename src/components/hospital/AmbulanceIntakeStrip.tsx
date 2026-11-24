"use client";

import React, { useMemo } from "react";
import { useAura } from "@/context/AuraContext";
import { Clock, ShieldAlert, Heart, Wind, Activity, AlertOctagon } from "lucide-react";

export function AmbulanceIntakeStrip() {
  const { ambulance, diversionActive, isAllBaysOccupied } = useAura();

  const formattedEta = useMemo(() => {
    const m = Math.floor(ambulance.etaSeconds / 60);
    const s = ambulance.etaSeconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }, [ambulance.etaSeconds]);

  return (
    <div className="w-full bg-[var(--bg-surface)] border-b border-[var(--border-hairline)] p-3 select-none shrink-0">
      {/* Diversion Warning Banner if triggered */}
      {diversionActive && (
        <div className="mb-3 p-2.5 bg-[var(--accent-alert)] text-white font-mono text-xs font-bold rounded-[2px] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertOctagon className="w-4 h-4 animate-bounce shrink-0" strokeWidth={2} />
            <span>
              CRITICAL DIVERSION ALERT: 100% KGMU TRAUMA BAYS OCCUPIED  -  AMB-UP32-108 REROUTED TO RMLIMS (GOMTI NAGAR)!
            </span>
          </div>
          <span className="text-[10px] uppercase underline tracking-wider">
            AWS LAMBDA AUTO-DIVERSION #9921
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
        {/* Unit & Status */}
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-base font-bold font-mono text-[var(--text-primary)]">
              {ambulance.unitId}
            </span>
            <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-[var(--accent-alert)] text-white rounded-[1px]">
              {ambulance.vitals.triageClass}
            </span>
          </div>
          <div className="text-[10px] font-mono text-[var(--accent-green)] font-bold flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)] inline-block" />
            <span>PRE-ALLOCATED VIA AURA TRIAGE</span>
          </div>
        </div>

        {/* 32px Tabular Countdown Timer */}
        <div className="flex items-center space-x-2 border-l-0 md:border-l border-[var(--border-hairline)] md:pl-4">
          <Clock className="w-5 h-5 text-[var(--accent-green)] shrink-0" strokeWidth={1.5} />
          <div>
            <div className="text-[9px] font-mono text-[var(--text-secondary)] uppercase">
              ESTIMATED TIME OF ARRIVAL
            </div>
            <div className="text-3xl font-bold font-mono text-[var(--text-primary)] tabular-nums leading-none">
              ETA {formattedEta}
            </div>
          </div>
        </div>

        {/* Live Transmitted Vitals */}
        <div className="border-l-0 md:border-l border-[var(--border-hairline)] md:pl-4 space-y-1">
          <div className="flex items-center space-x-1.5 text-[9px] font-mono text-[var(--text-secondary)] uppercase">
            <span
              className={`w-2 h-2 rounded-full transition-transform duration-150 inline-block ${
                ambulance.vitals.pulseBeat
                  ? "bg-[var(--accent-alert)] scale-125"
                  : "bg-[var(--accent-green)] scale-100"
              }`}
            />
            <span>LIVE TRANSMITTED VITALS (FREQ: 1.3s)</span>
          </div>
          <div className="font-mono text-xs font-semibold text-[var(--text-primary)] flex items-center space-x-2 flex-wrap">
            <span>BP {ambulance.vitals.bp} MMHG</span>
            <span>•</span>
            <span className="text-sky-500">SPO2 {ambulance.vitals.spo2}%</span>
            <span>•</span>
            <span className="text-[var(--accent-alert)]">HR {ambulance.vitals.hr} BPM</span>
            <span>•</span>
            <span className="text-[var(--accent-green)]">{ambulance.vitals.tempF}°F</span>
          </div>
        </div>

        {/* Trauma Protocol / Allocated Bay */}
        <div className="border-l-0 md:border-l border-[var(--border-hairline)] md:pl-4 flex flex-col justify-center">
          <div className="text-[9px] font-mono text-[var(--text-secondary)] uppercase">
            RESERVED FACILITY RESOURCE
          </div>
          <div className="text-sm font-bold font-mono text-[var(--text-primary)]">
            {ambulance.assignedBayId} // TRAUMA SURGERY
          </div>
          <div className="text-[10px] font-mono text-[var(--text-secondary)]">
            VENTILATOR SYNC: 100% READY
          </div>
        </div>
      </div>
    </div>
  );
}
