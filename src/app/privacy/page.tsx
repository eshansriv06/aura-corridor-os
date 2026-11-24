import React from "react";
import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full font-sans text-xs">
      <div className="mb-6 flex items-center justify-between border-b border-[var(--border-hairline)] pb-4">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-[var(--accent-green)]" strokeWidth={1.5} />
          <h1 className="font-mono text-sm md:text-base font-bold uppercase tracking-wider text-[var(--text-primary)]">
            AURA CORRIDOR OS // PRIVACY POLICY
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
            1. Scope and Mission Mandate
          </h2>
          <p>
            Aura (Automated Emergency Green Corridor & Triage Platform) operates under the jurisdiction of Emergency Medical Services and municipal traffic management authorities in Lucknow, Uttar Pradesh. This platform processes high-velocity telemetry strictly for real-time vehicular preemption and trauma hospital triage.
          </p>
        </section>

        <section className="space-y-2 border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-4 rounded-[2px]">
          <h2 className="font-mono text-xs font-bold text-[var(--text-primary)] uppercase">
            2. Telemetry and Biometric Processing
          </h2>
          <p>
            Ambulance unit coordinates, velocity vectors, and paramedic triage severity classifications (Vitals: SpO2, Heart Rate, Blood Pressure) are ingested via AWS IoT Core and processed in Amazon DynamoDB. All biometric indicators are anonymized under the Digital Information Security in Healthcare Act (DISHA) and applicable medical data protocols.
          </p>
        </section>

        <section className="space-y-2 border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-4 rounded-[2px]">
          <h2 className="font-mono text-xs font-bold text-[var(--text-primary)] uppercase">
            3. Geofence Surveillance and Traffic Preemption
          </h2>
          <p>
            Amazon Location Service computes circular 500-meter proximity boundaries around municipal intersections (JNC-01 Hazratganj Crossing, JNC-02 Kaiserbagh Chauraha, BAR-03 Shah Mina Road Barricade Gate). Geofence breach events are strictly utilized for SCATS traffic controller override signals and SMS clearance pushes via Amazon SNS. No personal passenger data is logged.
          </p>
        </section>

        <section className="space-y-2 border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-4 rounded-[2px]">
          <h2 className="font-mono text-xs font-bold text-[var(--text-primary)] uppercase">
            4. AWS Cloud Infrastructure Security
          </h2>
          <p>
            All messages transmitted between field emergency units and cloud infrastructure in region ap-south-1 utilize TLS 1.3 mutual authentication (mTLS) with X.509 device certificates. AWS Lambda execution logs persist for 72 hours for forensic latency verification and are purged automatically.
          </p>
        </section>

        <section className="space-y-2 border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-4 rounded-[2px]">
          <h2 className="font-mono text-xs font-bold text-[var(--text-primary)] uppercase">
            5. Supervisory Inquiries
          </h2>
          <p>
            For engineering protocol questions or security inquiries regarding the Lucknow corridor implementation, address communications to the Aura Technical Directorate at KGMU Trauma Centre, Chowk, Lucknow.
          </p>
        </section>
      </div>
    </div>
  );
}
