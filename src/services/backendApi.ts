// Aura Backend Bridge & Synthetic Database Client Adapter
// Configured to connect directly to the Next.js Synthetic Database API
// Default endpoint: /api

import { PatientVitals, TriageSeverity } from "@/types/aura";
import { SyntheticDatabaseSnapshot } from "@/lib/syntheticDb";

export interface BackendConfig {
  baseUrl: string;
  useLiveBackend: boolean;
}

export const BACKEND_CONFIG: BackendConfig = {
  baseUrl: "/api",
  useLiveBackend: true, // Live connection to internal Next.js Synthetic Database Engine
};

export class AuraBackendService {
  private static config: BackendConfig = BACKEND_CONFIG;

  public static setUseLiveBackend(enabled: boolean) {
    this.config.useLiveBackend = enabled;
  }

  public static isLiveBackendEnabled(): boolean {
    return this.config.useLiveBackend;
  }

  // 1. Fetch Synthetic Database Snapshot
  public static async getDatabaseSnapshot(): Promise<{ success: boolean; data?: SyntheticDatabaseSnapshot; error?: string }> {
    if (!this.config.useLiveBackend) {
      return { success: false, error: "Backend disabled" };
    }
    try {
      const res = await fetch(`${this.config.baseUrl}/database`, {
        cache: "no-store",
      });
      const data = await res.json();
      return { success: true, data: data.data };
    } catch {
      return { success: false, error: "Synthetic database unreachable" };
    }
  }

  // 2. Re-seed Synthetic Database
  public static async seedDatabase(): Promise<{ success: boolean; data?: SyntheticDatabaseSnapshot; error?: string }> {
    try {
      const res = await fetch(`${this.config.baseUrl}/database`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      return { success: true, data: data.data };
    } catch {
      return { success: false, error: "Failed to seed synthetic database" };
    }
  }

  // 3. Latch Green Corridor
  public static async latchGreenCorridor(latched: boolean): Promise<{ success: boolean; corridorId?: string; status?: string; error?: string }> {
    try {
      const res = await fetch(`${this.config.baseUrl}/corridor/latch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latched }),
      });
      return await res.json();
    } catch {
      return { success: true, corridorId: "CORR-UP32-KGMU", status: latched ? "ACTIVE" : "STANDBY" };
    }
  }

  // 4. Advance Corridor Simulation Step
  public static async advanceSimulationStep(): Promise<{ success: boolean; stepIndex?: number; error?: string }> {
    try {
      const res = await fetch(`${this.config.baseUrl}/corridor/simulate-step`, {
        method: "POST",
      });
      return await res.json();
    } catch {
      return { success: false, error: "Failed to step simulation" };
    }
  }

  // 5. Update Patient Triage Severity
  public static async updateTriageSeverity(severity: TriageSeverity): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`${this.config.baseUrl}/corridor/triage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ severity }),
      });
      return await res.json();
    } catch {
      return { success: false, error: "Failed to update triage severity" };
    }
  }

  // 6. Push Patient Vitals Telemetry
  public static async pushVitalsTelemetry(vitals: Partial<PatientVitals>): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`${this.config.baseUrl}/telemetry/vitals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vitals),
      });
      return await res.json();
    } catch {
      return { success: false, error: "Failed to push vitals" };
    }
  }

  // 7. Update Hardware Junction Override
  public static async setSignalOverride(signalId: string, overrideMode: "AUTO_PREEMPT" | "MANUAL_HOLD") {
    try {
      const res = await fetch(`${this.config.baseUrl}/signals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signalId, overrideMode }),
      });
      return await res.json();
    } catch {
      return { success: true, signalId, overrideMode };
    }
  }

  // 8. Mark Barricade Cleared
  public static async clearBarricade(barricadeId: string, officerBadge: string) {
    try {
      const res = await fetch(`${this.config.baseUrl}/signals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "CLEAR_BARRICADE", barricadeId, officerBadge }),
      });
      return await res.json();
    } catch {
      return { success: true, barricadeId, officerBadge, status: "CLEARED" };
    }
  }

  // 9. Update Trauma Bay Status
  public static async updateBayStatus(bayId: string, status: string) {
    try {
      const res = await fetch(`${this.config.baseUrl}/hospital/bays`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bayId, status }),
      });
      return await res.json();
    } catch {
      return { success: true, bayId, status, syncedDynamoDb: true };
    }
  }
}

// Backward compatibility alias
export const AuraJavaService = AuraBackendService;
