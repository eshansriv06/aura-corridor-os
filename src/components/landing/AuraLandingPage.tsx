"use client";

import React from "react";
import AstroAssociationTemplate, {
  AstroPalette,
} from "@/components/ui/astro-association-template";
import { useRouter } from "next/navigation";

export function AuraLandingPage() {
  const router = useRouter();

  // Aura Industrial Utility Palette:
  // Ground: #0D0F12 (Matte control room dark)
  // Accent: #00C853 (Signal preemption green)
  // Frame: #16191E (Flat hardware chassis)
  // Bubble telemetry colors: deep slate, signal green, warning amber, alert red, crisp white
  const auraPalette: AstroPalette = {
    name: "Aura Control Room",
    accent: "#00C853",
    frame: "#16191E",
    colors: [
      "#0D0F12", // Base ground
      "#00C853", // Force Green Corridor
      "#16191E", // Surface Panel
      "#FF3B30", // Alert Red
      "#00E676", // Bright Telemetry Green
      "#1F232B", // Elevated Surface
      "#F59E0B", // Warning Barricade Amber
      "#2A2F38", // Hairline Border
      "#52565E", // Secondary Text
      "#8B929E", // Muted Telemetry
      "#F2F4F7", // High-Contrast Primary
    ],
  };

  return (
    <main className="w-full min-h-screen bg-[#0D0F12]">
      <AstroAssociationTemplate
        brand="AURA."
        seed={2026}
        defaultTheme="dark"
        palette={auraPalette}
        paletteSwitcher={false}
        fonts={{
          display: "var(--font-ibm-sans), -apple-system, BlinkMacSystemFont, sans-serif",
          body: "var(--font-ibm-sans), -apple-system, BlinkMacSystemFont, sans-serif",
          mono: "var(--font-ibm-mono), monospace",
        }}
        nav={[
          { label: "MISSION", target: "mission" },
          { label: "PIPELINE", target: "projects" },
          { label: "RUNS", target: "nights" },
          { label: "CREDENTIAL", target: "join" },
          { label: "HUD", target: "/hud" },
          { label: "CMD", target: "/command" },
          { label: "HOSP", target: "/hospital" },
        ]}
        hero={{
          wordmark: "Aura",
          issue: "OS v1.0",
          title: "AURA.\nCORRIDOR",
          blurb:
            "Automated emergency green corridor and triage platform. Synchronizing Lucknow arterial traffic signals, AWS IoT Core MQTT telemetry, and KGMU emergency trauma bay locks in sub-85ms latency.",
          credit: "AURA // CORRIDOR OS : Automated Emergency Preemption Platform",
          primaryCta: "Launch In-Vehicle HUD",
          secondaryCta: "Command Center Grid",
          hint: "Click bubbles to simulate emergency preemption wave.",
        }}
        mission={{
          bandTitle: "AURA.\nCORRIDOR OS",
          kicker: "LUCKNOW MUNICIPAL TRANSIT PREEMPTION",
          meta: [
            "Aura Corridor OS",
            "Hazratganj to KGMU Route",
            "AWS ap-south-1 Serverless",
          ],
          title: "Sub-85ms emergency preemption across urban arterial corridors.",
          body:
            "When critical polytrauma strikes, every second compounds survival. Aura synchronizes physical roadside SCATS traffic controllers, AWS IoT Core telemetry, and hospital trauma bay locks before the ambulance arrives.",
          stats: [
            { value: "85ms", label: "End-to-end latency" },
            { value: "4.6km", label: "Corridor arterial" },
            { value: "4", label: "Preempted junctions" },
            { value: "+04:15", label: "Time saved per run" },
          ],
        }}
        projectsCopy={{
          title: "AURA\nCORRIDOR",
          issue: "UP32",
          ribbonText: "AURA // EMERGENCY PREEMPTION PIPELINE",
          body:
            "Active emergency corridor missions, IoT shadow telemetry, and surgical bay reservation tracking.",
          heading: "Active corridor operations and hardware integrations.",
        }}
        projects={[
          {
            code: "JNC-01",
            title: "Hazratganj Traffic Preemption",
            summary: "Automated force-green signal override at Atal Chowk.",
            detail:
              "AWS IoT Core Device Shadow overrides municipal 120s timer cycle upon 500m geofence breach.",
            status: "ongoing",
            progress: 0.94,
            goal: "94% successful wave triggers",
            cta: "Inspect Junction",
          },
          {
            code: "BAR-03",
            title: "Shah Mina Road Barricade",
            summary: "Amazon SNS SMS dispatch to on-duty division officers.",
            detail:
              "Notifies Constable R. Verma 600 meters in advance with one-tap digital clearance acknowledgement.",
            status: "ongoing",
            progress: 1.0,
            goal: "100% road clearance verified",
            cta: "View Gate Log",
          },
          {
            code: "DST-04",
            title: "KGMU Trauma Bay Lock",
            summary: "DynamoDB conditional bed allocation for incoming unit.",
            detail:
              "Locks Trauma Bay 01 (TB-01) with ventilator and 15 LPM oxygen readied for critical polytrauma.",
            status: "open",
            progress: 0.88,
            goal: "Sub-4ms DynamoDB sync",
            cta: "Hospital Desk",
          },
        ]}
        showSky={false}
        nightsTag="OPERATIONAL RUNS"
        nightsMeta={[
          "LUCKNOW ARTERIAL PREEMPTION",
          "HAZRATGANJ TO KGMU ROUTE",
          "REAL-TIME DISPATCH LOG",
        ]}
        nightsTitle="Corridor runs and telemetry schedule."
        nights={[
          {
            date: "2026-11-24",
            time: "01:30",
            title: "Corridor Run: AMB-UP32-108",
            place: "Hazratganj to KGMU",
            kind: "Active Run",
            target: "KGMU Trauma Centre",
            seats: 1,
            going: 1,
            cta: "Track Run",
          },
          {
            date: "2026-11-24",
            time: "02:15",
            title: "SCATS Controller Cycle Health Audit",
            place: "Kaiserbagh Chauraha",
            kind: "Telemetry",
            target: "JNC-02 Controller",
            seats: 4,
            going: 4,
            cta: "Inspect Signal",
          },
          {
            date: "2026-11-24",
            time: "03:00",
            title: "Shah Mina Barricade Radio Check",
            place: "Shah Mina Gate",
            kind: "Police SNS",
            target: "Gate BAR-03",
            seats: 2,
            going: 2,
            cta: "View Gate",
          },
          {
            date: "2026-11-24",
            time: "04:30",
            title: "Trauma Bay Capacity Synchronization",
            place: "KGMU Chowk",
            kind: "Hospital",
            target: "Bays TB-01 to TB-08",
            seats: 8,
            going: 8,
            cta: "Hospital Desk",
          },
        ]}
        tiers={[
          {
            name: "Paramedic HUD",
            price: "01",
            period: "HUD",
            blurb: "Glove-friendly tablet cockpit for emergency paramedics.",
            perks: [
              "Real-Time Tabular GPS & Speed",
              "Deterministic Junction Track",
              "Triage Severity Selector",
              "One-Tap Green Corridor Latch",
            ],
          },
          {
            name: "Police Command",
            price: "02",
            period: "CMD",
            blurb: "Municipal traffic headquarters surveillance and dispatch desk.",
            perks: [
              "12-Column Surveillance Grid",
              "Manual SCATS Signal Overrides",
              "Barricade Clearance Ack",
              "Live Operational Dispatch Feed",
            ],
            featured: true,
          },
          {
            name: "Hospital Triage",
            price: "03",
            period: "HOSP",
            blurb: "KGMU Trauma Centre acute bay management console.",
            perks: [
              "8 Dedicated Emergency Bays",
              "Pre-Arrival Paramedic Vitals",
              "Automated RMLIMS Diversion",
              "Surgical Team Briefing Desk",
            ],
          },
        ]}
        join={{
          tag: "OPERATOR CREDENTIAL",
          title: "Issue operational dispatcher credential.",
          body:
            "Register for authenticated access to the Aura Emergency Corridor OS dispatch console and live telemetry stream.",
          namePlaceholder: "Officer / Paramedic Name",
          emailPlaceholder: "badge-id@traffic.up.gov.in",
          button: "Issue Operator Credential",
          success: "Operator credential issued for {name}. Terminal online.",
        }}
        navCta="LAUNCH HUD"
        onNavCta={() => router.push("/hud")}
        onPrimaryCta={() => router.push("/hud")}
        onSecondaryCta={() => router.push("/command")}
        footer={{
          bandTitle: "AURA.\nCORRIDOR OS",
          tagline: "MISSION CRITICAL. ZERO LATENCY. EVERY SECOND COUNTS.",
          credit: "AURA : AUTOMATED EMERGENCY GREEN CORRIDOR & TRIAGE PLATFORM",
          links: [
            { label: "Paramedic HUD", href: "/hud" },
            { label: "Police Command", href: "/command" },
            { label: "Hospital Triage", href: "/hospital" },
            { label: "AWS Inspector", href: "/telemetry" },
            { label: "Synthetic DB", href: "/java-backend" },
            { label: "Privacy Policy", href: "/privacy" },
            { label: "Terms of Service", href: "/terms" },
          ],
        }}
        onPop={(n) => {
          if (n % 5 === 0) {
            console.log("Telemetry bubble burst count:", n);
          }
        }}
        onContribute={(p) => {
          if (p.code === "JNC-01" || p.code === "BAR-03") {
            router.push("/command");
          } else {
            router.push("/hospital");
          }
        }}
        onRsvp={(night) => {
          if (night.kind === "Active Run") {
            router.push("/hud");
          } else {
            router.push("/command");
          }
        }}
        onJoin={async (member) => {
          console.log("Operator enrolled:", member);
          await new Promise((r) => setTimeout(r, 600));
        }}
      />
    </main>
  );
}
