import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

const AUTH_COOKIE_NAME = "weather_auth_token";

const PROTECTED_ROUTES = ["/dashboard"];
const PROTECTED_API_ROUTES = ["/api/weather", "/api/forecast", "/api/pollution", "/api/favorites"];
const AUTH_ROUTES = ["/signin", "/signup"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  const isValidToken = token ? verifyToken(token) !== null : false;

  // Redirect authenticated users away from auth pages
  if (isValidToken && AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Protect frontend routes
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!isValidToken) {
      const redirectUrl = new URL("/signin", request.url);
      redirectUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Protect API routes
  if (PROTECTED_API_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!isValidToken) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/signin",
    "/signup",
    "/api/weather/:path*",
    "/api/forecast/:path*",
    "/api/pollution/:path*",
    "/api/favorites/:path*",
  ],
};
