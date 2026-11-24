"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  Radio,
  Building2,
  CloudCog,
} from "lucide-react";

interface NavItem {
  code: string;
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}

const NAV_ITEMS: NavItem[] = [
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

export function NavigationRail() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Vertical Icon-and-Code Rail (>= 1024px) - 64px width */}
      <aside className="hidden lg:flex flex-col w-16 border-r border-[var(--border-hairline)] bg-[var(--bg-surface)] shrink-0 select-none justify-between z-30">
        <div className="flex flex-col items-center py-2 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.path ||
              (item.path === "/hud" && (pathname === "/" || pathname === "/hud")) ||
              (item.path === "/telemetry" && (pathname === "/aws" || pathname === "/telemetry"));
            const Icon = item.icon;

            return (
              <Link
                key={item.code}
                href={item.path}
                className={`w-14 h-14 flex flex-col items-center justify-center rounded-[2px] transition-colors border ${
                  isActive
                    ? "bg-[var(--bg-canvas)] border-[var(--text-primary)] text-[var(--text-primary)] font-semibold"
                    : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hairline)]"
                }`}
                title={item.label}
              >
                <Icon className="w-5 h-5 mb-1" strokeWidth={1.5} />
                <span className="text-[9px] font-mono tracking-tight font-medium">
                  {item.code}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Bottom hardware status node */}
        <div className="p-2 border-t border-[var(--border-hairline)] text-center">
          <div className="text-[8px] font-mono text-[var(--text-secondary)] uppercase leading-tight">
            STATUS
          </div>
          <div className="text-[9px] font-mono text-[var(--accent-green)] font-bold">
            ONLINE
          </div>
        </div>
      </aside>

      {/* Mobile / Tablet Fixed Bottom Thumb-Dock (< 1024px) - 56px height */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-14 bg-[var(--bg-surface)] border-t border-[var(--border-hairline)] z-50 flex items-center justify-around px-1 select-none">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.path ||
            (item.path === "/hud" && (pathname === "/" || pathname === "/hud")) ||
            (item.path === "/telemetry" && (pathname === "/aws" || pathname === "/telemetry"));
          const Icon = item.icon;

          return (
            <Link
              key={item.code}
              href={item.path}
              className={`flex-1 h-12 flex flex-col items-center justify-center rounded-[2px] transition-colors border ${
                isActive
                  ? "bg-[var(--bg-canvas)] border-[var(--text-primary)] text-[var(--text-primary)] font-semibold"
                  : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" strokeWidth={1.5} />
              <span className="text-[9px] font-mono tracking-tight font-medium">
                {item.code}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
