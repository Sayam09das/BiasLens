/**
 * /api/auth/[...nextauth] — catch-all proxy to the BiasLens backend auth API.
 *
 * Maps incoming Next.js auth route segments to backend endpoints:
 *   GET  /api/auth/me               → GET  /v1/auth/me
 *   POST /api/auth/login            → POST /v1/auth/login
 *   POST /api/auth/register         → POST /v1/auth/register
 *   POST /api/auth/logout           → POST /v1/auth/logout
 *   POST /api/auth/refresh          → POST /v1/auth/refresh
 *   GET  /api/auth/verify-email     → GET  /v1/auth/verify-email
 *   POST /api/auth/forgot-password  → POST /v1/auth/forgot-password
 *   POST /api/auth/reset-password   → POST /v1/auth/reset-password
 */

import { type NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function proxy(
  req: NextRequest,
  context: { params: Promise<{ nextauth: string[] }> }
): Promise<NextResponse> {
  const { nextauth } = await context.params;
  const slug = nextauth.join("/");

  const backendUrl = new URL(`/v1/auth/${slug}`, BACKEND);

  // Forward query params (e.g. ?token= for verify-email)
  req.nextUrl.searchParams.forEach((v, k) => backendUrl.searchParams.set(k, v));

  const headers: Record<string, string> = {
    "content-type": "application/json",
  };

  const cookie = req.headers.get("cookie");
  if (cookie) headers["cookie"] = cookie;

  const csrf = req.headers.get("x-csrf-token");
  if (csrf) headers["x-csrf-token"] = csrf;

  const isGet = req.method === "GET";

  const upstream = await fetch(backendUrl.toString(), {
    method: req.method,
    headers,
    body: isGet ? undefined : await req.text(),
    credentials: "include",
  }).catch((err) => {
    console.error("[auth-proxy] upstream error", err);
    return null;
  });

  if (!upstream) {
    return NextResponse.json({ error: "Backend unreachable" }, { status: 502 });
  }

  const payload = await upstream.json().catch(() => null);
  const response = NextResponse.json(payload, { status: upstream.status });
  const setCookies =
    typeof upstream.headers.getSetCookie === "function"
      ? upstream.headers.getSetCookie()
      : [];

  if (setCookies.length) {
    for (const value of setCookies) {
      response.headers.append("set-cookie", value);
    }
  } else {
    const singleCookie = upstream.headers.get("set-cookie");
    if (singleCookie) {
      response.headers.append("set-cookie", singleCookie);
    }
  }

  return response;
}

export const GET  = proxy;
export const POST = proxy;
