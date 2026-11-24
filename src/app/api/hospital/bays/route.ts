import { NextRequest, NextResponse } from "next/server";
import { syntheticDb } from "@/lib/syntheticDb";

export async function GET() {
  const snapshot = syntheticDb.getSnapshot();
  return NextResponse.json({
    success: true,
    bays: snapshot.traumaBays,
  });
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { bayId, status } = body;
    if (!bayId || !status) {
      return NextResponse.json({ success: false, error: "bayId and status are required" }, { status: 400 });
    }

    const snapshot = syntheticDb.updateBayStatus(bayId, status);
    return NextResponse.json({
      success: true,
      bayId,
      status,
      bays: snapshot.traumaBays,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update hospital bay" }, { status: 500 });
  }
}
