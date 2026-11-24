import { NextRequest, NextResponse } from "next/server";
import { syntheticDb } from "@/lib/syntheticDb";
import { TriageSeverity } from "@/types/aura";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const severity = (body.severity || "CRITICAL") as TriageSeverity;
    const snapshot = syntheticDb.setTriageSeverity(severity);

    return NextResponse.json({
      success: true,
      severity,
      patient: snapshot.patient,
      traumaBays: snapshot.traumaBays,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update triage severity in synthetic database" },
      { status: 500 }
    );
  }
}
