"use client";

import React from "react";
import { AwsArchitectureDiagram } from "./AwsArchitectureDiagram";
import { TerminalStream } from "./TerminalStream";
import { GoldenHourComparisonTable } from "./GoldenHourComparisonTable";

export function TelemetryInspectorView() {
  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[var(--bg-canvas)]">
      {/* 6-Node AWS Architecture Diagram */}
      <AwsArchitectureDiagram />

      {/* Live Tabular AWS Event Stream Terminal */}
      <TerminalStream />

      {/* Golden Hour Transit Performance Comparison Table */}
      <GoldenHourComparisonTable />
    </div>
  );
}
