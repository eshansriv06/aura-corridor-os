import { NextResponse } from "next/server";
import { syntheticDb } from "@/lib/syntheticDb";

export async function POST() {
  const snapshot = syntheticDb.stepSimulation();
  return NextResponse.json({
    success: true,
    stepIndex: snapshot.corridor.currentWaypointIndex,
    ambulance: snapshot.ambulance,
    waypoints: snapshot.waypoints,
    corridor: snapshot.corridor,
  });
}
