// Aura (Automated Emergency Green Corridor & Triage Platform)
// Core Domain Types & Telemetry Models

export type WaypointType = 'signal' | 'barricade' | 'destination';

export type JunctionState = 'RED_HOLD' | 'GEOFENCE_500M' | 'FORCE_GREEN';
export type BarricadeState = 'BLOCKED' | '500M_ALERT' | 'CLEARED';

export interface Waypoint {
  id: string; // e.g. 'JNC-01', 'JNC-02', 'BAR-03', 'DST-04'
  name: string; // e.g. 'HAZRATGANJ CROSSING'
  shortName: string; // e.g. 'HAZRATGANJ'
  type: WaypointType;
  coords: { lat: number; lng: number };
  distanceMetersFromStart: number;
  status: JunctionState | BarricadeState;
  controllerState: 'RED_HOLD' | 'FORCE_GREEN' | 'MANUAL_HOLD';
  geofenceRadiusMeters: number;
  lambdaRequestId?: string;
  ttlSeconds?: number;
  overrideMode: 'AUTO_PREEMPT' | 'MANUAL_HOLD';
  barricadeOfficer?: string;
  barricadeStatus?: 'BLOCKED' | 'NOTIFIED' | 'CLEARED';
}

export type TriageSeverity = 'CRITICAL' | 'SEVERE' | 'MODERATE';

export type MapMode = 'GOOGLE_TACTICAL' | 'GOOGLE_SATELLITE' | 'SCHEMATIC_CAD';

export interface PatientVitals {
  bp: string; // e.g. '92/58'
  spo2: number; // e.g. 91
  hr: number; // e.g. 128
  tempF: number; // e.g. 98.4
  triageClass: string; // e.g. 'CRITICAL : POLYTRAUMA'
  lastUpdatedEpochMs?: number;
  pulseBeat?: boolean;
  systolic?: number;
  diastolic?: number;
}

export interface AmbulanceUnit {
  unitId: string; // 'AMB-UP32-108'
  currentCoords: { lat: number; lng: number };
  currentSpeedKmh: number;
  mqttStatus: 'CONNECTED' | 'RECONNECTING' | 'OFFLINE';
  mqttLatencyMs: number; // 18ms
  vitals: PatientVitals;
  severity: TriageSeverity;
  assignedHospitalId: string;
  assignedHospitalName: string;
  assignedBayId: string;
  etaSeconds: number;
  corridorLatched: boolean;
  distanceTraveledMeters: number;
  totalDistanceMeters: number;
}

export type BayStatus = 'AVAILABLE' | 'RESERVED' | 'OCCUPIED';

export interface TraumaBay {
  id: string; // 'TB-01' to 'TB-08'
  name: string; // 'TRAUMA BAY 01'
  unit: 'Trauma Surgery' | 'Neurosurgery' | 'Critical Care' | 'Emergency Medicine';
  status: BayStatus;
  reservedForUnit?: string;
  ventilatorReady: boolean;
  oxygenFlowLpm: number;
  lastSyncedMs: number;
}

export interface HospitalFacility {
  id: string;
  name: string;
  location: string;
  distanceKm: number;
  etaMinutes: number;
  traumaBaysOpen: number;
  icuVentilators: number;
  decision: 'PRIMARY_TARGET' | 'STANDBY' | 'BYPASSED_FULL';
  isPrimary: boolean;
  specialties: string[];
}

export type AwsService =
  | 'AWS IoT Core'
  | 'Amazon Location'
  | 'AWS Lambda'
  | 'Amazon SNS'
  | 'Amazon DynamoDB'
  | 'AWS Amplify';

export interface AwsTelemetryEvent {
  id: string;
  timestamp: string; // '22:37:04.112'
  service: AwsService;
  topicOrAction: string;
  payload: Record<string, unknown>;
  latencyMs: number;
  status: 'SUCCESS' | 'WARNING' | 'ALERT';
}

export interface LambdaLogEntry {
  id: string;
  timestamp: string;
  functionName: string;
  triggerEvent: string;
  signalId: string;
  actionTaken: string;
  executionDurationMs: number;
  billedDurationMs: number;
  memoryUsedMb: number;
  status: '200 OK' | '500 ERROR';
}

export interface SnsBarricadeItem {
  id: string;
  gateId: string;
  locationName: string;
  assignedOfficer: string;
  officerPhone: string;
  status: 'DISPATCHED' | 'NOTIFIED' | 'CLEARED';
  proximityDistanceMeters: number;
  etaSeconds: number;
  dispatchedAt: string;
  clearedAt?: string;
}

export interface SimulationTelemetry {
  activeCorridorId: string;
  corridorsCount: number;
  signalsPreempted: number;
  totalSignals: number;
  goldenHourTimeSavedSeconds: number;
  barricadeResponseAvgSec: number;
  dynamoDbSyncLatencyMs: number;
}
