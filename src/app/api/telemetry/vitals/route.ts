import { NextRequest, NextResponse } from "next/server";
import { syntheticDb } from "@/lib/syntheticDb";

export async function GET() {
  const snapshot = syntheticDb.getSnapshot();
  return NextResponse.json({
    success: true,
    patientId: snapshot.patient.id,
    severity: snapshot.patient.severity,
    vitals: snapshot.patient.vitals,
    lastSyncedAt: snapshot.patient.updatedAt,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const snapshot = syntheticDb.updateVitals(body);

    return NextResponse.json({
      success: true,
      vitals: snapshot.patient.vitals,
      updatedAt: snapshot.patient.updatedAt,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update vitals in synthetic database" },
      { status: 500 }
    );
  }
}
