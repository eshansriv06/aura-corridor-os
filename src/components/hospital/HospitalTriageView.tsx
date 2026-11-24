"use client";

import React from "react";
import { AmbulanceIntakeStrip } from "./AmbulanceIntakeStrip";
import { TraumaBayMatrix } from "./TraumaBayMatrix";
import { HospitalDiversionTable } from "./HospitalDiversionTable";

export function HospitalTriageView() {
  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[var(--bg-canvas)]">
      {/* Incoming Ambulance Intake Strip */}
      <AmbulanceIntakeStrip />

      {/* Live Trauma Bay & Ventilator Matrix */}
      <TraumaBayMatrix />

      {/* Dynamic Hospital Diversion & Network Comparison Table */}
      <HospitalDiversionTable />
    </div>
  );
}
