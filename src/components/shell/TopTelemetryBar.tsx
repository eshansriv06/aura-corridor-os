"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { useAura } from "@/context/AuraContext";
import { VariableFontHover } from "@/components/ui/variable-font-hover";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Compass,
  Radio,
  Building2,
  CloudCog,
  Sun,
  Moon,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";

interface NavItem {
  code: string;
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}

const TOP_NAV_ITEMS: NavItem[] = [
  {
    code: "HUD",
    label: "Paramedic HUD",
    path: "/hud",
    icon: Compass,
  },
  {
    code: "CMD",
    label: "Police Command",
    path: "/command",
    icon: Radio,
  },
  {
    code: "HOSP",
    label: "Hospital Triage",
    path: "/hospital",
    icon: Building2,
  },
  {
    code: "AWS",
    label: "AWS Inspector",
    path: "/telemetry",
    icon: CloudCog,
  },
];

export function TopTelemetryBar() {
  const pathname = usePathname();
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const {
    theme,
    toggleTheme,
    isSimulating,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    currentTimeString,
    backendConnected,
    backendLatencyMs,
  } = useAura();

  return (
    <header className="w-full border-b border-[var(--border-hairline)] bg-[var(--bg-surface)] select-none shrink-0 z-40">
      {/* Primary Top Bar (48px height) with Relative Positioning for Center-Aligned Nav */}
      <div className="h-12 w-full px-3 md:px-5 flex items-center justify-between text-xs relative">
        {/* Left: Back Button to Landing Page + Brand & Corridor OS Tag */}
        <div className="flex items-center space-x-2 sm:space-x-2.5 shrink-0 z-10">
          <Link
            href="/landing"
            className="flex items-center space-x-1.5 px-2 sm:px-2.5 py-1 border border-[var(--border-hairline)] bg-[var(--bg-canvas)] hover:bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--text-primary)] rounded-[2px] font-mono text-[10px] sm:text-[11px] transition-all cursor-pointer group shadow-none"
            title="Back to Aura Landing Page"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-transform group-hover:-translate-x-0.5" />
            <span className="font-semibold tracking-wide hidden sm:inline">BACK TO LANDING</span>
            <span className="font-semibold tracking-wide sm:hidden">LANDING</span>
          </Link>

          <Link href="/hud" className="hidden md:flex items-center space-x-2 hover:opacity-90 transition-opacity">
            <div className="w-2.5 h-2.5 bg-[var(--accent-green)] rounded-[1px] animate-pulse" />
            <span className="font-bold tracking-wider text-[var(--text-primary)] font-mono text-xs sm:text-sm">
              AURA <span className="text-[var(--text-secondary)] font-normal text-xs">// CORRIDOR OS</span>
            </span>
          </Link>

          {/* Synthetic Database & Backend Live Badge */}
          <Link
            href="/java-backend"
            className="hidden lg:flex items-center space-x-1.5 px-2 py-0.5 border border-[var(--border-hairline)] bg-[var(--bg-canvas)] rounded-[2px] font-mono text-[10px] hover:border-[var(--text-secondary)] transition-colors"
            title="Inspect Synthetic Database & Backend API Engine"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${backendConnected ? "bg-[var(--accent-green)]" : "bg-[var(--accent-alert)]"}`} />
            <span className="text-[var(--text-primary)] font-medium">BACKEND LIVE</span>
            <span className="text-[var(--text-secondary)]">• SYNTHETIC DB {backendLatencyMs}ms</span>
          </Link>
        </div>

        {/* Center: Flawlessly Centered Desktop Navigation Bar (>= 768px) */}
        <nav className="hidden md:flex items-center space-x-1 absolute left-1/2 -translate-x-1/2 bg-[var(--bg-canvas)] p-1 border border-[var(--border-hairline)] rounded-[2px] z-10">
          {TOP_NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.path ||
              (item.path === "/hud" && (pathname === "/" || pathname === "/hud")) ||
              (item.path === "/telemetry" && (pathname === "/aws" || pathname === "/telemetry"));
            const isHovered = hoveredNav === item.code;
            const Icon = item.icon;

            return (
              <Link
                key={item.code}
                href={item.path}
                onMouseEnter={() => setHoveredNav(item.code)}
                onMouseLeave={() => setHoveredNav(null)}
                className={cn(
                  "px-3 py-1 flex items-center space-x-2 rounded-[2px] transition-all border text-xs cursor-pointer whitespace-nowrap",
                  isActive
                    ? "bg-[var(--bg-surface)] border-[var(--text-primary)] text-[var(--text-primary)] font-bold shadow-none"
                    : isHovered
                    ? "bg-[var(--bg-surface)] border-[var(--border-hairline)] text-[var(--text-primary)]"
                    : "border-transparent text-[var(--text-secondary)]"
                )}
                title={item.label}
              >
                <motion.span
                  className="inline-flex items-center justify-center shrink-0"
                  animate={{
                    scale: isHovered ? 1.2 : 1,
                    y: isHovered ? -1.5 : 0,
                  }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  <Icon
                    className={cn(
                      "w-3.5 h-3.5 transition-colors",
                      isActive || isHovered ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"
                    )}
                    strokeWidth={isHovered ? 2 : 1.5}
                  />
                </motion.span>
                <VariableFontHover
                  label={item.code}
                  fromFontVariationSettings="'wght' 400"
                  toFontVariationSettings="'wght' 800"
                  staggerDuration={0.03}
                  staggerFrom="center"
                  isHovered={isHovered}
                  className={cn(
                    "text-xs transition-colors",
                    isActive ? "font-bold text-[var(--text-primary)]" : "text-[var(--text-secondary)]"
                  )}
                />
              </Link>
            );
          })}
        </nav>

        {/* Right: Master "SIMULATE RUN" + Real-time Clock + Theme Toggle */}
        <div className="flex items-center space-x-2 sm:space-x-2.5 md:space-x-3 shrink-0 z-10">
          {/* Real-time Clock */}
          <div className="font-mono text-[11px] tabular-nums text-[var(--text-secondary)] px-2 py-0.5 border border-[var(--border-hairline)] bg-[var(--bg-canvas)] rounded-[2px] hidden sm:block">
            <span className="text-[9px] uppercase text-[var(--text-secondary)] mr-1">IST</span>
            {currentTimeString}
          </div>

          {/* Master Mechanical SIMULATE RUN Button */}
          <div className="flex items-center border border-[var(--border-hairline)] rounded-[2px] overflow-hidden">
            <button
              type="button"
              onClick={isSimulating ? pauseSimulation : startSimulation}
              className={`px-2.5 sm:px-3 py-1 text-[11px] font-semibold tracking-wide flex items-center space-x-1.5 transition-colors cursor-pointer ${
                isSimulating
                  ? "bg-[var(--accent-alert)] text-white"
                  : "bg-[var(--accent-green)] text-white hover:opacity-90"
              }`}
            >
              {isSimulating ? (
                <>
                  <Pause className="w-3 h-3" strokeWidth={1.5} />
                  <span>PAUSE RUN</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 fill-current" strokeWidth={1.5} />
                  <span>SIMULATE RUN</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={resetSimulation}
              title="Reset Corridor Run"
              className="px-2 py-1 bg-[var(--bg-canvas)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-l border-[var(--border-hairline)] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" strokeWidth={1.5} />
            </button>
          </div>

          {/* Zero-flicker Tactile Theme Switcher */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme daylight or dark"
            className="p-1.5 border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-[var(--text-primary)] hover:border-[var(--text-secondary)] rounded-[2px] transition-colors cursor-pointer flex items-center space-x-1"
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" strokeWidth={1.5} />
                <span className="text-[10px] font-mono hidden xl:inline">DAY</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-sky-600" strokeWidth={1.5} />
                <span className="text-[10px] font-mono hidden xl:inline">DARK</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Secondary Top Navigation Bar on Mobile (< 768px) */}
      <nav className="md:hidden w-full h-10 border-t border-[var(--border-hairline)] bg-[var(--bg-canvas)] grid grid-cols-4 divide-x divide-[var(--border-hairline)] text-xs">
        {TOP_NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.path ||
            (item.path === "/hud" && (pathname === "/" || pathname === "/hud")) ||
            (item.path === "/telemetry" && (pathname === "/aws" || pathname === "/telemetry"));
          const isHovered = hoveredNav === item.code;
          const Icon = item.icon;

          return (
            <Link
              key={item.code}
              href={item.path}
              onMouseEnter={() => setHoveredNav(item.code)}
              onMouseLeave={() => setHoveredNav(null)}
              className={cn(
                "flex items-center justify-center space-x-1.5 text-center transition-colors cursor-pointer",
                isActive
                  ? "bg-[var(--bg-surface)] text-[var(--text-primary)] font-bold border-b-2 border-[var(--text-primary)]"
                  : isHovered
                  ? "bg-[var(--bg-surface)] text-[var(--text-primary)]"
                  : "text-[var(--text-secondary)]"
              )}
            >
              <motion.span
                className="inline-flex items-center justify-center shrink-0"
                animate={{
                  scale: isHovered ? 1.2 : 1,
                  y: isHovered ? -1 : 0,
                }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                <Icon
                  className={cn(
                    "w-3.5 h-3.5 shrink-0 transition-colors",
                    isActive || isHovered ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"
                  )}
                  strokeWidth={isHovered ? 2 : 1.5}
                />
              </motion.span>
              <VariableFontHover
                label={item.code}
                fromFontVariationSettings="'wght' 400"
                toFontVariationSettings="'wght' 800"
                staggerDuration={0.03}
                staggerFrom="center"
                isHovered={isHovered}
                className="text-[11px] tracking-tight"
              />
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
