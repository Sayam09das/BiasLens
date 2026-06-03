import { type NextRequest, NextResponse } from "next/server";

const BACKEND =
  process.env.NEXT_PUBLIC_API_URL ?? "https://biaslens-9wzi.onrender.com";

const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "content-length",
  "host",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
]);

function buildUpstreamUrl(req: NextRequest, path: string[]) {
  const pathname = path.join("/");
  const url = new URL(`${BACKEND}/${pathname}`);
  req.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.append(key, value);
  });
  return url;
}

function buildUpstreamHeaders(req: NextRequest) {
  const headers = new Headers();

  req.headers.forEach((value, key) => {
    const normalized = key.toLowerCase();
    if (HOP_BY_HOP_HEADERS.has(normalized)) {
      return;
    }
    headers.set(key, value);
  });

  return headers;
}

function applyUpstreamHeaders(response: NextResponse, upstream: Response) {
  upstream.headers.forEach((value, key) => {
    const normalized = key.toLowerCase();
    if (HOP_BY_HOP_HEADERS.has(normalized)) {
      return;
    }

    if (normalized === "set-cookie") {
      response.headers.append(key, value);
      return;
    }

    response.headers.set(key, value);
  });
}

async function proxy(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  const url = buildUpstreamUrl(req, path);
  const method = req.method.toUpperCase();
  const hasBody = method !== "GET" && method !== "HEAD";

  const upstream = await fetch(url, {
    method,
    headers: buildUpstreamHeaders(req),
    body: hasBody ? await req.arrayBuffer() : undefined,
  }).catch((error) => {
    console.error("[proxy] upstream error", error);
    return null;
  });

  if (!upstream) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "BACKEND_UNREACHABLE",
          message: "Backend is unavailable.",
        },
      },
      { status: 502 },
    );
  }

  const body = await upstream.arrayBuffer();
  const response = new NextResponse(body, { status: upstream.status });
  applyUpstreamHeaders(response, upstream);
  return response;
}

export const dynamic = "force-dynamic";

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const OPTIONS = proxy;
