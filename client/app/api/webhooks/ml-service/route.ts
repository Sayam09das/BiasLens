/**
 * POST /api/webhooks/ml-service
 *
 * Receives async callbacks from the BiasLens ML service (audit completed,
 * prediction ready, fairness report generated, etc.), validates the shared
 * secret, then forwards the payload to the backend event bus.
 */

import { type NextRequest, NextResponse } from "next/server";

const BACKEND =
  process.env.NEXT_PUBLIC_API_URL ?? "https://biaslens-9wzi.onrender.com";
const ML_WEBHOOK_SECRET = process.env.ML_WEBHOOK_SECRET ?? "";
const BACKEND_ML_PATH  = "/v1/webhooks/ml-service";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const incomingSecret = req.headers.get("x-ml-webhook-secret");

  if (!ML_WEBHOOK_SECRET) {
    console.error("[ml-webhook] ML_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  if (incomingSecret !== ML_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.text();

  const upstream = await fetch(`${BACKEND}${BACKEND_ML_PATH}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-ml-webhook-secret": ML_WEBHOOK_SECRET,
    },
    body,
  }).catch((err) => {
    console.error("[ml-webhook] upstream error", err);
    return null;
  });

  if (!upstream) {
    return NextResponse.json({ error: "Failed to reach backend" }, { status: 502 });
  }

  const payload = await upstream.json().catch(() => null);
  return NextResponse.json(payload ?? { received: true }, { status: upstream.status });
}

export const dynamic = "force-dynamic";
