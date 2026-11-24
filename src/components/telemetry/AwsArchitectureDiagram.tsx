"use client";

import React from "react";
import { useAura } from "@/context/AuraContext";
import { AwsService } from "@/types/aura";
import {
  Radio,
  MapPin,
  Zap,
  BellRing,
  Database,
  Cloud,
  ArrowRight,
  ArrowDown,
  CheckCircle2,
} from "lucide-react";

interface NodeSpec {
  service: AwsService;
  code: string;
  role: string;
  metricLabel: string;
  metricValue: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}

const AWS_NODES: NodeSpec[] = [
  {
    service: "AWS IoT Core",
    code: "IOT-01",
    role: "MQTT GPS Ingestion & Force Green",
    metricLabel: "INGESTION LATENCY",
    metricValue: "18 ms",
    icon: Radio,
  },
  {
    service: "Amazon Location",
    code: "LOC-02",
    role: "500m Dynamic Geofence Engine",
    metricLabel: "EVALUATION RATE",
    metricValue: "10 Hz",
    icon: MapPin,
  },
  {
    service: "AWS Lambda",
    code: "LAM-03",
    role: "Serverless Preemption Orchestrator",
    metricLabel: "COLD-FREE EXEC",
    metricValue: "14 ms",
    icon: Zap,
  },
  {
    service: "Amazon SNS",
    code: "SNS-04",
    role: "Sub-Second SMS/Push Barricade Dispatch",
    metricLabel: "DELIVERY TIME",
    metricValue: "220 ms",
    icon: BellRing,
  },
  {
    service: "Amazon DynamoDB",
    code: "DDB-05",
    role: "Millisecond State & Trauma-Bay Capacity",
    metricLabel: "SINGLE-DIGIT GET",
    metricValue: "4.1 ms",
    icon: Database,
  },
  {
    service: "AWS Amplify",
    code: "AMP-06",
    role: "Global Edge Hosting for Command Center",
    metricLabel: "EDGE SSR DIST.",
    metricValue: "12 ms",
    icon: Cloud,
  },
];

export function AwsArchitectureDiagram() {
  const { selectedAwsService, setSelectedAwsService, setFilterService } = useAura();

  const handleSelect = (service: AwsService) => {
    setSelectedAwsService(service);
    setFilterService(service);
  };

  return (
    <div className="w-full bg-[var(--bg-surface)] border-b border-[var(--border-hairline)] p-3 select-none shrink-0">
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-[var(--border-hairline)]">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 bg-[var(--accent-green)] rounded-[1px] animate-pulse" />
          <span className="font-mono text-xs font-bold text-[var(--text-primary)]">
            AWS SERVERLESS EVENT-DRIVEN PIPELINE (AP-SOUTH-1)
          </span>
        </div>
        <div className="text-[10px] font-mono text-[var(--text-secondary)]">
          CLICK ANY SERVICE BLOCK TO INSPECT METRICS & FILTER EVENT STREAM
        </div>
      </div>

      {/* 6-Node Architecture Flow (Desktop Horizontal Flow / Mobile Vertical Stepper) */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-2">
        {AWS_NODES.map((node, index) => {
          const isSelected = selectedAwsService === node.service;
          const Icon = node.icon;

          return (
            <div key={node.service} className="relative flex flex-col">
              <button
                type="button"
                onClick={() => handleSelect(node.service)}
                className={`w-full p-2.5 border rounded-[2px] text-left transition-colors cursor-pointer flex flex-col justify-between h-28 relative ${
                  isSelected
                    ? "border-[var(--text-primary)] bg-[var(--bg-canvas)]"
                    : "border-[var(--border-hairline)] bg-[var(--bg-surface)] hover:border-[var(--text-secondary)]"
                }`}
              >
                {/* Node Header */}
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-1.5">
                    <Icon className="w-3.5 h-3.5 text-[var(--accent-green)]" strokeWidth={1.5} />
                    <span className="font-mono text-[10px] font-bold text-[var(--text-primary)]">
                      {node.code}
                    </span>
                  </div>
                  <span
                    className={`text-[8px] font-mono px-1 py-0.5 rounded-[1px] ${
                      isSelected
                        ? "bg-[var(--text-primary)] text-[var(--bg-surface)] font-bold"
                        : "bg-[var(--bg-canvas)] border border-[var(--border-hairline)] text-[var(--text-secondary)]"
                    }`}
                  >
                    {isSelected ? "ACTIVE" : "INSPECT"}
                  </span>
                </div>

                {/* Service Name & Description */}
                <div>
                  <div className="font-mono text-[11px] font-bold text-[var(--text-primary)] truncate">
                    {node.service}
                  </div>
                  <div className="text-[9px] font-mono text-[var(--text-secondary)] line-clamp-2 leading-tight">
                    {node.role}
                  </div>
                </div>

                {/* Metric Strip */}
                <div className="w-full pt-1 border-t border-[var(--border-hairline)] flex items-center justify-between text-[9px] font-mono">
                  <span className="text-[var(--text-secondary)]">{node.metricLabel}:</span>
                  <span className="font-bold text-[var(--accent-green)] tabular-nums">
                    {node.metricValue}
                  </span>
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
