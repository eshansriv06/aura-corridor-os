"use client";

import React, { useMemo } from "react";
import { useAura } from "@/context/AuraContext";
import { AwsService } from "@/types/aura";
import { Terminal, Pause, Play, Trash2, Filter, Download } from "lucide-react";

const SERVICES_LIST: (AwsService | "ALL")[] = [
  "ALL",
  "AWS IoT Core",
  "Amazon Location",
  "AWS Lambda",
  "Amazon SNS",
  "Amazon DynamoDB",
  "AWS Amplify",
];

export function TerminalStream() {
  const {
    telemetryEvents,
    filterService,
    setFilterService,
    isStreamPaused,
    toggleStreamPause,
    clearTelemetryStream,
  } = useAura();

  const filteredEvents = useMemo(() => {
    if (filterService === "ALL") return telemetryEvents;
    return telemetryEvents.filter((e) => e.service === filterService);
  }, [telemetryEvents, filterService]);

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(telemetryEvents, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `aura_telemetry_stream_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="w-full flex-1 flex flex-col min-h-[360px] bg-[var(--bg-canvas)] border-b border-[var(--border-hairline)] select-none overflow-hidden">
      {/* Terminal Controls Bar */}
      <div className="h-10 px-3 bg-[var(--bg-surface)] border-b border-[var(--border-hairline)] flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center space-x-2">
          <Terminal className="w-3.5 h-3.5 text-[var(--accent-green)]" strokeWidth={1.5} />
          <span className="font-mono text-[10px] text-[var(--text-secondary)] uppercase font-semibold">
            LIVE TABULAR AWS EVENT STREAM TERMINAL
          </span>
          <span className="text-[9px] font-mono px-1.5 py-0.2 bg-[var(--bg-canvas)] border border-[var(--border-hairline)] text-[var(--text-primary)] rounded-[1px]">
            {filteredEvents.length} EVENTS
          </span>
        </div>

        {/* Filter & Playback Buttons */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={toggleStreamPause}
            className={`px-2 py-0.5 border rounded-[1px] font-mono text-[10px] flex items-center space-x-1 cursor-pointer transition-colors ${
              isStreamPaused
                ? "bg-[var(--accent-alert)] text-white border-[var(--accent-alert)]"
                : "border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-[var(--text-primary)] hover:border-[var(--text-secondary)]"
            }`}
          >
            {isStreamPaused ? (
              <>
                <Play className="w-3 h-3 fill-current" strokeWidth={1.5} />
                <span>RESUME</span>
              </>
            ) : (
              <>
                <Pause className="w-3 h-3" strokeWidth={1.5} />
                <span>PAUSE</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={clearTelemetryStream}
            title="Clear Stream"
            className="p-1 border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-[1px] cursor-pointer"
          >
            <Trash2 className="w-3 h-3" strokeWidth={1.5} />
          </button>

          <button
            type="button"
            onClick={handleExport}
            title="Export JSON Logs"
            className="p-1 border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-[1px] cursor-pointer"
          >
            <Download className="w-3 h-3" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Filter by Service Bar */}
      <div className="h-8 px-3 bg-[var(--bg-surface)] border-b border-[var(--border-hairline)] flex items-center space-x-1 overflow-x-auto shrink-0 font-mono text-[10px]">
        <span className="text-[var(--text-secondary)] mr-2 flex items-center space-x-1 shrink-0">
          <Filter className="w-3 h-3" strokeWidth={1.5} />
          <span>FILTER:</span>
        </span>
        {SERVICES_LIST.map((svc) => (
          <button
            key={svc}
            type="button"
            onClick={() => setFilterService(svc)}
            className={`px-2 py-0.5 rounded-[1px] border shrink-0 cursor-pointer ${
              filterService === svc
                ? "bg-[var(--text-primary)] text-[var(--bg-surface)] font-bold border-[var(--text-primary)]"
                : "border-[var(--border-hairline)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-canvas)]"
            }`}
          >
            {svc}
          </button>
        ))}
      </div>

      {/* Terminal Payload Output Stream */}
      <div className="flex-1 p-3 overflow-y-auto font-mono text-[11px] leading-relaxed bg-[var(--bg-canvas)] select-text">
        <div className="space-y-1.5">
          {filteredEvents.map((evt) => {
            const isAlert = evt.status === "ALERT";
            const serviceTagColor =
              evt.service === "AWS IoT Core"
                ? "text-sky-400"
                : evt.service === "Amazon Location"
                ? "text-purple-400"
                : evt.service === "AWS Lambda"
                ? "text-amber-400"
                : evt.service === "Amazon SNS"
                ? "text-pink-400"
                : evt.service === "Amazon DynamoDB"
                ? "text-emerald-400"
                : "text-blue-400";

            return (
              <div
                key={evt.id}
                className="flex items-start space-x-2 py-1 px-1.5 hover:bg-[var(--bg-surface)] rounded-[1px] border-b border-[var(--border-hairline)]/30"
              >
                {/* Timestamp */}
                <span className="text-[var(--text-secondary)] shrink-0 tabular-nums">
                  {evt.timestamp}
                </span>

                {/* Service Tag */}
                <span className={`font-bold shrink-0 ${serviceTagColor}`}>
                  [{evt.service}]
                </span>

                {/* Topic / Action */}
                <span className="text-[var(--text-primary)] font-semibold shrink-0">
                  {evt.topicOrAction} -&gt;
                </span>

                {/* JSON Payload */}
                <span className="text-[var(--text-secondary)] break-all flex-1">
                  {JSON.stringify(evt.payload)}
                </span>

                {/* Latency badge */}
                <span className="text-[10px] text-[var(--accent-green)] shrink-0 tabular-nums font-semibold">
                  {evt.latencyMs}ms
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
