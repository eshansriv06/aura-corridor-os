import { NextResponse } from "next/server";
import { syntheticDb } from "@/lib/syntheticDb";

export async function GET() {
  const snapshot = syntheticDb.getSnapshot();
  return NextResponse.json({
    success: true,
    corridor: snapshot.corridor,
    ambulance: snapshot.ambulance,
    patient: snapshot.patient,
    waypoints: snapshot.waypoints,
  });
}
