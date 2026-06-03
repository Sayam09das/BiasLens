/**
 * /api/auth — thin proxy to the BiasLens backend auth endpoints.
 *
 * POST /api/auth?action=login
 * POST /api/auth?action=register
 * POST /api/auth?action=logout
 * POST /api/auth?action=refresh
 * GET  /api/auth?action=me
 * GET  /api/auth?action=verify-email&token=...
 * POST /api/auth?action=resend-verification
 * POST /api/auth?action=forgot-password
 * POST /api/auth?action=reset-password
 */

import { type NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
const ACCESS_COOKIE = "biaslens_access_token";
const REFRESH_COOKIE = "biaslens_refresh_token";

const ACTION_MAP: Record<string, { path: string; method: string }> = {
  login:    { path: "/v1/auth/login", method: "POST" },
  register: { path: "/v1/auth/register", method: "POST" },
  logout:   { path: "/v1/auth/logout", method: "POST" },
  refresh:  { path: "/v1/auth/refresh", method: "POST" },
  me:       { path: "/v1/auth/me", method: "GET" },
  "verify-email": { path: "/v1/auth/verify-email", method: "GET" },
  "resend-verification": { path: "/v1/auth/resend-verification", method: "POST" },
  "forgot-password": { path: "/v1/auth/forgot-password", method: "POST" },
  "reset-password": { path: "/v1/auth/reset-password", method: "POST" },
};

async function forwardUpstream(
  req: NextRequest,
  route: { path: string; method: string },
  cookieOverride?: string,
) {
  const isGet = route.method === "GET";
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const cookie = cookieOverride ?? req.headers.get("cookie");
  if (cookie) headers.cookie = cookie;

  const csrfToken = req.headers.get("x-csrf-token");
  if (csrfToken) headers["x-csrf-token"] = csrfToken;

  const url = new URL(`${BACKEND}${route.path}`);
  req.nextUrl.searchParams.forEach((value, key) => {
    if (key !== "action") {
      url.searchParams.set(key, value);
    }
  });

  return fetch(url, {
    method: route.method,
    headers,
    body: isGet ? undefined : await req.text(),
    credentials: "include",
  }).catch((err) => {
    console.error("[auth-proxy] upstream error", err);
    return null;
  });
}

function appendUpstreamCookies(response: NextResponse, upstream: Response): string[] {
  const setCookies =
    typeof upstream.headers.getSetCookie === "function"
      ? upstream.headers.getSetCookie()
      : [];

  if (setCookies.length) {
    for (const value of setCookies) {
      response.headers.append("set-cookie", value);
    }
    return setCookies;
  }

  const singleCookie = upstream.headers.get("set-cookie");
  if (singleCookie) {
    response.headers.append("set-cookie", singleCookie);
    return [singleCookie];
  }

  return [];
}

function buildCookieHeader(req: NextRequest, setCookies: string[]): string | null {
  const jar = new Map<string, string>();
  const incoming = req.headers.get("cookie");

  if (incoming) {
    for (const chunk of incoming.split(";")) {
      const [rawName, ...rest] = chunk.trim().split("=");
      if (!rawName) continue;
      jar.set(rawName, rest.join("="));
    }
  }

  for (const cookieValue of setCookies) {
    const [pair] = cookieValue.split(";");
    const [rawName, ...rest] = pair.split("=");
    if (!rawName) continue;
    jar.set(rawName.trim(), rest.join("="));
  }

  const entries = [...jar.entries()].map(([name, value]) => `${name}=${value}`);
  return entries.length ? entries.join("; ") : null;
}

async function proxy(req: NextRequest): Promise<NextResponse> {
  const action = req.nextUrl.searchParams.get("action") ?? "";
  const route = ACTION_MAP[action];

  if (!route) {
    return NextResponse.json({ error: "Unknown auth action" }, { status: 400 });
  }

  const hasAccessCookie = req.cookies.has(ACCESS_COOKIE);
  const hasRefreshCookie = req.cookies.has(REFRESH_COOKIE);

  if (action === "me" && !hasAccessCookie && !hasRefreshCookie) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "No active session.",
        },
      },
      { status: 401 }
    );
  }

  let upstream = await forwardUpstream(req, route);

  if (!upstream) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "BACKEND_UNREACHABLE",
          message: "Auth backend is unavailable.",
        },
      },
      { status: 502 }
    );
  }

  let retryCookies: string[] = [];

  if (action === "me" && upstream.status === 401 && hasRefreshCookie) {
    const refreshUpstream = await forwardUpstream(req, ACTION_MAP.refresh);

    if (refreshUpstream?.ok) {
      retryCookies =
        typeof refreshUpstream.headers.getSetCookie === "function"
          ? refreshUpstream.headers.getSetCookie()
          : refreshUpstream.headers.get("set-cookie")
            ? [refreshUpstream.headers.get("set-cookie") as string]
            : [];

      const cookieHeader = buildCookieHeader(req, retryCookies);
      const retried = await forwardUpstream(req, route, cookieHeader ?? undefined);
      if (retried) {
        upstream = retried;
      }
    }
  }

  const payload = await upstream.json().catch(() => null);
  const response = NextResponse.json(payload, { status: upstream.status });
  for (const value of retryCookies) {
    response.headers.append("set-cookie", value);
  }
  appendUpstreamCookies(response, upstream);

  return response;
}

export const GET  = proxy;
export const POST = proxy;
