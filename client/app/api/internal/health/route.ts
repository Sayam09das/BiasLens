/**
 * GET /api/internal/health
 *
 * Lightweight liveness probe for the Next.js frontend process.
 * Reports process uptime, memory usage, and a reachability ping to the
 * backend — useful for container orchestration health checks.
 */

import { type NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function GET(_req: NextRequest): Promise<NextResponse> {
  const start = Date.now();

  const backendStatus = await fetch(`${BACKEND}/health`, {
    method: "GET",
    signal: AbortSignal.timeout(3000),
  })
    .then((r) => (r.ok ? "ok" : "degraded"))
    .catch(() => "unreachable");

  const mem = process.memoryUsage();

  return NextResponse.json({
    status: backendStatus === "ok" ? "ok" : "degraded",
    service: "biaslens-client",
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    latencyMs: Date.now() - start,
    backend: backendStatus,
    memory: {
      heapUsedMb: Math.round(mem.heapUsed / 1024 / 1024),
      heapTotalMb: Math.round(mem.heapTotal / 1024 / 1024),
      rssMb: Math.round(mem.rss / 1024 / 1024),
    },
  });
}

export const dynamic = "force-dynamic";
