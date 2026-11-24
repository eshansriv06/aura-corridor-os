// Aura Synthetic Database Engine
// In-memory deterministic persistent store for Aura Corridor OS
// Models Lucknow Emergency Corridor, Ambulance Telemetry, Signals, Hospital Bays, and Dispatch Logs

import {
  Waypoint,
  TraumaBay,
  TriageSeverity,
  PatientVitals,
  AmbulanceUnit,
  BayStatus,
} from "@/types/aura";

export interface SyntheticCorridorRecord {
  id: string;
  status: "ACTIVE" | "STANDBY" | "COMPLETED";
  unitId: string;
  triageSeverity: TriageSeverity;
  currentWaypointIndex: number;
  timeSavedSeconds: number;
  distanceMetersRemaining: number;
  speedKmh: number;
  preemptionMode: string;
  activeGeofenceMeters: number;
  latchedAt: string | null;
  updatedAt: string;
}

export interface SyntheticPatientRecord {
  id: string;
  unitId: string;
  age: number;
  gender: string;
  condition: string;
  severity: TriageSeverity;
  vitals: PatientVitals;
  assignedBayId: string;
  updatedAt: string;
}

export interface SyntheticDispatchLog {
  id: string;
  timestamp: string;
  event: string;
  category: "IOT_CORE" | "LAMBDA" | "DYNAMODB" | "SNS" | "SIGNAL_PREEMPTION";
  status: "SUCCESS" | "WARN" | "INFO";
  latencyMs: number;
  details: string;
}

export interface SyntheticDatabaseSnapshot {
  schemaVersion: string;
  lastSyncedAt: string;
  corridor: SyntheticCorridorRecord;
  ambulance: AmbulanceUnit;
  patient: SyntheticPatientRecord;
  waypoints: Waypoint[];
  traumaBays: TraumaBay[];
  dispatchLogs: SyntheticDispatchLog[];
  stats: {
    totalTables: number;
    totalRecords: number;
    activePreemptions: number;
    dbEngine: string;
  };
}

// Deterministic seed data along Lucknow emergency route
const SEED_WAYPOINTS: Waypoint[] = [
  {
    id: "JNC-01",
    name: "HAZRATGANJ CROSSING",
    shortName: "HAZRATGANJ",
    type: "signal",
    coords: { lat: 26.8467, lng: 80.9462 },
    distanceMetersFromStart: 0,
    status: "FORCE_GREEN",
    controllerState: "FORCE_GREEN",
    geofenceRadiusMeters: 500,
    lambdaRequestId: "req-9884a-ap-south",
    ttlSeconds: 45,
    overrideMode: "AUTO_PREEMPT",
  },
  {
    id: "JNC-02",
    name: "KAISERBAGH CHAURAHA",
    shortName: "KAISERBAGH",
    type: "signal",
    coords: { lat: 26.8552, lng: 80.9324 },
    distanceMetersFromStart: 1800,
    status: "GEOFENCE_500M",
    controllerState: "FORCE_GREEN",
    geofenceRadiusMeters: 500,
    lambdaRequestId: "req-9884b-ap-south",
    ttlSeconds: 60,
    overrideMode: "AUTO_PREEMPT",
  },
  {
    id: "BAR-03",
    name: "SHAH MINA ROAD BARRICADE GATE",
    shortName: "SHAH MINA GATE",
    type: "barricade",
    coords: { lat: 26.8624, lng: 80.9205 },
    distanceMetersFromStart: 3400,
    status: "500M_ALERT",
    controllerState: "RED_HOLD",
    geofenceRadiusMeters: 500,
    overrideMode: "AUTO_PREEMPT",
    barricadeOfficer: "Constable R. Verma (Traffic Police - Div 4)",
    barricadeStatus: "NOTIFIED",
  },
  {
    id: "DST-04",
    name: "KGMU TRAUMA CENTRE, CHOWK",
    shortName: "KGMU TRAUMA",
    type: "destination",
    coords: { lat: 26.8694, lng: 80.9135 },
    distanceMetersFromStart: 4600,
    status: "GEOFENCE_500M",
    controllerState: "FORCE_GREEN",
    geofenceRadiusMeters: 500,
    overrideMode: "AUTO_PREEMPT",
  },
];

const SEED_BAYS: TraumaBay[] = [
  {
    id: "TB-01",
    name: "TRAUMA BAY 01",
    unit: "Trauma Surgery",
    status: "RESERVED",
    reservedForUnit: "AMB-UP32-108",
    ventilatorReady: true,
    oxygenFlowLpm: 15,
    lastSyncedMs: 4.1,
  },
  {
    id: "TB-02",
    name: "TRAUMA BAY 02",
    unit: "Neurosurgery",
    status: "AVAILABLE",
    ventilatorReady: true,
    oxygenFlowLpm: 12,
    lastSyncedMs: 3.8,
  },
  {
    id: "TB-03",
    name: "TRAUMA BAY 03",
    unit: "Critical Care",
    status: "OCCUPIED",
    ventilatorReady: true,
    oxygenFlowLpm: 14,
    lastSyncedMs: 5.2,
  },
  {
    id: "TB-04",
    name: "TRAUMA BAY 04",
    unit: "Emergency Medicine",
    status: "AVAILABLE",
    ventilatorReady: false,
    oxygenFlowLpm: 0,
    lastSyncedMs: 4.0,
  },
  {
    id: "TB-05",
    name: "TRAUMA BAY 05",
    unit: "Emergency Medicine",
    status: "AVAILABLE",
    ventilatorReady: true,
    oxygenFlowLpm: 8,
    lastSyncedMs: 3.9,
  },
  {
    id: "TB-06",
    name: "TRAUMA BAY 06",
    unit: "Critical Care",
    status: "AVAILABLE",
    ventilatorReady: true,
    oxygenFlowLpm: 10,
    lastSyncedMs: 4.5,
  },
  {
    id: "TB-07",
    name: "TRAUMA BAY 07",
    unit: "Trauma Surgery",
    status: "OCCUPIED",
    ventilatorReady: true,
    oxygenFlowLpm: 15,
    lastSyncedMs: 5.0,
  },
  {
    id: "TB-08",
    name: "TRAUMA BAY 08",
    unit: "Critical Care",
    status: "AVAILABLE",
    ventilatorReady: false,
    oxygenFlowLpm: 0,
    lastSyncedMs: 4.2,
  },
];

const SEED_DISPATCH_LOGS: SyntheticDispatchLog[] = [
  {
    id: "LOG-1001",
    timestamp: new Date().toISOString(),
    event: "AWS IoT Core MQTT Ingest",
    category: "IOT_CORE",
    status: "SUCCESS",
    latencyMs: 14,
    details: "Unit AMB-UP32-108 published GPS fix at Hazratganj Crossing (26.8467, 80.9462).",
  },
  {
    id: "LOG-1002",
    timestamp: new Date().toISOString(),
    event: "AWS Lambda Route Preemption",
    category: "LAMBDA",
    status: "SUCCESS",
    latencyMs: 28,
    details: "Function preemption-engine-v1 evaluated corridor latch for JNC-01 Hazratganj.",
  },
  {
    id: "LOG-1003",
    timestamp: new Date().toISOString(),
    event: "Amazon DynamoDB Bay Reservation",
    category: "DYNAMODB",
    status: "SUCCESS",
    latencyMs: 4,
    details: "Partition KGMU-CHOWK: Locked TB-01 for incoming unit AMB-UP32-108.",
  },
];

class SyntheticDatabase {
  private corridor: SyntheticCorridorRecord;
  private ambulance: AmbulanceUnit;
  private patient: SyntheticPatientRecord;
  private waypoints: Waypoint[];
  private traumaBays: TraumaBay[];
  private dispatchLogs: SyntheticDispatchLog[];
  private lastSyncedAt: string;

  constructor() {
    this.lastSyncedAt = new Date().toISOString();
    this.corridor = {
      id: "CORR-UP32-KGMU",
      status: "STANDBY",
      unitId: "AMB-UP32-108",
      triageSeverity: "CRITICAL",
      currentWaypointIndex: 0,
      timeSavedSeconds: 255,
      distanceMetersRemaining: 4600,
      speedKmh: 64,
      preemptionMode: "AWS_LAMBDA_AUTO",
      activeGeofenceMeters: 500,
      latchedAt: null,
      updatedAt: this.lastSyncedAt,
    };

    const initialVitals: PatientVitals = {
      bp: "88/54",
      spo2: 93,
      hr: 104,
      tempF: 98.2,
      triageClass: "CRITICAL : POLYTRAUMA",
      systolic: 88,
      diastolic: 54,
    };

    this.ambulance = {
      unitId: "AMB-UP32-108",
      currentCoords: { lat: 26.8467, lng: 80.9462 },
      currentSpeedKmh: 64,
      mqttStatus: "CONNECTED",
      mqttLatencyMs: 18,
      vitals: initialVitals,
      severity: "CRITICAL",
      assignedHospitalId: "HOSP-KGMU",
      assignedHospitalName: "KGMU Trauma Centre, Chowk",
      assignedBayId: "TB-01",
      etaSeconds: 380,
      corridorLatched: false,
      distanceTraveledMeters: 0,
      totalDistanceMeters: 4600,
    };

    this.patient = {
      id: "PT-2026-881",
      unitId: "AMB-UP32-108",
      age: 48,
      gender: "Male",
      condition: "Polytrauma with severe respiratory distress",
      severity: "CRITICAL",
      vitals: initialVitals,
      assignedBayId: "TB-01",
      updatedAt: this.lastSyncedAt,
    };

    this.waypoints = JSON.parse(JSON.stringify(SEED_WAYPOINTS));
    this.traumaBays = JSON.parse(JSON.stringify(SEED_BAYS));
    this.dispatchLogs = JSON.parse(JSON.stringify(SEED_DISPATCH_LOGS));
  }

  public getSnapshot(): SyntheticDatabaseSnapshot {
    const activePreemptions = this.waypoints.filter(
      (w) => w.status === "FORCE_GREEN" || w.controllerState === "FORCE_GREEN"
    ).length;

    return {
      schemaVersion: "v1.4.0-synthetic-dynamo",
      lastSyncedAt: this.lastSyncedAt,
      corridor: { ...this.corridor },
      ambulance: { ...this.ambulance },
      patient: { ...this.patient },
      waypoints: JSON.parse(JSON.stringify(this.waypoints)),
      traumaBays: JSON.parse(JSON.stringify(this.traumaBays)),
      dispatchLogs: JSON.parse(JSON.stringify(this.dispatchLogs.slice(0, 50))),
      stats: {
        totalTables: 5,
        totalRecords: 1 + 1 + 1 + this.waypoints.length + this.traumaBays.length + this.dispatchLogs.length,
        activePreemptions,
        dbEngine: "Synthetic DynamoDB Memory Engine (ap-south-1)",
      },
    };
  }

  public seed(): SyntheticDatabaseSnapshot {
    this.lastSyncedAt = new Date().toISOString();
    this.corridor = {
      id: "CORR-UP32-KGMU",
      status: "STANDBY",
      unitId: "AMB-UP32-108",
      triageSeverity: "CRITICAL",
      currentWaypointIndex: 0,
      timeSavedSeconds: 255,
      distanceMetersRemaining: 4600,
      speedKmh: 64,
      preemptionMode: "AWS_LAMBDA_AUTO",
      activeGeofenceMeters: 500,
      latchedAt: null,
      updatedAt: this.lastSyncedAt,
    };
    this.ambulance.corridorLatched = false;
    this.ambulance.currentCoords = { lat: 26.8467, lng: 80.9462 };
    this.ambulance.currentSpeedKmh = 64;
    this.ambulance.etaSeconds = 380;
    this.waypoints = JSON.parse(JSON.stringify(SEED_WAYPOINTS));
    this.traumaBays = JSON.parse(JSON.stringify(SEED_BAYS));
    this.dispatchLogs = JSON.parse(JSON.stringify(SEED_DISPATCH_LOGS));
    this.addLog("SYSTEM_SEED", "DYNAMODB", "SUCCESS", 2, "Synthetic database re-seeded to Lucknow route defaults.");
    return this.getSnapshot();
  }

  public latchCorridor(latched: boolean): SyntheticDatabaseSnapshot {
    this.lastSyncedAt = new Date().toISOString();
    this.corridor.status = latched ? "ACTIVE" : "STANDBY";
    this.corridor.latchedAt = latched ? this.lastSyncedAt : null;
    this.corridor.updatedAt = this.lastSyncedAt;
    this.ambulance.corridorLatched = latched;

    if (latched) {
      this.waypoints[0].status = "FORCE_GREEN";
      this.waypoints[0].controllerState = "FORCE_GREEN";
      this.waypoints[1].status = "GEOFENCE_500M";
      this.waypoints[2].status = "500M_ALERT";
      this.waypoints[3].status = "GEOFENCE_500M";

      // Lock Trauma Bay 01
      const bay = this.traumaBays.find((b) => b.id === "TB-01");
      if (bay) {
        bay.status = "RESERVED";
        bay.reservedForUnit = this.ambulance.unitId;
      }

      this.addLog(
        "CORRIDOR_LATCHED",
        "LAMBDA",
        "SUCCESS",
        34,
        `Emergency green corridor latched for ${this.ambulance.unitId}. Automated traffic preempts initialized.`
      );
    } else {
      this.addLog(
        "CORRIDOR_RELEASED",
        "LAMBDA",
        "SUCCESS",
        18,
        `Corridor released. Traffic controllers reverting to municipal timing cycle.`
      );
    }

    return this.getSnapshot();
  }

  public stepSimulation(): SyntheticDatabaseSnapshot {
    this.lastSyncedAt = new Date().toISOString();
    const nextIdx = (this.corridor.currentWaypointIndex + 1) % this.waypoints.length;
    this.corridor.currentWaypointIndex = nextIdx;
    this.corridor.updatedAt = this.lastSyncedAt;

    const targetWaypoint = this.waypoints[nextIdx];
    this.ambulance.currentCoords = { ...targetWaypoint.coords };
    this.corridor.distanceMetersRemaining = Math.max(0, 4600 - targetWaypoint.distanceMetersFromStart);
    this.corridor.timeSavedSeconds += 30;
    this.ambulance.etaSeconds = Math.max(30, Math.round(this.corridor.distanceMetersRemaining / 18));

    // Update waypoint statuses
    this.waypoints.forEach((wp, idx) => {
      if (idx < nextIdx) {
        wp.status = "CLEARED";
        wp.controllerState = "FORCE_GREEN";
      } else if (idx === nextIdx) {
        wp.status = "FORCE_GREEN";
        wp.controllerState = "FORCE_GREEN";
      } else {
        wp.status = "GEOFENCE_500M";
      }
    });

    this.addLog(
      "VEHICLE_ADVANCE",
      "IOT_CORE",
      "SUCCESS",
      16,
      `Ambulance advanced to waypoint [${targetWaypoint.id}] ${targetWaypoint.name}. Coordinates: ${targetWaypoint.coords.lat.toFixed(4)}, ${targetWaypoint.coords.lng.toFixed(4)}.`
    );

    return this.getSnapshot();
  }

  public updateVitals(update: Partial<PatientVitals>): SyntheticDatabaseSnapshot {
    this.lastSyncedAt = new Date().toISOString();
    this.patient.vitals = {
      ...this.patient.vitals,
      ...update,
    };
    this.ambulance.vitals = {
      ...this.ambulance.vitals,
      ...update,
    };
    this.patient.updatedAt = this.lastSyncedAt;
    return this.getSnapshot();
  }

  public setTriageSeverity(severity: TriageSeverity): SyntheticDatabaseSnapshot {
    this.lastSyncedAt = new Date().toISOString();
    this.corridor.triageSeverity = severity;
    this.patient.severity = severity;
    this.ambulance.severity = severity;

    if (severity === "CRITICAL") {
      const bay = this.traumaBays.find((b) => b.id === "TB-01");
      if (bay) {
        bay.status = "RESERVED";
        bay.reservedForUnit = this.ambulance.unitId;
      }
    }

    this.addLog(
      "TRIAGE_UPDATE",
      "DYNAMODB",
      "SUCCESS",
      8,
      `Patient severity set to ${severity}. Routing locked to KGMU Trauma Centre (Chowk).`
    );

    return this.getSnapshot();
  }

  public overrideSignal(signalId: string, overrideMode: "AUTO_PREEMPT" | "MANUAL_HOLD"): SyntheticDatabaseSnapshot {
    this.lastSyncedAt = new Date().toISOString();
    const wp = this.waypoints.find((w) => w.id === signalId);
    if (wp) {
      wp.overrideMode = overrideMode;
      if (overrideMode === "MANUAL_HOLD") {
        wp.status = "RED_HOLD";
        wp.controllerState = "MANUAL_HOLD";
      } else {
        wp.status = "FORCE_GREEN";
        wp.controllerState = "FORCE_GREEN";
      }
      this.addLog(
        "SIGNAL_OVERRIDE",
        "SIGNAL_PREEMPTION",
        "SUCCESS",
        22,
        `Signal [${signalId}] hardware override set to ${overrideMode}.`
      );
    }
    return this.getSnapshot();
  }

  public clearBarricade(barricadeId: string, officerBadge: string): SyntheticDatabaseSnapshot {
    this.lastSyncedAt = new Date().toISOString();
    const wp = this.waypoints.find((w) => w.id === barricadeId);
    if (wp) {
      wp.status = "CLEARED";
      wp.controllerState = "FORCE_GREEN";
      wp.barricadeStatus = "CLEARED";
      this.addLog(
        "BARRICADE_CLEARED",
        "SNS",
        "SUCCESS",
        45,
        `Barricade [${barricadeId}] verified cleared by Officer Badge: ${officerBadge}. Amazon SNS broadcast dispatched.`
      );
    }
    return this.getSnapshot();
  }

  public updateBayStatus(bayId: string, status: string): SyntheticDatabaseSnapshot {
    this.lastSyncedAt = new Date().toISOString();
    const bay = this.traumaBays.find((b) => b.id === bayId);
    if (bay) {
      bay.status = (status as BayStatus) || "AVAILABLE";
      bay.lastSyncedMs = Number((Math.random() * 2 + 3).toFixed(1));
      this.addLog(
        "BAY_SYNC",
        "DYNAMODB",
        "SUCCESS",
        5,
        `DynamoDB table KGMU-CHOWK updated bay ${bayId} status to ${status}.`
      );
    }
    return this.getSnapshot();
  }

  private addLog(event: string, category: SyntheticDispatchLog["category"], status: "SUCCESS" | "WARN" | "INFO", latencyMs: number, details: string) {
    const logItem: SyntheticDispatchLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      event,
      category,
      status,
      latencyMs,
      details,
    };
    this.dispatchLogs.unshift(logItem);
    if (this.dispatchLogs.length > 80) {
      this.dispatchLogs.pop();
    }
  }
}

// Global singleton instance across Next.js API route handlers
const globalForSyntheticDb = globalThis as unknown as {
  auraSyntheticDb?: SyntheticDatabase;
};

export const syntheticDb = globalForSyntheticDb.auraSyntheticDb ?? new SyntheticDatabase();

if (process.env.NODE_ENV !== "production") {
  globalForSyntheticDb.auraSyntheticDb = syntheticDb;
}
