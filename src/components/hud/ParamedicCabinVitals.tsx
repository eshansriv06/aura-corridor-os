"use client";

import React from "react";
import { useAura } from "@/context/AuraContext";
import { Activity, Heart, Wind, Thermometer, ShieldCheck, Cpu, Play, Pause } from "lucide-react";

export function ParamedicCabinVitals() {
  const { ambulance, isVitalsOscillating, setIsVitalsOscillating, vitalsTickCount } = useAura();

  const isPulseBeat = ambulance.vitals.pulseBeat;

  return (
    <div className="w-full h-full bg-[var(--bg-surface)] p-3 flex flex-col space-y-3 select-none overflow-y-auto">
      {/* Cabin Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[var(--border-hairline)]">
        <div className="flex items-center space-x-1.5">
          <Activity className="w-3.5 h-3.5 text-[var(--accent-alert)]" strokeWidth={1.5} />
          <span className="font-mono text-[10px] text-[var(--text-secondary)] uppercase font-semibold">
            TELEMETRY // PATIENT MONITOR
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {/* Live Frequency Pulsing Dot */}
          <div className="flex items-center space-x-1 text-[9px] font-mono text-[var(--accent-green)] font-semibold">
            <span
              className={`w-2 h-2 rounded-full transition-transform duration-150 ${
                isPulseBeat
                  ? "bg-[var(--accent-alert)] scale-125"
                  : "bg-[var(--accent-green)] scale-100"
              }`}
            />
            <span>LIVE (0.75s)</span>
          </div>

          <button
            type="button"
            onClick={() => setIsVitalsOscillating(!isVitalsOscillating)}
            title="Toggle Live Telemetry Ticker"
            className="p-1 border border-[var(--border-hairline)] bg-[var(--bg-canvas)] rounded-[1px] hover:border-[var(--text-primary)] cursor-pointer text-[var(--text-secondary)]"
          >
            {isVitalsOscillating ? (
              <Pause className="w-2.5 h-2.5" strokeWidth={1.5} />
            ) : (
              <Play className="w-2.5 h-2.5 fill-current" strokeWidth={1.5} />
            )}
          </button>
        </div>
      </div>

      {/* Patient Classification Tag */}
      <div className="flex items-center justify-between p-1.5 bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded-[2px] font-mono text-[10px]">
        <span className="text-[var(--text-secondary)]">TRAUMA PROFILE:</span>
        <span className="font-bold text-[var(--accent-alert)]">{ambulance.vitals.triageClass}</span>
      </div>

      {/* 4-Cell Vitals Grid */}
      <div className="grid grid-cols-2 gap-2">
        {/* Heart Rate / Pulse */}
        <div className="p-2 border border-[var(--border-hairline)] bg-[var(--bg-canvas)] rounded-[2px]">
          <div className="flex items-center justify-between text-[10px] text-[var(--text-secondary)] font-mono mb-1">
            <span className="flex items-center space-x-1">
              <Heart
                className={`w-3 h-3 text-[var(--accent-alert)] transition-transform duration-150 ${
                  isPulseBeat ? "scale-125" : "scale-100"
                }`}
                strokeWidth={1.5}
              />
              <span>PULSE (HR)</span>
            </span>
            <span className="text-[9px] uppercase">BPM</span>
          </div>
          <div className="text-2xl font-bold font-mono text-[var(--text-primary)] tabular-nums flex items-baseline space-x-1">
            <span>{ambulance.vitals.hr}</span>
            <span className="text-[10px] text-[var(--text-secondary)] font-normal">/min</span>
          </div>
          <div className="text-[9px] font-mono text-[var(--accent-alert)] font-semibold mt-0.5">
            TACHYCARDIA ALERT
          </div>
        </div>

        {/* SpO2 */}
        <div className="p-2 border border-[var(--border-hairline)] bg-[var(--bg-canvas)] rounded-[2px]">
          <div className="flex items-center justify-between text-[10px] text-[var(--text-secondary)] font-mono mb-1">
            <span className="flex items-center space-x-1">
              <Wind className="w-3 h-3 text-sky-500" strokeWidth={1.5} />
              <span>SPO2 OXYGEN</span>
            </span>
            <span className="text-[9px] uppercase">%</span>
          </div>
          <div className="text-2xl font-bold font-mono text-[var(--text-primary)] tabular-nums">
            {ambulance.vitals.spo2}%
          </div>
          <div className="text-[9px] font-mono text-amber-500 font-semibold mt-0.5">
            BORDERLINE HYPOXIA
          </div>
        </div>

        {/* Blood Pressure */}
        <div className="p-2 border border-[var(--border-hairline)] bg-[var(--bg-canvas)] rounded-[2px]">
          <div className="flex items-center justify-between text-[10px] text-[var(--text-secondary)] font-mono mb-1">
            <span>BLOOD PRESS.</span>
            <span className="text-[9px] uppercase">MMHG</span>
          </div>
          <div className="text-2xl font-bold font-mono text-[var(--text-primary)] tabular-nums">
            {ambulance.vitals.bp}
          </div>
          <div className="text-[9px] font-mono text-[var(--accent-alert)] font-semibold mt-0.5">
            HYPOTENSION // SHOCK
          </div>
        </div>

        {/* Body Temperature */}
        <div className="p-2 border border-[var(--border-hairline)] bg-[var(--bg-canvas)] rounded-[2px]">
          <div className="flex items-center justify-between text-[10px] text-[var(--text-secondary)] font-mono mb-1">
            <span className="flex items-center space-x-1">
              <Thermometer className="w-3 h-3 text-[var(--text-secondary)]" strokeWidth={1.5} />
              <span>TEMP</span>
            </span>
            <span className="text-[9px] uppercase">°F</span>
          </div>
          <div className="text-2xl font-bold font-mono text-[var(--text-primary)] tabular-nums">
            {ambulance.vitals.tempF}°
          </div>
          <div className="text-[9px] font-mono text-[var(--accent-green)] font-semibold mt-0.5">
            NORMOTHERMIC
          </div>
        </div>
      </div>

      {/* Live Oscillating Lead II ECG Waveform (Industrial SVG Line) */}
      <div className="p-2 border border-[var(--border-hairline)] bg-[var(--bg-canvas)] rounded-[2px]">
        <div className="flex items-center justify-between text-[9px] font-mono text-[var(--text-secondary)] mb-1">
          <span>LEAD II ECG // TABULAR TELEMETRY</span>
          <span className="text-[var(--accent-green)] font-semibold">
            {ambulance.vitals.hr} BPM • 1.2 mV
          </span>
        </div>
        <div className="h-10 w-full flex items-center overflow-hidden">
          <svg
            viewBox="0 0 300 40"
            className="w-full h-full stroke-[var(--accent-green)]"
            fill="none"
          >
            <polyline
              points={`0,20 30,20 35,18 40,20 48,20 53,${
                isPulseBeat ? 3 : 5
              } 60,${isPulseBeat ? 38 : 35} 66,12 72,20 90,20 130,20 135,18 140,20 148,20 153,${
                isPulseBeat ? 3 : 5
              } 160,${isPulseBeat ? 38 : 35} 166,12 172,20 190,20 230,20 235,18 240,20 248,20 253,5 260,35 266,12 272,20 300,20`}
              strokeWidth="1.5"
            />
          </svg>
        </div>
      </div>

      {/* Receiving Facility Lock Status */}
      <div className="p-2.5 border border-[var(--border-hairline)] bg-[var(--bg-canvas)] rounded-[2px] space-y-1.5">
        <div className="flex items-center space-x-1.5 text-[10px] font-mono text-[var(--accent-green)] font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span>HOSPITAL PRE-ALLOCATION VERIFIED</span>
        </div>
        <div className="text-[11px] font-bold text-[var(--text-primary)] font-mono">
          {ambulance.assignedHospitalName}
        </div>
        <div className="text-[10px] font-mono text-[var(--text-secondary)]">
          TARGET: <span className="text-[var(--accent-green)] font-semibold">{ambulance.assignedBayId}</span> (ICU Ventilator Pre-Warmed)
        </div>
        <div className="text-[10px] font-mono text-[var(--text-secondary)]">
          TELEMETRY SYNC: <span className="text-[var(--accent-green)]">TICK #{vitalsTickCount}</span> (Java Spring Boot)
        </div>
      </div>

      {/* AWS IoT Link Quality Indicator */}
      <div className="p-2 border border-[var(--border-hairline)] bg-[var(--bg-canvas)] rounded-[2px] font-mono text-[9px] text-[var(--text-secondary)] space-y-1">
        <div className="flex items-center justify-between">
          <span className="flex items-center space-x-1">
            <Cpu className="w-3 h-3 text-[var(--accent-green)]" strokeWidth={1.5} />
            <span>AWS IOT CORE MQTT</span>
          </span>
          <span className="text-[var(--accent-green)] font-bold">18 MS RTT</span>
        </div>
        <div className="flex items-center justify-between">
          <span>PACKET LOSS:</span>
          <span className="text-[var(--accent-green)] font-bold">0.00%</span>
        </div>
        <div className="flex items-center justify-between">
          <span>TLS CIPHER:</span>
          <span>AES-256-GCM-SHA384</span>
        </div>
      </div>
    </div>
  );
}
