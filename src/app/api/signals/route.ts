import { NextRequest, NextResponse } from "next/server";
import { syntheticDb } from "@/lib/syntheticDb";

export async function GET() {
  const snapshot = syntheticDb.getSnapshot();
  return NextResponse.json({
    success: true,
    waypoints: snapshot.waypoints,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, signalId, barricadeId, overrideMode, officerBadge } = body;

    if (action === "CLEAR_BARRICADE" && barricadeId) {
      const snapshot = syntheticDb.clearBarricade(barricadeId, officerBadge || "Traffic Div 4");
      return NextResponse.json({
        success: true,
        action: "CLEAR_BARRICADE",
        barricadeId,
        waypoints: snapshot.waypoints,
      });
    }

    if (signalId && overrideMode) {
      const snapshot = syntheticDb.overrideSignal(signalId, overrideMode);
      return NextResponse.json({
        success: true,
        action: "OVERRIDE_SIGNAL",
        signalId,
        overrideMode,
        waypoints: snapshot.waypoints,
      });
    }

    return NextResponse.json({ success: false, error: "Invalid action or parameters" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to process signal command" }, { status: 500 });
  }
}
