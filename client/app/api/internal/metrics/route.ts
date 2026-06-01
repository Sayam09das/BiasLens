/**
 * GET /api/internal/metrics
 *
 * Exposes frontend process metrics in Prometheus text format.
 * Gated by the INTERNAL_METRICS_SECRET env var — requests without a matching
 * `Authorization: Bearer <secret>` header receive a 401.
 *
 * Scraped by the observability stack (Prometheus / Grafana).
 */

import { type NextRequest, NextResponse } from "next/server";

const METRICS_SECRET = process.env.INTERNAL_METRICS_SECRET ?? "";

export async function GET(req: NextRequest): Promise<NextResponse> {
  if (METRICS_SECRET) {
    const auth = req.headers.get("authorization") ?? "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    if (token !== METRICS_SECRET) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  }

  const mem     = process.memoryUsage();
  const uptime  = process.uptime();
  const now     = Date.now();

  const lines = [
    "# HELP nodejs_heap_used_bytes Process heap memory used",
    "# TYPE nodejs_heap_used_bytes gauge",
    `nodejs_heap_used_bytes ${mem.heapUsed}`,

    "# HELP nodejs_heap_total_bytes Process heap memory total",
    "# TYPE nodejs_heap_total_bytes gauge",
    `nodejs_heap_total_bytes ${mem.heapTotal}`,

    "# HELP nodejs_rss_bytes Process resident set size",
    "# TYPE nodejs_rss_bytes gauge",
    `nodejs_rss_bytes ${mem.rss}`,

    "# HELP nodejs_external_bytes Process external memory",
    "# TYPE nodejs_external_bytes gauge",
    `nodejs_external_bytes ${mem.external}`,

    "# HELP process_uptime_seconds Process uptime in seconds",
    "# TYPE process_uptime_seconds counter",
    `process_uptime_seconds ${uptime.toFixed(2)}`,

    "# HELP scrape_timestamp_ms Unix timestamp of this scrape",
    "# TYPE scrape_timestamp_ms gauge",
    `scrape_timestamp_ms ${now}`,
  ];

  return new NextResponse(lines.join("\n") + "\n", {
    status: 200,
    headers: {
      "Content-Type": "text/plain; version=0.0.4; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export const dynamic = "force-dynamic";
