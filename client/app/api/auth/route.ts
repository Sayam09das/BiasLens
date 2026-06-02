/**
 * /api/auth — thin proxy to the BiasLens backend auth endpoints.
 *
 * POST /api/auth?action=login
 * POST /api/auth?action=register
 * POST /api/auth?action=logout
 * POST /api/auth?action=refresh
 * GET  /api/auth?action=me
 */

import { type NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
const ACCESS_COOKIE = "biaslens_access_token";
const REFRESH_COOKIE = "biaslens_refresh_token";

const ACTION_MAP: Record<string, { path: string; method: string }> = {
  login:    { path: "/v1/auth/login",   method: "POST" },
  register: { path: "/v1/auth/register", method: "POST" },
  logout:   { path: "/v1/auth/logout",  method: "POST" },
  refresh:  { path: "/v1/auth/refresh", method: "POST" },
  me:       { path: "/v1/auth/me",      method: "GET"  },
};

async function proxy(req: NextRequest): Promise<NextResponse> {
  const action = req.nextUrl.searchParams.get("action") ?? "";
  const route = ACTION_MAP[action];

  if (!route) {
    return NextResponse.json({ error: "Unknown auth action" }, { status: 400 });
  }

  const isGet = route.method === "GET";
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

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const cookie = req.headers.get("cookie");
  if (cookie) headers["cookie"] = cookie;

  const csrfToken = req.headers.get("x-csrf-token");
  if (csrfToken) headers["x-csrf-token"] = csrfToken;

  const upstream = await fetch(`${BACKEND}${route.path}`, {
    method: route.method,
    headers,
    body: isGet ? undefined : await req.text(),
    credentials: "include",
  }).catch((err) => {
    console.error("[auth-proxy] upstream error", err);
    return null;
  });

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
