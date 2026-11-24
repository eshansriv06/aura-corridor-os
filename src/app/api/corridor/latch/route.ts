import { NextRequest, NextResponse } from "next/server";
import { syntheticDb } from "@/lib/syntheticDb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const latched = Boolean(body.latched);
    const snapshot = syntheticDb.latchCorridor(latched);

    return NextResponse.json({
      success: true,
      corridorId: snapshot.corridor.id,
      status: snapshot.corridor.status,
      latched,
      data: snapshot,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to latch corridor in synthetic database" },
      { status: 500 }
    );
  }
}
