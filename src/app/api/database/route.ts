import { NextResponse } from "next/server";
import { syntheticDb } from "@/lib/syntheticDb";

export async function GET() {
  const snapshot = syntheticDb.getSnapshot();
  return NextResponse.json({
    success: true,
    data: snapshot,
    meta: {
      dbEngine: snapshot.stats.dbEngine,
      totalTables: snapshot.stats.totalTables,
      totalRecords: snapshot.stats.totalRecords,
      syncedAt: snapshot.lastSyncedAt,
    },
  });
}

export async function POST() {
  const snapshot = syntheticDb.seed();
  return NextResponse.json({
    success: true,
    message: "Synthetic database re-seeded to Lucknow corridor initial state.",
    data: snapshot,
  });
}
