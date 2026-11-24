"use client";

import React, { useState } from "react";
import { useAura } from "@/context/AuraContext";
import { Zap, ShieldAlert, CheckCircle, UserCheck } from "lucide-react";

export function OperationalDispatchFeed() {
  const [activeTab, setActiveTab] = useState<"LAMBDA" | "SNS">("LAMBDA");
  const { lambdaLogs, snsBarricades, clearBarricade, waypoints } = useAura();

  const bar03 = waypoints.find((w) => w.id === "BAR-03");
  const isCleared = bar03?.barricadeStatus === "CLEARED";

  return (
    <div className="w-full h-full flex flex-col bg-[var(--bg-surface)] select-none overflow-hidden">
      {/* Feed Tabs Bar (1px hairline separated) */}
      <div className="h-10 border-b border-[var(--border-hairline)] bg-[var(--bg-canvas)] grid grid-cols-2 text-xs font-mono shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab("LAMBDA")}
          className={`flex items-center justify-center space-x-1.5 transition-colors border-b-2 cursor-pointer ${
            activeTab === "LAMBDA"
              ? "border-[var(--text-primary)] bg-[var(--bg-surface)] text-[var(--text-primary)] font-bold"
              : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-500" strokeWidth={1.5} />
          <span>TAB A: LAMBDA PREEMPTION</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("SNS")}
          className={`flex items-center justify-center space-x-1.5 transition-colors border-b-2 cursor-pointer ${
            activeTab === "SNS"
              ? "border-[var(--text-primary)] bg-[var(--bg-surface)] text-[var(--text-primary)] font-bold"
              : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-sky-500" strokeWidth={1.5} />
          <span>TAB B: SNS BARRICADES</span>
        </button>
      </div>

      {/* Tab Content Viewport */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {activeTab === "LAMBDA" ? (
          /* Tab A: AWS LAMBDA Preemption Log (Chronological Tabular Feed) */
          <div className="space-y-2">
            <div className="text-[10px] font-mono text-[var(--text-secondary)] uppercase flex items-center justify-between pb-1 border-b border-[var(--border-hairline)]">
              <span>AWS LAMBDA PREEMPTION LOG // GEOFENCE AUTOMATION</span>
              <span className="text-[var(--accent-green)] font-semibold">14MS EXECUTION LATENCY</span>
            </div>

            <div className="space-y-2">
              {lambdaLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-2.5 border border-[var(--border-hairline)] bg-[var(--bg-canvas)] rounded-[2px] font-mono text-[11px] space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-secondary)] text-[10px] tabular-nums">{log.timestamp}</span>
                    <span className="px-1.5 py-0.5 bg-[var(--accent-green)] text-white text-[9px] font-bold rounded-[1px]">
                      {log.status}
                    </span>
                  </div>

                  <div className="font-bold text-[var(--text-primary)] flex items-center justify-between">
                    <span>{log.functionName}</span>
                    <span className="text-[var(--accent-green)] font-bold tabular-nums">
                      {log.executionDurationMs}ms
                    </span>
                  </div>

                  <div className="text-[10px] text-[var(--text-secondary)]">
                    TRIGGER:{" "}
                    <span className="text-[var(--text-primary)]">
                      Amazon Location Service: {log.triggerEvent}
                    </span>
                  </div>

                  <div className="text-[10px] text-[var(--text-secondary)] flex items-center justify-between border-t border-[var(--border-hairline)] pt-1">
                    <span>ACTION: {log.actionTaken}</span>
                    <span className="tabular-nums">MEM: {log.memoryUsedMb}MB</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Tab B: AMAZON SNS Barricade Clearance Queue */
          <div className="space-y-3">
            <div className="text-[10px] font-mono text-[var(--text-secondary)] uppercase flex items-center justify-between pb-1 border-b border-[var(--border-hairline)]">
              <span>AMAZON SNS BARRICADE CLEARANCE QUEUE</span>
              <span className="text-amber-500 font-bold">1 ACTIVE INTERSECTION</span>
            </div>

            {snsBarricades.map((bar) => (
              <div
                key={bar.id}
                className={`p-3 border rounded-[2px] font-mono space-y-2.5 transition-colors ${
                  isCleared
                    ? "border-[var(--accent-green)] bg-[var(--bg-canvas)]"
                    : "border-amber-500 bg-[var(--bg-canvas)]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-[1px] ${
                        isCleared ? "bg-[var(--accent-green)]" : "bg-amber-500"
                      }`}
                    />
                    <span className="font-bold text-[12px] text-[var(--text-primary)]">
                      {bar.gateId} : SHAH MINA ROAD BARRICADE GATE
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-[9px] font-bold rounded-[1px] uppercase ${
                      isCleared
                        ? "bg-[var(--accent-green)] text-white"
                        : "bg-amber-500 text-black font-bold"
                    }`}
                  >
                    {isCleared ? "CLEARED" : "YELLOW BARRICADE HELD"}
                  </span>
                </div>

                <div className="text-[11px] text-[var(--text-secondary)]">
                  ZONE: <span className="text-[var(--text-primary)] font-semibold">{bar.locationName}</span>
                </div>

                <div className="p-2 border border-[var(--border-hairline)] bg-[var(--bg-surface)] rounded-[2px] text-[10px] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-1">
                      <UserCheck className="w-3 h-3 text-[var(--text-secondary)]" strokeWidth={1.5} />
                      <span>STATIONED OFFICER:</span>
                    </span>
                    <span className="font-semibold text-[var(--text-primary)]">
                      Constable R. Verma (Badge #UPP-4882)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>SMS PUSH NOTIFICATION (SNS):</span>
                    <span className="text-[var(--accent-green)] font-semibold">DELIVERED (+91-94520-77312)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>AMBULANCE PROXIMITY:</span>
                    <span className="font-bold text-amber-500 tabular-nums">
                      {isCleared ? "PASSING SAFELY" : "500M GEOFENCE ENTERED"}
                    </span>
                  </div>
                </div>

                {/* Tactile Action Button */}
                <button
                  type="button"
                  onClick={() => clearBarricade("BAR-03")}
                  disabled={isCleared}
                  className={`w-full py-2.5 px-3 rounded-[2px] font-mono text-[11px] font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                    isCleared
                      ? "bg-[var(--accent-green)] text-white opacity-95 cursor-default"
                      : "bg-[var(--accent-alert)] text-white hover:opacity-95 shadow-none"
                  }`}
                >
                  <CheckCircle className="w-4 h-4" strokeWidth={1.5} />
                  <span>
                    {isCleared
                      ? "BARRICADE CLEARED // CORRIDOR OPEN"
                      : "MARK BARRICADE CLEARED"}
                  </span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
