import { NextResponse } from "next/server";

export const runtime = "nodejs";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "roboticapi-cloud",
    version: "0.1.0",
    timestamp: new Date().toISOString()
  });
}
