export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

type SuccessEnvelope<T> = {
  success: true;
  message: string;
  data: T;
};

type ErrorEnvelope = {
  success: false;
  error?: {
    code?: string;
    message?: string;
    details?: unknown;
  };
  message?: string;
};

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://biaslens-9wzi.onrender.com";
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

function getCsrfTokenFromCookie() {
  if (typeof document === "undefined") {
    return null;
  }

  const tokenCookie = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("biaslens_csrf_token="));

  return tokenCookie ? decodeURIComponent(tokenCookie.split("=")[1] ?? "") : null;
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  const method = (options.method ?? "GET").toUpperCase();

  if (options.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (!SAFE_METHODS.has(method)) {
    const csrfToken = getCsrfTokenFromCookie();

    if (csrfToken && !headers.has("x-csrf-token")) {
      headers.set("x-csrf-token", csrfToken);
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const payload = (await response.json().catch(() => null)) as
    | SuccessEnvelope<T>
    | ErrorEnvelope
    | null;

  if (!response.ok) {
    const message =
      payload && "error" in payload && payload.error?.message
        ? payload.error.message
        : payload && "message" in payload && typeof payload.message === "string"
          ? payload.message
          : "Request failed.";

    const details = payload && "error" in payload ? payload.error?.details : undefined;
    throw new ApiError(message, response.status, details);
  }

  if (!payload || !("data" in payload)) {
    throw new ApiError("The server returned an unexpected response.", response.status);
  }

  return payload.data;
}
