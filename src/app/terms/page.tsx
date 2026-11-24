import React from "react";
import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full font-sans text-xs">
      <div className="mb-6 flex items-center justify-between border-b border-[var(--border-hairline)] pb-4">
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-[var(--accent-green)]" strokeWidth={1.5} />
          <h1 className="font-mono text-sm md:text-base font-bold uppercase tracking-wider text-[var(--text-primary)]">
            AURA CORRIDOR OS // TERMS & CONDITIONS
          </h1>
        </div>
        <Link
          href="/command"
          className="flex items-center space-x-1.5 px-3 py-1 font-mono text-[11px] border border-[var(--border-hairline)] rounded-[2px] bg-[var(--bg-surface)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft className="w-3 h-3" strokeWidth={1.5} />
          <span>BACK TO CONSOLE</span>
        </Link>
      </div>

      <div className="space-y-6 text-[var(--text-secondary)] leading-relaxed operational-copy">
        <section className="space-y-2 border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-4 rounded-[2px]">
          <h2 className="font-mono text-xs font-bold text-[var(--text-primary)] uppercase">
            1. Operational Authorization
          </h2>
          <p>
            The Aura Corridor OS terminal is strictly authorized for certified paramedic operators, Uttar Pradesh Traffic Police dispatchers, and KGMU Trauma Centre admissions personnel. Unauthorized transmission of traffic override or bay reservation requests is prohibited under applicable municipal law.
          </p>
        </section>

        <section className="space-y-2 border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-4 rounded-[2px]">
          <h2 className="font-mono text-xs font-bold text-[var(--text-primary)] uppercase">
            2. Green Corridor Signal Preemption Rules
          </h2>
          <p>
            Signal preemption via AWS IoT Thing Shadows is autonomous upon geofence entry (500 meters) under active green corridor latch. Police desk operators retain immediate physical override authority through the MANUAL HOLD toggle in emergency situations where cross-arterial public safety requires priority.
          </p>
        </section>

        <section className="space-y-2 border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-4 rounded-[2px]">
          <h2 className="font-mono text-xs font-bold text-[var(--text-primary)] uppercase">
            3. Hospital Bay Allocation and Diversion Protocol
          </h2>
          <p>
            DynamoDB state synchronization enforces deterministic reservation of trauma bays. In the event of 100% capacity saturation across KGMU Trauma Centre bays, the automatic diversion protocol reroutes incoming ambulance units to Dr. Ram Manohar Lohia Institute of Medical Sciences (RMLIMS, Gomti Nagar) without operator delay.
          </p>
        </section>

        <section className="space-y-2 border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-4 rounded-[2px]">
          <h2 className="font-mono text-xs font-bold text-[var(--text-primary)] uppercase">
            4. Reliability and SLA Standards
          </h2>
          <p>
            The platform is engineered for sub-20ms execution latency on AWS Lambda in region ap-south-1. In the event of network disruption or loss of cloud telemetry, field traffic controllers revert automatically to fail-safe local SCATS timing plans within 45 seconds of keep-alive expiration.
          </p>
        </section>

        <section className="space-y-2 border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-4 rounded-[2px]">
          <h2 className="font-mono text-xs font-bold text-[var(--text-primary)] uppercase">
            5. System Attribution and Academic Disclosure
          </h2>
          <p>
            Platform architecture engineered by Sanket Mishra (B.Tech Computer Science & Engineering). Deployed on AWS Amplify with real-time serverless integration. Academic Year: 2024-2025.
          </p>
        </section>
      </div>
    </div>
  );
}
