# Aura // Corridor OS : Automated Emergency Green Corridor & Triage Platform

A mission-critical emergency transit preemption and hospital triage platform. Aura synchronizes physical roadside SCATS traffic controllers, AWS IoT Core MQTT telemetry, and hospital trauma bay reservation locks in sub-85ms latency across urban arterial corridors.

Built for the Lucknow municipal transit corridor (Hazratganj to King George's Medical University Trauma Centre).

---

## Key Modules & Cockpits

### 1. Paramedic In-Vehicle HUD (`/hud`)
- Glove-friendly tablet cockpit designed for emergency ambulance paramedics.
- High-contrast tactical navigation with real-time speed, dynamic ETA calculation, and deterministic junction distance tracking.
- One-tap green corridor preemption latch with visual countdown and siren wave trigger.
- In-transit patient vitals telemetry logger (heart rate, SpO2, blood pressure, Glasgow Coma Scale).

### 2. Police Command & Dispatch Grid (`/command`)
- 12-column surveillance and junction override desk for municipal traffic headquarters.
- SCATS signal preemption indicators across Hazratganj (JNC-01), Kaiserbagh (JNC-02), Medical College Crossing (JNC-03), and KGMU Gate 2 (JNC-04).
- Police barricade clearance confirmation and dispatch incident log.

### 3. Hospital ER Reception & Trauma Bay Desk (`/hospital`)
- Acute trauma management console for KGMU Trauma Centre.
- Real-time status for 8 dedicated emergency resuscitation bays (TB-01 to TB-08).
- Pre-arrival paramedic vitals streaming, ventilator reservations, and surgical team briefing locks.
- Automated secondary hospital diversion protocols.

### 4. AWS Cloud Architecture (`/aws`)
- Interactive architecture blueprint of serverless infrastructure deployed on AWS `ap-south-1` (Mumbai).
- Live message flow and security matrix covering:
  - **AWS IoT Core**: Sub-85ms MQTT broker with TLS 1.3 mutual auth for roadside SCATS controllers and vehicle telematics.
  - **DynamoDB**: Sub-4ms single-digit millisecond state management for active corridors and bay locks with ACID transactions.
  - **API Gateway & Lambda**: Zero-maintenance serverless execution for dispatch ingestion and webhook handlers.
  - **Amazon Timestream**: Time-series store for continuous 10Hz vehicle telemetry and sensor telemetry.
  - **Amazon SNS**: Instant emergency SMS dispatch to on-duty police division barricade constables.
  - **Amazon EventBridge**: Decoupled event routing bus distributing corridor latch events.
  - **AWS KMS & CloudWatch**: Envelope encryption for patient vitals with 24/7 audit compliance.

### 5. Synthetic Database & REST API Engine (`/java-backend`, `/api/*`)
- In-memory ACID datastore with thread-safe atomic updates and auto-seed resilience.
- Complete set of REST endpoints:
  - `GET /api/database`: Full datastore snapshot (corridors, telemetry, signals, trauma bays, audit logs).
  - `POST /api/corridor/latch`: Atomic corridor preemption trigger.
  - `POST /api/corridor/simulate-step`: Stepwise vehicle movement and junction advance.
  - `POST /api/corridor/triage`: Severity categorization and bed locks.
  - `GET /api/signals`: SCATS signal junction states.
  - `GET /api/hospital/bays`: Real-time trauma bay availability.
  - `GET /api/telemetry/vitals`: Live biometric vitals telemetry stream.

### 6. Interactive Landing Page (`/landing`)
- High-contrast industrial utility landing page presenting the Aura platform, operational pipeline, active run schedules, and dispatcher credential generation.
- Dedicated standalone layout with quick navigation back to control room cockpits.

---

## Real-Road Navigation Corridor

The simulation traces 133 high-resolution road coordinates along Lucknow's authentic medical transit corridor:
1. **Hazratganj Atal Chowk (JNC-01)**: Origin point on Mahatma Gandhi Marg.
2. **Parivartan Chowk**: Transit curve connecting central arterial to northern bypass.
3. **Kaiserbagh Chauraha (JNC-02)**: High-density intersection preemption.
4. **The Residency Perimeter**: Western historical road bypass.
5. **Medical College Crossing (JNC-03)**: Pre-hospital junction clearance.
6. **Shah Mina Road Gate (BAR-03)**: Police barricade manual clearance point.
7. **KGMU Trauma Centre Gate 2 (JNC-04)**: Emergency resuscitation bay drop-off.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router with Turbopack)
- **UI & Components**: React 19, Tailwind CSS, Lucide Icons, Shadcn component structure
- **Animations & Interaction**: Motion (Framer Motion)
- **State Management**: React Context (`AuraContext`) with synthetic backend sync
- **Language**: TypeScript

---

## Local Development

```powershell
# Install dependencies
npm install

# Run development server with fast refresh
npm run dev

# Build production assets
npm run build

# Start production server
npm start
```

Default local URL: `http://localhost:3000`
Landing Page URL: `http://localhost:3000/landing`
