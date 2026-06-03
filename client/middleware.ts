import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const ACCESS_COOKIE = "biaslens_access_token";
const REFRESH_COOKIE = "biaslens_refresh_token";
const CSRF_COOKIE = "biaslens_csrf_token";

const protectedPrefixes = ["/dashboard"];
const authPages = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/verify-email-sent",
  "/resend-verification",
];

function hasAuthSession(request: NextRequest): boolean {
  return request.cookies.has(ACCESS_COOKIE) || request.cookies.has(REFRESH_COOKIE);
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isAuthenticated = hasAuthSession(request);
  const existingCsrf = request.cookies.get(CSRF_COOKIE)?.value;
  const csrfToken = existingCsrf ?? crypto.randomUUID().replace(/-/g, "");

  if (protectedPrefixes.some((prefix) => pathname.startsWith(prefix)) && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    const redirectTo = `${pathname}${search}`;
    if (redirectTo && redirectTo !== "/dashboard") {
      loginUrl.searchParams.set("next", redirectTo);
    }
    const response = NextResponse.redirect(loginUrl);
    if (!existingCsrf) {
      response.cookies.set(CSRF_COOKIE, csrfToken, {
        httpOnly: false,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });
    }
    return response;
  }

  if (authPages.some((route) => pathname === route) && isAuthenticated) {
    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    if (!existingCsrf) {
      response.cookies.set(CSRF_COOKIE, csrfToken, {
        httpOnly: false,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });
    }
    return response;
  }

  const response = NextResponse.next();
  if (!existingCsrf) {
    response.cookies.set(CSRF_COOKIE, csrfToken, {
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
  }
  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register", "/forgot-password", "/reset-password", "/verify-email", "/verify-email-sent", "/resend-verification"],
};
