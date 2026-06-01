/**
 * POST /api/webhooks/stripe
 *
 * Receives Stripe webhook events, verifies the signature with the
 * STRIPE_WEBHOOK_SECRET env var, then forwards the raw payload to the
 * backend for processing.
 */

import { type NextRequest, NextResponse } from "next/server";

const BACKEND            = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
const WEBHOOK_SECRET     = process.env.STRIPE_WEBHOOK_SECRET ?? "";
const BACKEND_STRIPE_PATH = "/v1/webhooks/stripe";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  if (!WEBHOOK_SECRET) {
    console.error("[stripe-webhook] STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  const rawBody = await req.text();

  // Verify signature via the backend (keeps Stripe SDK server-side only).
  const upstream = await fetch(`${BACKEND}${BACKEND_STRIPE_PATH}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "stripe-signature": signature,
      "x-webhook-secret": WEBHOOK_SECRET,
    },
    body: rawBody,
  }).catch((err) => {
    console.error("[stripe-webhook] upstream error", err);
    return null;
  });

  if (!upstream) {
    return NextResponse.json({ error: "Failed to reach backend" }, { status: 502 });
  }

  const payload = await upstream.json().catch(() => null);
  return NextResponse.json(payload ?? { received: true }, { status: upstream.status });
}

// Stripe requires the raw body — disable Next.js body parsing.
export const dynamic = "force-dynamic";
