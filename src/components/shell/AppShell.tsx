"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AuraProvider } from "@/context/AuraContext";
import { TopTelemetryBar } from "./TopTelemetryBar";
import { AttributionFooter } from "./AttributionFooter";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/landing" || pathname?.startsWith("/landing");

  if (isLandingPage) {
    return (
      <AuraProvider>
        <div className="w-full h-screen overflow-y-auto overflow-x-hidden bg-[#0D0F12] text-[var(--text-primary)]">
          {children}
        </div>
      </AuraProvider>
    );
  }

  return (
    <AuraProvider>
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-[var(--bg-canvas)] text-[var(--text-primary)]">
        {/* Top Navigation & Telemetry Header */}
        <TopTelemetryBar />

        {/* Main Body (Full Width 100% Viewport) */}
        <main className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden relative bg-[var(--bg-canvas)]">
          {children}
        </main>

        {/* System Attribution 36px Strip */}
        <AttributionFooter />
      </div>
    </AuraProvider>
  );
}
