"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  Waypoint,
  AmbulanceUnit,
  TraumaBay,
  BayStatus,
  HospitalFacility,
  AwsTelemetryEvent,
  LambdaLogEntry,
  SnsBarricadeItem,
  SimulationTelemetry,
  TriageSeverity,
  AwsService,
  MapMode,
  PatientVitals,
} from "@/types/aura";
import { AuraBackendService } from "@/services/backendApi";

// Authentic Lucknow Corridor Waypoints
const INITIAL_WAYPOINTS: Waypoint[] = [
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

// 8 Dedicated KGMU Emergency Trauma Bays (Amazon DynamoDB Partition: KGMU-CHOWK)
const INITIAL_BAYS: TraumaBay[] = [
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
    oxygenFlowLpm: 15,
    lastSyncedMs: 4.5,
  },
  {
    id: "TB-04",
    name: "TRAUMA BAY 04",
    unit: "Trauma Surgery",
    status: "AVAILABLE",
    ventilatorReady: true,
    oxygenFlowLpm: 10,
    lastSyncedMs: 4.0,
  },
  {
    id: "TB-05",
    name: "TRAUMA BAY 05",
    unit: "Emergency Medicine",
    status: "OCCUPIED",
    ventilatorReady: false,
    oxygenFlowLpm: 8,
    lastSyncedMs: 4.2,
  },
  {
    id: "TB-06",
    name: "TRAUMA BAY 06",
    unit: "Critical Care",
    status: "AVAILABLE",
    ventilatorReady: true,
    oxygenFlowLpm: 15,
    lastSyncedMs: 3.9,
  },
  {
    id: "TB-07",
    name: "TRAUMA BAY 07",
    unit: "Neurosurgery",
    status: "AVAILABLE",
    ventilatorReady: true,
    oxygenFlowLpm: 12,
    lastSyncedMs: 4.1,
  },
  {
    id: "TB-08",
    name: "TRAUMA BAY 08",
    unit: "Trauma Surgery",
    status: "OCCUPIED",
    ventilatorReady: true,
    oxygenFlowLpm: 15,
    lastSyncedMs: 4.4,
  },
];

// Hospital Network Comparison Table data
const INITIAL_HOSPITALS: HospitalFacility[] = [
  {
    id: "HOSP-KGMU",
    name: "KGMU Trauma Centre",
    location: "Shah Mina Road, Chowk, Lucknow",
    distanceKm: 4.6,
    etaMinutes: 3.7,
    traumaBaysOpen: 4,
    icuVentilators: 18,
    decision: "PRIMARY_TARGET",
    isPrimary: true,
    specialties: ["Level-1 Polytrauma", "Neurotrauma", "Cardiothoracic Surgery"],
  },
  {
    id: "HOSP-RMLIMS",
    name: "Dr. Ram Manohar Lohia Institute (RMLIMS)",
    location: "Vibhuti Khand, Gomti Nagar, Lucknow",
    distanceKm: 8.2,
    etaMinutes: 8.5,
    traumaBaysOpen: 6,
    icuVentilators: 24,
    decision: "STANDBY",
    isPrimary: false,
    specialties: ["Emergency Neurosurgery", "Burn ICU", "Cardiology"],
  },
  {
    id: "HOSP-CIVIL",
    name: "Dr. Shyama Prasad Mukherjee (Civil) Hospital",
    location: "Park Road, Hazratganj, Lucknow",
    distanceKm: 2.1,
    etaMinutes: 2.8,
    traumaBaysOpen: 2,
    icuVentilators: 7,
    decision: "STANDBY",
    isPrimary: false,
    specialties: ["Primary Stabilization", "Cardiac First Response"],
  },
  {
    id: "HOSP-MEDANTA",
    name: "Medanta Super Specialty Hospital",
    location: "Sector A, Pocket 1, Amar Shaheed Path, Lucknow",
    distanceKm: 14.8,
    etaMinutes: 14.2,
    traumaBaysOpen: 8,
    icuVentilators: 32,
    decision: "STANDBY",
    isPrimary: false,
    specialties: ["Comprehensive Multi-Organ Trauma", "ECMO", "Stroke Unit"],
  },
];

// Authentic Lucknow Emergency Green Corridor Road Network (Mahatma Gandhi Marg -> Kaiserbagh -> Shah Mina Rd -> KGMU)
import { ROUTE_PATH_COORDINATES } from "@/lib/lucknowRoadPath";
export { ROUTE_PATH_COORDINATES };

interface AuraContextType {
  // Theme
  theme: "daylight" | "dark";
  toggleTheme: () => void;

  // Simulation Engine
  isSimulating: boolean;
  simulationProgress: number; // 0.0 to 1.0
  startSimulation: () => void;
  pauseSimulation: () => void;
  resetSimulation: () => void;
  advanceSimulationStep: (delta: number) => void;

  // Ambulance State
  ambulance: AmbulanceUnit;
  setTriageSeverity: (sev: TriageSeverity) => void;
  toggleCorridorLatch: () => void;
  setCorridorLatchState: (state: boolean) => void;

  // Waypoints & Hardware Signal Overrides
  waypoints: Waypoint[];
  selectedWaypointId: string;
  setSelectedWaypointId: (id: string) => void;
  updateWaypointOverride: (id: string, mode: "AUTO_PREEMPT" | "MANUAL_HOLD") => void;
  clearBarricade: (id: string) => void;

  // Hospital & DynamoDB Bays
  traumaBays: TraumaBay[];
  toggleBayStatus: (bayId: string) => void;
  hospitals: HospitalFacility[];
  targetHospital: HospitalFacility;
  isAllBaysOccupied: boolean;
  diversionActive: boolean;
  dismissDiversion: () => void;

  // Telemetry & Event Stream (AWS Services Inspector)
  telemetryEvents: AwsTelemetryEvent[];
  filterService: AwsService | "ALL";
  setFilterService: (svc: AwsService | "ALL") => void;
  isStreamPaused: boolean;
  toggleStreamPause: () => void;
  clearTelemetryStream: () => void;
  selectedAwsService: AwsService;
  setSelectedAwsService: (svc: AwsService) => void;
  lambdaLogs: LambdaLogEntry[];
  snsBarricades: SnsBarricadeItem[];
  simulationMetrics: SimulationTelemetry;
  currentTimeString: string;

  // Google Maps & Tactical Cartography
  mapMode: MapMode;
  setMapMode: (mode: MapMode) => void;
  googleMapsApiKey: string;
  setGoogleMapsApiKey: (key: string) => void;

  // Frequently Updated Patient Vitals
  isVitalsOscillating: boolean;
  setIsVitalsOscillating: (val: boolean) => void;
  vitalsTickCount: number;

  // Synthetic Database & Live Backend Bridge
  backendConnected: boolean;
  backendLatencyMs: number;
  syntheticDbRecords: number;
  syntheticDbEngine: string;
  reseedSyntheticDatabase: () => Promise<void>;
}

const AuraContext = createContext<AuraContextType | undefined>(undefined);

function formatTimestamp(): string {
  const d = new Date();
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  const s = String(d.getSeconds()).padStart(2, "0");
  const ms = String(d.getMilliseconds()).padStart(3, "0");
  return `${h}:${m}:${s}.${ms}`;
}

export function AuraProvider({ children }: { children: React.ReactNode }) {
  // 1. Theme State
  const [theme, setTheme] = useState<"daylight" | "dark">("dark");

  // 1b. Synthetic Database & Live Backend Connection State
  const [backendConnected, setBackendConnected] = useState<boolean>(true);
  const [backendLatencyMs, setBackendLatencyMs] = useState<number>(14);
  const [syntheticDbRecords, setSyntheticDbRecords] = useState<number>(24);
  const [syntheticDbEngine, setSyntheticDbEngine] = useState<string>("Synthetic DynamoDB Memory Engine");

  const syncWithSyntheticDb = useCallback(async () => {
    try {
      const t0 = performance.now();
      const res = await AuraBackendService.getDatabaseSnapshot();
      const elapsed = Math.round(performance.now() - t0);
      if (res.success && res.data) {
        setBackendConnected(true);
        setBackendLatencyMs(elapsed || 12);
        setSyntheticDbRecords(res.data.stats.totalRecords);
        setSyntheticDbEngine(res.data.stats.dbEngine);
      } else {
        setBackendConnected(false);
      }
    } catch {
      setBackendConnected(false);
    }
  }, []);

  const reseedSyntheticDatabase = useCallback(async () => {
    try {
      const res = await AuraBackendService.seedDatabase();
      if (res.success && res.data) {
        setSyntheticDbRecords(res.data.stats.totalRecords);
        setBackendConnected(true);
      }
    } catch {
      // fallback
    }
  }, []);

  useEffect(() => {
    syncWithSyntheticDb();
  }, [syncWithSyntheticDb]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("aura-theme");
      if (stored === "daylight" || stored === "dark") {
        setTheme(stored);
        document.documentElement.setAttribute("data-theme", stored);
      } else {
        document.documentElement.setAttribute("data-theme", "dark");
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "daylight" : "dark";
      try {
        localStorage.setItem("aura-theme", next);
        document.documentElement.setAttribute("data-theme", next);
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  // 2. Telemetry Event Stream
  const [telemetryEvents, setTelemetryEvents] = useState<AwsTelemetryEvent[]>([
    {
      id: "evt-01",
      timestamp: "22:37:04.112",
      service: "AWS IoT Core",
      topicOrAction: "topic/amb/UP32-108/telemetry",
      payload: { lat: 26.8512, lng: 80.9341, speedKmh: 68, headingDeg: 284 },
      latencyMs: 18,
      status: "SUCCESS",
    },
    {
      id: "evt-02",
      timestamp: "22:37:04.129",
      service: "Amazon Location",
      topicOrAction: "EVENT GEOFENCE_ENTER",
      payload: { geofenceId: "GEO-JNC-02", radiusMeters: 500, unitId: "AMB-UP32-108" },
      latencyMs: 8,
      status: "SUCCESS",
    },
    {
      id: "evt-03",
      timestamp: "22:37:04.143",
      service: "AWS Lambda",
      topicOrAction: "EXEC preemptCorridorHandler",
      payload: { signalId: "JNC-02", command: "FORCE_GREEN", durationMs: 14, requestId: "req-9884b-ap-south" },
      latencyMs: 14,
      status: "SUCCESS",
    },
    {
      id: "evt-04",
      timestamp: "22:37:04.151",
      service: "Amazon SNS",
      topicOrAction: "PUBLISH BarricadeAlert",
      payload: { unit: "CONSTABLE-09", gate: "BAR-03", status: "DELIVERED", targetPhone: "+91-94520-XXXXX" },
      latencyMs: 22,
      status: "ALERT",
    },
    {
      id: "evt-05",
      timestamp: "22:37:04.156",
      service: "Amazon DynamoDB",
      topicOrAction: "UPDATE_ITEM TraumaBays",
      payload: { hospital: "KGMU-CHOWK", bay: "TB-01", status: "RESERVED", latencyMs: 4.2 },
      latencyMs: 4.2,
      status: "SUCCESS",
    },
    {
      id: "evt-06",
      timestamp: "22:37:04.170",
      service: "AWS Amplify",
      topicOrAction: "EDGE_SSR_DISTRIBUTION",
      payload: { edgeLocation: "DEL54-C1", clientIp: "103.24.12.9", cacheStatus: "BYPASS" },
      latencyMs: 12,
      status: "SUCCESS",
    },
  ]);

  const [filterService, setFilterService] = useState<AwsService | "ALL">("ALL");
  const [selectedAwsService, setSelectedAwsService] = useState<AwsService>("AWS IoT Core");
  const [isStreamPaused, setIsStreamPaused] = useState<boolean>(false);

  const addTelemetryEvent = useCallback((event: Omit<AwsTelemetryEvent, "id">) => {
    if (isStreamPaused) return;
    const newEvt: AwsTelemetryEvent = {
      ...event,
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    setTelemetryEvents((prev) => [newEvt, ...prev.slice(0, 99)]);
  }, [isStreamPaused]);

  // 3. Waypoints State
  const [waypoints, setWaypoints] = useState<Waypoint[]>(INITIAL_WAYPOINTS);
  const [selectedWaypointId, setSelectedWaypointId] = useState<string>("JNC-02");

  // 4. Hospital & Bays State
  const [traumaBays, setTraumaBays] = useState<TraumaBay[]>(INITIAL_BAYS);
  const [hospitals, setHospitals] = useState<HospitalFacility[]>(INITIAL_HOSPITALS);
  const [diversionActive, setDiversionActive] = useState<boolean>(false);

  // Check if all KGMU bays are occupied
  const isAllBaysOccupied = useMemo(() => {
    return traumaBays.every((b) => b.status === "OCCUPIED");
  }, [traumaBays]);

  // Dynamic diversion effect when all bays become occupied
  useEffect(() => {
    if (isAllBaysOccupied) {
      setDiversionActive(true);
      setHospitals((prev) =>
        prev.map((h) => {
          if (h.id === "HOSP-KGMU") {
            return { ...h, decision: "BYPASSED_FULL", isPrimary: false, traumaBaysOpen: 0 };
          }
          if (h.id === "HOSP-RMLIMS") {
            return { ...h, decision: "PRIMARY_TARGET", isPrimary: true };
          }
          return h;
        })
      );
      addTelemetryEvent({
        timestamp: formatTimestamp(),
        service: "Amazon DynamoDB",
        topicOrAction: "EMERGENCY_DIVERSION_TRIGGERED",
        payload: {
          originalHospital: "KGMU Trauma Centre",
          reason: "ZERO_TRAUMA_BAYS_AVAILABLE",
          reroutedTo: "Dr. Ram Manohar Lohia Institute (RMLIMS)",
          distanceDeltaKm: "+3.6 KM",
        },
        latencyMs: 3.9,
        status: "ALERT",
      });
    } else {
      setDiversionActive(false);
      setHospitals((prev) =>
        prev.map((h) => {
          if (h.id === "HOSP-KGMU") {
            const openCount = traumaBays.filter((b) => b.status === "AVAILABLE").length;
            return { ...h, decision: "PRIMARY_TARGET", isPrimary: true, traumaBaysOpen: openCount };
          }
          if (h.id === "HOSP-RMLIMS") {
            return { ...h, decision: "STANDBY", isPrimary: false };
          }
          return h;
        })
      );
    }
  }, [isAllBaysOccupied, traumaBays, addTelemetryEvent]);

  const toggleBayStatus = useCallback((bayId: string) => {
    setTraumaBays((prev) =>
      prev.map((bay) => {
        if (bay.id === bayId) {
          const nextStatus: BayStatus = bay.status === "OCCUPIED" ? "AVAILABLE" : "OCCUPIED";
          AuraBackendService.updateBayStatus(bayId, nextStatus).catch(() => {});
          return {
            ...bay,
            status: nextStatus,
            reservedForUnit: undefined,
          };
        }
        return bay;
      })
    );
    addTelemetryEvent({
      timestamp: formatTimestamp(),
      service: "Amazon DynamoDB",
      topicOrAction: "UPDATE_ITEM TraumaBays",
      payload: { bayId, action: "TOGGLE_CAPACITY", syncLatencyMs: 4.1 },
      latencyMs: 4.1,
      status: "SUCCESS",
    });
  }, [addTelemetryEvent]);

  const targetHospital = useMemo(() => {
    const found = hospitals.find((h) => h.isPrimary);
    return found || hospitals[0];
  }, [hospitals]);

  const dismissDiversion = useCallback(() => {
    setDiversionActive(false);
  }, []);

  // 5. Ambulance Unit State
  const [ambulance, setAmbulance] = useState<AmbulanceUnit>({
    unitId: "AMB-UP32-108",
    currentCoords: { lat: 26.8467, lng: 80.9462 },
    currentSpeedKmh: 64,
    mqttStatus: "CONNECTED",
    mqttLatencyMs: 18,
    vitals: {
      bp: "92/58",
      spo2: 91,
      hr: 128,
      tempF: 98.4,
      triageClass: "CRITICAL : POLYTRAUMA",
    },
    severity: "CRITICAL",
    assignedHospitalId: "HOSP-KGMU",
    assignedHospitalName: "KGMU Trauma Centre, Chowk",
    assignedBayId: "TB-01",
    etaSeconds: 222, // 03:42
    corridorLatched: false,
    distanceTraveledMeters: 1420,
    totalDistanceMeters: 4600,
  });

  const setTriageSeverity = useCallback(
    (sev: TriageSeverity) => {
      AuraBackendService.updateTriageSeverity(sev).catch(() => {});
      let targetBayId = "TB-04";
      if (sev === "CRITICAL") {
        targetBayId = "TB-01";
      } else if (sev === "SEVERE") {
        targetBayId = "TB-02";
      }

      setTraumaBays((prev) =>
        prev.map((bay) => {
          if (bay.id === targetBayId) {
            return { ...bay, status: "RESERVED", reservedForUnit: "AMB-UP32-108" };
          }
          if (bay.reservedForUnit === "AMB-UP32-108") {
            return { ...bay, status: "AVAILABLE", reservedForUnit: undefined };
          }
          return bay;
        })
      );

      setAmbulance((prev) => {
        let condition = "MODERATE : BLUNT TRAUMA / STABLE";
        let targetHosp = "KGMU Trauma Centre, Chowk";

        if (sev === "CRITICAL") {
          condition = "CRITICAL : POLYTRAUMA / CARDIAC";
          targetHosp = "KGMU Trauma Centre, Chowk";
        } else if (sev === "SEVERE") {
          condition = "SEVERE : MULTIPLE FRACTURES / CONCUSSION";
          targetHosp = "KGMU Trauma Centre, Chowk";
        }

        return {
          ...prev,
          severity: sev,
          assignedHospitalName: targetHosp,
          assignedBayId: targetBayId,
          vitals: {
            ...prev.vitals,
            triageClass: condition,
          },
        };
      });

      addTelemetryEvent({
        timestamp: formatTimestamp(),
        service: "AWS Lambda",
        topicOrAction: "EXEC triageClassificationHandler",
        payload: {
          unitId: "AMB-UP32-108",
          newSeverity: sev,
          lockedHospital: "KGMU-CHOWK",
          lockedBay: targetBayId,
        },
        latencyMs: 14,
        status: "ALERT",
      });
    },
    [addTelemetryEvent]
  );

  const toggleCorridorLatch = useCallback(() => {
    setAmbulance((prev) => {
      const nextLatched = !prev.corridorLatched;
      AuraBackendService.latchGreenCorridor(nextLatched).catch(() => {});
      if (nextLatched) {
        // Force green upcoming signals
        setWaypoints((wps) =>
          wps.map((w) => (w.type === "signal" ? { ...w, controllerState: "FORCE_GREEN", status: "FORCE_GREEN" } : w))
        );
      }
      return { ...prev, corridorLatched: nextLatched };
    });

    addTelemetryEvent({
      timestamp: formatTimestamp(),
      service: "AWS Lambda",
      topicOrAction: "EXEC masterCorridorLatchHandler",
      payload: {
        unitId: "AMB-UP32-108",
        action: ambulance.corridorLatched ? "CORRIDOR_RELEASED" : "CORRIDOR_LATCHED",
        preemptJunctions: ["JNC-01", "JNC-02", "DST-04"],
      },
      latencyMs: 16,
      status: "SUCCESS",
    });
  }, [ambulance.corridorLatched, addTelemetryEvent]);

  const setCorridorLatchState = useCallback((state: boolean) => {
    AuraBackendService.latchGreenCorridor(state).catch(() => {});
    setAmbulance((prev) => ({ ...prev, corridorLatched: state }));
  }, []);

  // 6. Barricade Police Clearance & Manual Overrides
  const clearBarricade = useCallback(
    (barricadeId: string) => {
      AuraBackendService.clearBarricade(barricadeId, "Constable R. Verma").catch(() => {});
      setWaypoints((prev) =>
        prev.map((w) => {
          if (w.id === barricadeId) {
            return {
              ...w,
              barricadeStatus: "CLEARED",
              status: "CLEARED",
              controllerState: "FORCE_GREEN",
            };
          }
          return w;
        })
      );

      addTelemetryEvent({
        timestamp: formatTimestamp(),
        service: "Amazon SNS",
        topicOrAction: "BAR_CLEARED_ACK",
        payload: {
          gateId: barricadeId,
          officer: "Constable R. Verma",
          status: "CLEARED",
          roadStatus: "100% UNOBSTRUCTED",
        },
        latencyMs: 19,
        status: "SUCCESS",
      });
    },
    [addTelemetryEvent]
  );

  const updateWaypointOverride = useCallback(
    (id: string, mode: "AUTO_PREEMPT" | "MANUAL_HOLD") => {
      AuraBackendService.setSignalOverride(id, mode).catch(() => {});
      setWaypoints((prev) =>
        prev.map((w) => {
          if (w.id === id) {
            return {
              ...w,
              overrideMode: mode,
              controllerState: mode === "MANUAL_HOLD" ? "MANUAL_HOLD" : "FORCE_GREEN",
              status: mode === "MANUAL_HOLD" ? "RED_HOLD" : "FORCE_GREEN",
            };
          }
          return w;
        })
      );

      addTelemetryEvent({
        timestamp: formatTimestamp(),
        service: "AWS IoT Core",
        topicOrAction: "SHADOW_UPDATE /junction/override",
        payload: { signalId: id, overrideMode: mode, source: "POLICE_COMMAND_DESK" },
        latencyMs: 15,
        status: mode === "MANUAL_HOLD" ? "ALERT" : "SUCCESS",
      });
    },
    [addTelemetryEvent]
  );

  // 7. Simulation State Engine
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationProgress, setSimulationProgress] = useState<number>(0.31); // Start ~31% into route
  const simIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const advanceSimulationStep = useCallback(
    (delta: number) => {
      setSimulationProgress((prev) => {
        let next = prev + delta;
        if (next > 1) next = 0; // loop back seamlessly

        // Interpolate coordinates along ROUTE_PATH_COORDINATES
        const totalSegments = ROUTE_PATH_COORDINATES.length - 1;
        const segmentIdx = Math.min(Math.floor(next * totalSegments), totalSegments - 1);
        const segmentT = (next * totalSegments) - segmentIdx;
        const p1 = ROUTE_PATH_COORDINATES[segmentIdx];
        const p2 = ROUTE_PATH_COORDINATES[segmentIdx + 1];

        const currentLat = p1.lat + (p2.lat - p1.lat) * segmentT;
        const currentLng = p1.lng + (p2.lng - p1.lng) * segmentT;
        const coveredMeters = Math.round(next * 4600);
        const remainingEta = Math.max(10, Math.round((1 - next) * 360));

        // Speed fluctuation realistic 60-72 km/h
        const speed = Math.round(62 + Math.sin(next * 20) * 8);

        setAmbulance((amb) => ({
          ...amb,
          currentCoords: {
            lat: parseFloat(currentLat.toFixed(5)),
            lng: parseFloat(currentLng.toFixed(5)),
          },
          currentSpeedKmh: speed,
          distanceTraveledMeters: coveredMeters,
          etaSeconds: remainingEta,
        }));

        // Dynamic waypoint state progression based on progress
        setWaypoints((wps) =>
          wps.map((wp) => {
            const wpFraction = wp.distanceMetersFromStart / 4600;
            const distToWp = Math.abs(wpFraction - next) * 4600;

            if (wp.type === "signal") {
              if (distToWp <= 550 && next < wpFraction) {
                return { ...wp, status: "GEOFENCE_500M", controllerState: "FORCE_GREEN" };
              } else if (next >= wpFraction) {
                return { ...wp, status: "FORCE_GREEN", controllerState: "FORCE_GREEN" };
              } else {
                return { ...wp, status: "RED_HOLD", controllerState: "RED_HOLD" };
              }
            } else if (wp.type === "barricade") {
              if (distToWp <= 600 && next < wpFraction) {
                return { ...wp, barricadeStatus: "NOTIFIED", status: "500M_ALERT" };
              } else if (next >= wpFraction) {
                return { ...wp, barricadeStatus: "CLEARED", status: "CLEARED" };
              } else {
                return { ...wp, barricadeStatus: "BLOCKED", status: "BLOCKED" };
              }
            }
            return wp;
          })
        );

        return next;
      });
    },
    []
  );

  const startSimulation = useCallback(() => {
    setIsSimulating(true);
    addTelemetryEvent({
      timestamp: formatTimestamp(),
      service: "AWS IoT Core",
      topicOrAction: "SIMULATION_LIVE_RUN_STARTED",
      payload: { route: "HAZRATGANJ -> KGMU TRAUMA", activeUnit: "AMB-UP32-108", mode: "DETERMINISTIC" },
      latencyMs: 14,
      status: "SUCCESS",
    });
  }, [addTelemetryEvent]);

  const pauseSimulation = useCallback(() => {
    setIsSimulating(false);
  }, []);

  const resetSimulation = useCallback(() => {
    setIsSimulating(false);
    setSimulationProgress(0.0);
    setAmbulance((prev) => ({
      ...prev,
      currentCoords: { lat: 26.8467, lng: 80.9462 },
      distanceTraveledMeters: 0,
      etaSeconds: 380,
      currentSpeedKmh: 64,
    }));
    setWaypoints(INITIAL_WAYPOINTS);
  }, []);

  // Tick simulation timer
  useEffect(() => {
    if (isSimulating) {
      simIntervalRef.current = setInterval(() => {
        advanceSimulationStep(0.005);
      }, 500);
    } else {
      if (simIntervalRef.current) {
        clearInterval(simIntervalRef.current);
      }
    }
    return () => {
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
    };
  }, [isSimulating, advanceSimulationStep]);

  // Periodic random MQTT telemetry emit when simulating
  useEffect(() => {
    if (!isSimulating) return;
    const mqttTimer = setInterval(() => {
      addTelemetryEvent({
        timestamp: formatTimestamp(),
        service: "AWS IoT Core",
        topicOrAction: "topic/amb/UP32-108/telemetry",
        payload: {
          lat: ambulance.currentCoords.lat,
          lng: ambulance.currentCoords.lng,
          speedKmh: ambulance.currentSpeedKmh,
          bp: ambulance.vitals.bp,
          spo2: ambulance.vitals.spo2,
          hr: ambulance.vitals.hr,
        },
        latencyMs: 16 + Math.floor(Math.random() * 5),
        status: "SUCCESS",
      });
    }, 3000);
    return () => clearInterval(mqttTimer);
  }, [isSimulating, ambulance, addTelemetryEvent]);

  // 8. Lambda Execution Logs for Page 2
  const [lambdaLogs] = useState<LambdaLogEntry[]>([
    {
      id: "lam-01",
      timestamp: "22:37:04.143",
      functionName: "preemptCorridorHandler",
      triggerEvent: "LocationGeofence:GEO-JNC-02 (500m)",
      signalId: "JNC-02",
      actionTaken: "SIGNAL_FORCE_GREEN_LATCHED",
      executionDurationMs: 14,
      billedDurationMs: 15,
      memoryUsedMb: 68,
      status: "200 OK",
    },
    {
      id: "lam-02",
      timestamp: "22:35:18.012",
      functionName: "preemptCorridorHandler",
      triggerEvent: "LocationGeofence:GEO-JNC-01 (500m)",
      signalId: "JNC-01",
      actionTaken: "SIGNAL_FORCE_GREEN_LATCHED",
      executionDurationMs: 12,
      billedDurationMs: 13,
      memoryUsedMb: 64,
      status: "200 OK",
    },
    {
      id: "lam-03",
      timestamp: "22:34:40.890",
      functionName: "triageBayAllocatorHandler",
      triggerEvent: "ParamedicTriageToken:CRITICAL",
      signalId: "HOSP-KGMU",
      actionTaken: "RESERVE_BAY_TB01_DYNAMODB",
      executionDurationMs: 18,
      billedDurationMs: 20,
      memoryUsedMb: 72,
      status: "200 OK",
    },
    {
      id: "lam-04",
      timestamp: "22:33:05.419",
      functionName: "dispatchBarricadeClearance",
      triggerEvent: "ProximityCheck:BAR-03",
      signalId: "BAR-03",
      actionTaken: "SNS_PUSH_CONSTABLE_VERMA",
      executionDurationMs: 15,
      billedDurationMs: 16,
      memoryUsedMb: 66,
      status: "200 OK",
    },
  ]);

  // 9. SNS Barricade Queue
  const [snsBarricades] = useState<SnsBarricadeItem[]>([
    {
      id: "sns-bar-03",
      gateId: "BAR-03",
      locationName: "Shah Mina Road / KGMU Entry Gate",
      assignedOfficer: "Constable R. Verma (Badge #UPP-4882)",
      officerPhone: "+91-94520-77312",
      status: "NOTIFIED",
      proximityDistanceMeters: 620,
      etaSeconds: 48,
      dispatchedAt: "22:36:58",
    },
  ]);

  // 10. Real-time Live Clock String
  const [currentTimeString, setCurrentTimeString] = useState<string>("00:00:00");
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeString(
        `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(
          now.getSeconds()
        ).padStart(2, "0")}`
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // 11. KPIs / Metrics
  const simulationMetrics: SimulationTelemetry = useMemo(() => {
    const timeSavedSec = Math.round(400 * simulationProgress) + 240; // ~6m 40s saved
    return {
      activeCorridorId: "AMB-UP32-108",
      corridorsCount: 1,
      signalsPreempted: 3,
      totalSignals: 3,
      goldenHourTimeSavedSeconds: timeSavedSec,
      barricadeResponseAvgSec: 19,
      dynamoDbSyncLatencyMs: 4.1,
    };
  }, [simulationProgress]);

  const clearTelemetryStream = useCallback(() => {
    setTelemetryEvents([]);
  }, []);

  const toggleStreamPause = useCallback(() => {
    setIsStreamPaused((prev) => !prev);
  }, []);

  // 12. Google Maps Mode & API Key State
  const [mapMode, setMapMode] = useState<MapMode>("GOOGLE_TACTICAL");
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState<string>(
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
  );

  // 13. High-Frequency Live Patient Vitals Telemetry Oscillator
  // Frequently updates pulse rate (HR), temperature, blood pressure (BP), and SpO2 every 750ms
  const [isVitalsOscillating, setIsVitalsOscillating] = useState<boolean>(true);
  const [vitalsTickCount, setVitalsTickCount] = useState<number>(0);

  useEffect(() => {
    if (!isVitalsOscillating) return;

    const vitalsTimer = setInterval(() => {
      setVitalsTickCount((tick) => tick + 1);

      setAmbulance((prev) => {
        const t = Date.now() / 1000;
        const sev = prev.severity;

        // 1. Heart Rate / Pulse (BPM)
        // CRITICAL: 124 - 134 BPM (tachycardia)
        // SEVERE: 100 - 108 BPM
        // MODERATE: 78 - 86 BPM
        let baseHr = 128;
        if (sev === "SEVERE") baseHr = 104;
        else if (sev === "MODERATE") baseHr = 82;
        const hrJitter = Math.round(Math.sin(t * 2.4) * 3 + ((Math.random() - 0.5) * 2));
        const currentHr = Math.max(60, baseHr + hrJitter);

        // 2. Blood Pressure (mmHg)
        // CRITICAL: 88/54 - 96/60 (hypotensive shock)
        // SEVERE: 110/68 - 116/74
        // MODERATE: 120/78 - 124/82
        let baseSys = 92;
        let baseDia = 58;
        if (sev === "SEVERE") {
          baseSys = 112;
          baseDia = 70;
        } else if (sev === "MODERATE") {
          baseSys = 122;
          baseDia = 80;
        }
        const sysJitter = Math.round(Math.cos(t * 1.5) * 2 + ((Math.random() - 0.5) * 2));
        const diaJitter = Math.round(Math.sin(t * 1.8) * 1.5 + ((Math.random() - 0.5) * 1.5));
        const currentSys = baseSys + sysJitter;
        const currentDia = baseDia + diaJitter;
        const bpStr = `${currentSys}/${currentDia}`;

        // 3. Body Temperature (°F)
        const tempOffset = (Math.sin(t * 0.6) * 0.2) + ((Math.random() - 0.5) * 0.08);
        const currentTemp = parseFloat((98.4 + tempOffset).toFixed(1));

        // 4. SpO2 Oxygen Saturation (%)
        let baseSpo2 = 91;
        if (sev === "SEVERE") baseSpo2 = 95;
        else if (sev === "MODERATE") baseSpo2 = 98;
        const spo2Jitter = Math.round(Math.sin(t * 0.8) * 1.2);
        const currentSpo2 = Math.min(100, Math.max(85, baseSpo2 + spo2Jitter));

        const updatedVitals: PatientVitals = {
          ...prev.vitals,
          hr: currentHr,
          bp: bpStr,
          tempF: currentTemp,
          spo2: currentSpo2,
          lastUpdatedEpochMs: Date.now(),
          pulseBeat: !prev.vitals.pulseBeat,
          systolic: currentSys,
          diastolic: currentDia,
        };

        return {
          ...prev,
          vitals: updatedVitals,
        };
      });
    }, 750);

    return () => clearInterval(vitalsTimer);
  }, [isVitalsOscillating]);

  return (
    <AuraContext.Provider
      value={{
        theme,
        toggleTheme,
        isSimulating,
        simulationProgress,
        startSimulation,
        pauseSimulation,
        resetSimulation,
        advanceSimulationStep,
        ambulance,
        setTriageSeverity,
        toggleCorridorLatch,
        setCorridorLatchState,
        waypoints,
        selectedWaypointId,
        setSelectedWaypointId,
        updateWaypointOverride,
        clearBarricade,
        traumaBays,
        toggleBayStatus,
        hospitals,
        targetHospital,
        isAllBaysOccupied,
        diversionActive,
        dismissDiversion,
        telemetryEvents,
        filterService,
        setFilterService,
        isStreamPaused,
        toggleStreamPause,
        clearTelemetryStream,
        selectedAwsService,
        setSelectedAwsService,
        lambdaLogs,
        snsBarricades,
        simulationMetrics,
        currentTimeString,
        mapMode,
        setMapMode,
        googleMapsApiKey,
        setGoogleMapsApiKey,
        isVitalsOscillating,
        setIsVitalsOscillating,
        vitalsTickCount,
        backendConnected,
        backendLatencyMs,
        syntheticDbRecords,
        syntheticDbEngine,
        reseedSyntheticDatabase,
      }}
    >
      {children}
    </AuraContext.Provider>
  );
}

export function useAura() {
  const context = useContext(AuraContext);
  if (!context) {
    throw new Error("useAura must be used within an AuraProvider");
  }
  return context;
}
