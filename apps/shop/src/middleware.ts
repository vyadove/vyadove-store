import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { decrypt, updateSession } from "./lib/auth";

const ProtectedPaths = ["/orders", "/account"];

/**
 * Map country codes to default currencies
 * Priority: Vercel's x-vercel-ip-country header
 */
const COUNTRY_TO_CURRENCY: Record<string, string> = {
  // USD countries
  US: "USD",
  // EUR countries (Eurozone)
  DE: "EUR",
  FR: "EUR",
  IT: "EUR",
  ES: "EUR",
  NL: "EUR",
  BE: "EUR",
  AT: "EUR",
  PT: "EUR",
  IE: "EUR",
  FI: "EUR",
  GR: "EUR",
  SK: "EUR",
  SI: "EUR",
  LV: "EUR",
  LT: "EUR",
  EE: "EUR",
  CY: "EUR",
  MT: "EUR",
  LU: "EUR",
  // GBP countries
  GB: "GBP",
  // ETB countries
  ET: "ETB",
};

const DEFAULT_CURRENCY = "USD";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get country from Vercel geolocation header
  const country = request.headers.get("x-vercel-ip-country") || "";
  const detectedCurrency = COUNTRY_TO_CURRENCY[country] || DEFAULT_CURRENCY;

  // Create response with detected currency header
  let response: NextResponse;

  // Handle protected paths
  const isProtectedPath = ProtectedPaths.some((p) => pathname.startsWith(p));

  if (isProtectedPath) {
    const session = request.cookies.get("session")?.value;

    if (!session) {
      response = NextResponse.redirect(new URL("/login", request.url));
      response.headers.set("x-detected-currency", detectedCurrency);
      response.headers.set("x-detected-country", country);

      return response;
    }

    const data = await decrypt(session);

    if (!data || data.expires < Date.now()) {
      response = NextResponse.redirect(new URL("/login", request.url));
      response.headers.set("x-detected-currency", detectedCurrency);
      response.headers.set("x-detected-country", country);

      return response;
    }

    const sessionResponse = await updateSession(request);

    response = sessionResponse || NextResponse.next();
  } else {
    response = NextResponse.next();
  }

  // Set detected currency/country headers for all responses
  response.headers.set("x-detected-currency", detectedCurrency);
  response.headers.set("x-detected-country", country);

  return response;
}

export const config = {
  // Match all routes except static files and api routes
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};
