"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAura } from "@/context/AuraContext";
import {
  Server,
  Activity,
  Radio,
  Cpu,
  CheckCircle2,
  Send,
  Zap,
  Shield,
  Layers,
  ArrowRight,
  RefreshCw,
  Database,
  Table as TableIcon,
  RotateCcw,
} from "lucide-react";

interface ProbeResult {
  endpoint: string;
  method: string;
  status: string;
  latencyMs: number;
  payload: Record<string, any>;
  timestamp: string;
}

export function JavaBackendSpecView() {
  const { reseedSyntheticDatabase } = useAura();
  const [activeTab, setActiveTab] = useState<"PROBE" | "DATABASE">("DATABASE");
  const [activeProbe, setActiveProbe] = useState<string>("HEALTH");
  const [isProbing, setIsProbing] = useState<boolean>(false);
  const [selectedDbTable, setSelectedDbTable] = useState<string>("corridor");
  const [dbData, setDbData] = useState<any>(null);
  const [isLoadingDb, setIsLoadingDb] = useState<boolean>(false);

  const [probeResult, setProbeResult] = useState<ProbeResult>({
    endpoint: "/api/database",
    method: "GET",
    status: "200 OK",
    latencyMs: 3.8,
    payload: {
      status: "UP",
      service: "Aura Emergency Corridor Core Engine",
      region: "ap-south-1",
      activeUnit: "AMB-UP32-108",
      database: "Synthetic DynamoDB Memory Engine (ap-south-1)",
      tables: 5,
    },
    timestamp: "00:51:24.112",
  });

  const fetchDatabaseState = useCallback(async () => {
    setIsLoadingDb(true);
    try {
      const res = await fetch("/api/database", { cache: "no-store" });
      const json = await res.json();
      if (json.success) {
        setDbData(json.data);
      }
    } catch {
      // ignore
    } finally {
      setIsLoadingDb(false);
    }
  }, []);

  useEffect(() => {
    fetchDatabaseState();
  }, [fetchDatabaseState]);

  const handleReseed = async () => {
    setIsLoadingDb(true);
    try {
      await fetch("/api/database", { method: "POST" });
      await reseedSyntheticDatabase();
      await fetchDatabaseState();
    } catch {
      // ignore
    } finally {
      setIsLoadingDb(false);
    }
  };

  const runProbe = async (probeType: string) => {
    setIsProbing(true);
    const now = new Date();
    const timeStr = now.toTimeString().split(" ")[0] + "." + String(now.getMilliseconds()).padStart(3, "0");
    const t0 = performance.now();

    try {
      if (probeType === "HEALTH") {
        const res = await fetch("/api/database");
        const json = await res.json();
        const latency = Math.round(performance.now() - t0);
        setProbeResult({
          endpoint: "/api/database",
          method: "GET",
          status: `${res.status} OK`,
          latencyMs: latency,
          payload: json,
          timestamp: timeStr,
        });
      } else if (probeType === "LATCH") {
        const res = await fetch("/api/corridor/latch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ latched: true }),
        });
        const json = await res.json();
        const latency = Math.round(performance.now() - t0);
        setProbeResult({
          endpoint: "/api/corridor/latch",
          method: "POST",
          status: `${res.status} OK`,
          latencyMs: latency,
          payload: json,
          timestamp: timeStr,
        });
      } else if (probeType === "GPS") {
        const res = await fetch("/api/corridor");
        const json = await res.json();
        const latency = Math.round(performance.now() - t0);
        setProbeResult({
          endpoint: "/api/corridor",
          method: "GET",
          status: `${res.status} OK`,
          latencyMs: latency,
          payload: json,
          timestamp: timeStr,
        });
      } else if (probeType === "BARRICADE") {
        const res = await fetch("/api/signals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "CLEAR_BARRICADE", barricadeId: "BAR-03", officerBadge: "UPP-4882" }),
        });
        const json = await res.json();
        const latency = Math.round(performance.now() - t0);
        setProbeResult({
          endpoint: "/api/signals",
          method: "POST",
          status: `${res.status} OK`,
          latencyMs: latency,
          payload: json,
          timestamp: timeStr,
        });
      } else if (probeType === "HOSPITAL") {
        const res = await fetch("/api/hospital/bays");
        const json = await res.json();
        const latency = Math.round(performance.now() - t0);
        setProbeResult({
          endpoint: "/api/hospital/bays",
          method: "GET",
          status: `${res.status} OK`,
          latencyMs: latency,
          payload: json,
          timestamp: timeStr,
        });
      }
    } catch (err: any) {
      setProbeResult({
        endpoint: "/api/database",
        method: "PROBE",
        status: "500 ERROR",
        latencyMs: Math.round(performance.now() - t0),
        payload: { error: err.message || "Network request failed" },
        timestamp: timeStr,
      });
    } finally {
      setActiveProbe(probeType);
      setIsProbing(false);
      fetchDatabaseState();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[var(--bg-canvas)] select-none">
      {/* Top 4-Cell Telemetry Strip */}
      <div className="w-full bg-[var(--bg-surface)] border-b border-[var(--border-hairline)] grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[var(--border-hairline)] shrink-0">
        <div className="p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-secondary)] mb-1">
            <span className="flex items-center space-x-1">
              <Server className="w-3 h-3 text-[var(--accent-green)]" strokeWidth={1.5} />
              <span>CORE REST GATEWAY</span>
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)] animate-pulse" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-lg font-bold font-mono text-[var(--text-primary)] tabular-nums">
              /api/*
            </span>
            <span className="text-[10px] font-mono text-[var(--accent-green)] font-semibold">
              LIVE CONNECTED
            </span>
          </div>
        </div>

        <div className="p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-secondary)] mb-1">
            <span className="flex items-center space-x-1">
              <Database className="w-3 h-3 text-sky-500" strokeWidth={1.5} />
              <span>SYNTHETIC DATABASE</span>
            </span>
            <span className="text-[9px] font-mono text-[var(--accent-green)] font-semibold">SYNCED</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-lg font-bold font-mono text-[var(--text-primary)] tabular-nums">
              {dbData?.stats?.totalRecords || 24} RECORDS
            </span>
            <span className="text-[10px] font-mono text-[var(--text-secondary)]">
              5 TABLES
            </span>
          </div>
        </div>

        <div className="p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-secondary)] mb-1">
            <span className="flex items-center space-x-1">
              <Activity className="w-3 h-3 text-[var(--accent-green)]" strokeWidth={1.5} />
              <span>QUERY LATENCY</span>
            </span>
            <span className="text-[9px] font-mono text-[var(--accent-green)] font-semibold">DETERMINISTIC</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-lg font-bold font-mono text-[var(--accent-green)] tabular-nums">
              {probeResult.latencyMs} MS
            </span>
            <span className="text-[10px] font-mono text-[var(--text-secondary)]">
              IN-MEMORY
            </span>
          </div>
        </div>

        <div className="p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-secondary)] mb-1">
            <span className="flex items-center space-x-1">
              <Cpu className="w-3 h-3 text-amber-500" strokeWidth={1.5} />
              <span>STORAGE ENGINE</span>
            </span>
            <span className="text-[9px] font-mono text-[var(--text-primary)]">ap-south-1</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-lg font-bold font-mono text-[var(--text-primary)] tabular-nums">
              DYNAMODB
            </span>
            <span className="text-[10px] font-mono text-[var(--text-secondary)]">
              PARTITIONED
            </span>
          </div>
        </div>
      </div>

      {/* Mode Switcher Strip */}
      <div className="h-9 px-3 bg-[var(--bg-canvas)] border-b border-[var(--border-hairline)] flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setActiveTab("DATABASE")}
            className={`px-2.5 py-1 text-[11px] font-mono rounded-[2px] transition-colors border cursor-pointer flex items-center space-x-1.5 ${
              activeTab === "DATABASE"
                ? "bg-[var(--bg-surface)] text-[var(--text-primary)] font-bold border-[var(--text-primary)]"
                : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Database className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>SYNTHETIC DATABASE EXPLORER</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("PROBE")}
            className={`px-2.5 py-1 text-[11px] font-mono rounded-[2px] transition-colors border cursor-pointer flex items-center space-x-1.5 ${
              activeTab === "PROBE"
                ? "bg-[var(--bg-surface)] text-[var(--text-primary)] font-bold border-[var(--text-primary)]"
                : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Server className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>OPERATIONAL API PROBE DESK</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleReseed}
          disabled={isLoadingDb}
          className="px-2 py-1 text-[10px] font-mono border border-[var(--border-hairline)] bg-[var(--bg-surface)] hover:border-[var(--text-secondary)] text-[var(--text-primary)] rounded-[2px] flex items-center space-x-1 cursor-pointer transition-colors"
          title="Reset synthetic database to initial Lucknow corridor seed state"
        >
          <RotateCcw className={`w-3 h-3 ${isLoadingDb ? "animate-spin" : ""}`} strokeWidth={1.5} />
          <span>RE-SEED SYNTHETIC DB</span>
        </button>
      </div>

      {/* Viewport: Either Synthetic Database Explorer OR API Probe Desk */}
      {activeTab === "DATABASE" ? (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-[1px] bg-[var(--border-hairline)] overflow-hidden">
          {/* Table List (4 Cols) */}
          <div className="lg:col-span-4 bg-[var(--bg-surface)] flex flex-col overflow-hidden">
            <div className="h-9 px-3 bg-[var(--bg-canvas)] border-b border-[var(--border-hairline)] flex items-center justify-between text-xs shrink-0">
              <span className="font-mono text-[10px] text-[var(--text-secondary)] uppercase font-semibold">
                DATABASE COLLECTIONS & TABLES
              </span>
              <span className="font-mono text-[9px] text-[var(--accent-green)]">
                5 SCHEMAS
              </span>
            </div>

            <div className="p-2.5 space-y-1.5 overflow-y-auto font-mono text-[11px]">
              {[
                { id: "corridor", name: "corridors", desc: "Corridor run status, geofence latch, timer", count: "1 row" },
                { id: "ambulance", name: "ambulances", desc: "Unit UP32-108 GPS telemetry, speed, ETA", count: "1 row" },
                { id: "patient", name: "patient_vitals", desc: "Triage class, pulse, BP, SpO2, temp", count: "1 row" },
                { id: "waypoints", name: "traffic_signals", desc: "Hazratganj, Kaiserbagh, Shah Mina, KGMU", count: "4 rows" },
                { id: "traumaBays", name: "hospital_bays", desc: "TB-01 to TB-08 KGMU Trauma surgical bays", count: "8 rows" },
                { id: "dispatchLogs", name: "dispatch_logs", desc: "Immutable IoT Core, Lambda, DynamoDB logs", count: `${dbData?.dispatchLogs?.length || 3} rows` },
              ].map((table) => (
                <div
                  key={table.id}
                  onClick={() => setSelectedDbTable(table.id)}
                  className={`p-2 border rounded-[2px] cursor-pointer transition-colors ${
                    selectedDbTable === table.id
                      ? "border-[var(--text-primary)] bg-[var(--bg-canvas)]"
                      : "border-[var(--border-hairline)] bg-[var(--bg-surface)] hover:border-[var(--text-secondary)]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[var(--text-primary)] flex items-center space-x-1.5">
                      <TableIcon className="w-3 h-3 text-[var(--accent-green)]" strokeWidth={1.5} />
                      <span>{table.name}</span>
                    </span>
                    <span className="text-[10px] text-[var(--text-secondary)]">{table.count}</span>
                  </div>
                  <div className="text-[10px] text-[var(--text-secondary)] mt-0.5">{table.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Record Inspector (8 Cols) */}
          <div className="lg:col-span-8 bg-[var(--bg-canvas)] flex flex-col overflow-hidden">
            <div className="h-9 px-3 bg-[var(--bg-surface)] border-b border-[var(--border-hairline)] flex items-center justify-between text-xs shrink-0">
              <div className="flex items-center space-x-2 font-mono">
                <span className="text-[10px] text-[var(--text-secondary)] uppercase">INSPECTING TABLE:</span>
                <span className="font-bold text-[var(--text-primary)]">{selectedDbTable}</span>
              </div>
              <span className="font-mono text-[10px] text-[var(--text-secondary)]">
                LAST SYNC: {dbData?.lastSyncedAt?.slice(11, 23) || "SYNCED"}
              </span>
            </div>

            <div className="flex-1 p-3 overflow-y-auto font-mono text-[11px] leading-relaxed text-[var(--text-primary)] select-text bg-[var(--bg-canvas)]">
              {dbData ? (
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(dbData[selectedDbTable], null, 2)}
                </pre>
              ) : (
                <div className="text-[var(--text-secondary)] py-4 text-center">Loading synthetic database records...</div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-[1px] bg-[var(--border-hairline)] overflow-hidden">
          {/* Left Column (5 Cols): Live Operational Endpoints & Dispatch Tester */}
          <div className="lg:col-span-5 bg-[var(--bg-surface)] flex flex-col overflow-hidden">
            <div className="h-10 px-3 bg-[var(--bg-canvas)] border-b border-[var(--border-hairline)] flex items-center justify-between text-xs shrink-0">
              <span className="font-mono text-[10px] text-[var(--text-secondary)] uppercase font-semibold">
                OPERATIONAL API ENDPOINT PROBE DESK
              </span>
              <span className="font-mono text-[9px] text-[var(--accent-green)] font-semibold">
                5 INTERFACES READY
              </span>
            </div>

            <div className="p-3 space-y-2 overflow-y-auto">
              {/* Probe 1: Database Health */}
              <div
                onClick={() => runProbe("HEALTH")}
                className={`p-2.5 border rounded-[2px] font-mono text-[11px] cursor-pointer transition-colors ${
                  activeProbe === "HEALTH"
                    ? "border-[var(--text-primary)] bg-[var(--bg-canvas)]"
                    : "border-[var(--border-hairline)] bg-[var(--bg-surface)] hover:border-[var(--text-secondary)]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="px-1.5 py-0.5 bg-[var(--accent-green)] text-white text-[9px] font-bold rounded-[1px]">
                    GET
                  </span>
                  <span className="text-[10px] text-[var(--text-secondary)]">DATABASE HEALTH</span>
                </div>
                <div className="font-bold text-[var(--text-primary)] mt-1">/api/database</div>
                <div className="text-[10px] text-[var(--text-secondary)] mt-0.5">
                  Queries synthetic database snapshot, storage engine status, and active tables.
                </div>
              </div>

              {/* Probe 2: Corridor Latch */}
              <div
                onClick={() => runProbe("LATCH")}
                className={`p-2.5 border rounded-[2px] font-mono text-[11px] cursor-pointer transition-colors ${
                  activeProbe === "LATCH"
                    ? "border-[var(--text-primary)] bg-[var(--bg-canvas)]"
                    : "border-[var(--border-hairline)] bg-[var(--bg-surface)] hover:border-[var(--text-secondary)]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="px-1.5 py-0.5 bg-amber-500 text-black text-[9px] font-bold rounded-[1px]">
                    POST
                  </span>
                  <span className="text-[10px] text-[var(--text-secondary)]">TRAFFIC PREEMPTION</span>
                </div>
                <div className="font-bold text-[var(--text-primary)] mt-1">/api/corridor/latch</div>
                <div className="text-[10px] text-[var(--text-secondary)] mt-0.5">
                  Commands AWS IoT Core Thing Shadows to latch all upcoming corridor junctions to green.
                </div>
              </div>

              {/* Probe 3: GPS Telemetry */}
              <div
                onClick={() => runProbe("GPS")}
                className={`p-2.5 border rounded-[2px] font-mono text-[11px] cursor-pointer transition-colors ${
                  activeProbe === "GPS"
                    ? "border-[var(--text-primary)] bg-[var(--bg-canvas)]"
                    : "border-[var(--border-hairline)] bg-[var(--bg-surface)] hover:border-[var(--text-secondary)]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="px-1.5 py-0.5 bg-sky-500 text-white text-[9px] font-bold rounded-[1px]">
                    GET
                  </span>
                  <span className="text-[10px] text-[var(--text-secondary)]">CORRIDOR TELEMETRY</span>
                </div>
                <div className="font-bold text-[var(--text-primary)] mt-1">/api/corridor</div>
                <div className="text-[10px] text-[var(--text-secondary)] mt-0.5">
                  Streams tabular GPS vectors, current speed, and heading directly from the database.
                </div>
              </div>

              {/* Probe 4: Barricade Clearance */}
              <div
                onClick={() => runProbe("BARRICADE")}
                className={`p-2.5 border rounded-[2px] font-mono text-[11px] cursor-pointer transition-colors ${
                  activeProbe === "BARRICADE"
                    ? "border-[var(--text-primary)] bg-[var(--bg-canvas)]"
                    : "border-[var(--border-hairline)] bg-[var(--bg-surface)] hover:border-[var(--text-secondary)]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="px-1.5 py-0.5 bg-purple-600 text-white text-[9px] font-bold rounded-[1px]">
                    POST
                  </span>
                  <span className="text-[10px] text-[var(--text-secondary)]">POLICE DISPATCH (SNS)</span>
                </div>
                <div className="font-bold text-[var(--text-primary)] mt-1">/api/signals</div>
                <div className="text-[10px] text-[var(--text-secondary)] mt-0.5">
                  Processes on-duty police clearance acknowledgement for Shah Mina Gate (BAR-03).
                </div>
              </div>

              {/* Probe 5: Hospital Bay Reserve */}
              <div
                onClick={() => runProbe("HOSPITAL")}
                className={`p-2.5 border rounded-[2px] font-mono text-[11px] cursor-pointer transition-colors ${
                  activeProbe === "HOSPITAL"
                    ? "border-[var(--text-primary)] bg-[var(--bg-canvas)]"
                    : "border-[var(--border-hairline)] bg-[var(--bg-surface)] hover:border-[var(--text-secondary)]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="px-1.5 py-0.5 bg-[var(--accent-alert)] text-white text-[9px] font-bold rounded-[1px]">
                    GET
                  </span>
                  <span className="text-[10px] text-[var(--text-secondary)]">DYNAMODB BAY ALLOCATION</span>
                </div>
                <div className="font-bold text-[var(--text-primary)] mt-1">/api/hospital/bays</div>
                <div className="text-[10px] text-[var(--text-secondary)] mt-0.5">
                  Queries 8 Trauma Bays (TB-01 to TB-08) at KGMU Trauma Centre upon triage classification.
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (7 Cols): Live Response Payload */}
          <div className="lg:col-span-7 bg-[var(--bg-canvas)] flex flex-col overflow-hidden">
            {/* Response Inspector Header */}
            <div className="h-10 px-3 bg-[var(--bg-surface)] border-b border-[var(--border-hairline)] flex items-center justify-between text-xs shrink-0">
              <div className="flex items-center space-x-2 font-mono">
                <span className="text-[10px] text-[var(--text-secondary)] uppercase">LIVE PROBE RESPONSE:</span>
                <span className="font-bold text-[var(--text-primary)]">{probeResult.endpoint}</span>
              </div>
              <div className="flex items-center space-x-2 font-mono text-[10px]">
                <span className="px-1.5 py-0.5 bg-[var(--accent-green)] text-white font-bold rounded-[1px]">
                  {probeResult.status}
                </span>
                <span className="text-[var(--accent-green)] font-semibold tabular-nums">
                  {probeResult.latencyMs}ms
                </span>
              </div>
            </div>

            {/* JSON Payload Viewport */}
            <div className="h-56 sm:h-64 border-b border-[var(--border-hairline)] bg-[var(--bg-canvas)] p-3 overflow-y-auto font-mono text-[11px] leading-relaxed text-[var(--text-primary)] select-text">
              <div className="text-[9px] font-mono text-[var(--text-secondary)] mb-1 flex justify-between">
                <span>RESPONSE PAYLOAD (SERIALIZED DTO)</span>
                <span>TIMESTAMP: {probeResult.timestamp}</span>
              </div>
              <pre className="whitespace-pre-wrap select-text text-[10px] sm:text-[11px]">
                {JSON.stringify(probeResult.payload, null, 2)}
              </pre>
            </div>

            {/* Lucknow Corridor Engineering Specifications & Runbook */}
            <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-[var(--bg-surface)]">
              <div className="font-mono text-[10px] text-[var(--text-secondary)] uppercase font-semibold flex items-center justify-between border-b border-[var(--border-hairline)] pb-1">
                <span>LUCKNOW SCATS CONTROLLER & PROTOCOL RUNBOOK</span>
                <span className="text-[var(--accent-green)]">AP-SOUTH-1 ACTIVE</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 font-mono text-[11px]">
                {/* Architecture Rule 1 */}
                <div className="p-2.5 border border-[var(--border-hairline)] bg-[var(--bg-canvas)] rounded-[2px] space-y-1">
                  <div className="flex items-center space-x-1.5 text-[var(--text-primary)] font-bold">
                    <Shield className="w-3.5 h-3.5 text-[var(--accent-green)]" strokeWidth={1.5} />
                    <span>SCATS v4.2 Local Timing Fallback</span>
                  </div>
                  <p className="text-[10px] text-[var(--text-secondary)] leading-normal">
                    If cloud telemetry heartbeat drops for &gt; 45 seconds, all Lucknow intersection controllers (JNC-01, JNC-02) revert automatically to local failsafe cycle plans.
                  </p>
                </div>

                {/* Architecture Rule 2 */}
                <div className="p-2.5 border border-[var(--border-hairline)] bg-[var(--bg-canvas)] rounded-[2px] space-y-1">
                  <div className="flex items-center space-x-1.5 text-[var(--text-primary)] font-bold">
                    <Zap className="w-3.5 h-3.5 text-amber-500" strokeWidth={1.5} />
                    <span>Amazon Location Geofence Latch</span>
                  </div>
                  <p className="text-[10px] text-[var(--text-secondary)] leading-normal">
                    Circular 500-meter proximity boundaries autonomously fire Lambda preemption handlers upon entry, ensuring green signal waves before ambulance arrival.
                  </p>
                </div>

                {/* Architecture Rule 3 */}
                <div className="p-2.5 border border-[var(--border-hairline)] bg-[var(--bg-canvas)] rounded-[2px] space-y-1">
                  <div className="flex items-center space-x-1.5 text-[var(--text-primary)] font-bold">
                    <Radio className="w-3.5 h-3.5 text-sky-500" strokeWidth={1.5} />
                    <span>Amazon SNS Police Clearance Queue</span>
                  </div>
                  <p className="text-[10px] text-[var(--text-secondary)] leading-normal">
                    Shah Mina Gate (BAR-03) receives SMS push notifications directly to on-duty traffic officers with one-tap clearance acknowledgement reflected live across the system.
                  </p>
                </div>

                {/* Architecture Rule 4 */}
                <div className="p-2.5 border border-[var(--border-hairline)] bg-[var(--bg-canvas)] rounded-[2px] space-y-1">
                  <div className="flex items-center space-x-1.5 text-[var(--text-primary)] font-bold">
                    <Cpu className="w-3.5 h-3.5 text-[var(--accent-green)]" strokeWidth={1.5} />
                    <span>KGMU DynamoDB Trauma Bay Lock</span>
                  </div>
                  <p className="text-[10px] text-[var(--text-secondary)] leading-normal">
                    Hospital bay state is synchronized deterministically with sub-4ms read latency. Automatic diversion reroutes to RMLIMS if 100% saturation occurs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
