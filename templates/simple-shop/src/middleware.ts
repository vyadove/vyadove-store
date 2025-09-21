import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Helper to extract subdomain
function getSubdomain(hostname: string): string | null {
    const hostnameWithoutPort = hostname.split(":")[0];
    const parts = hostnameWithoutPort.split(".");

    // Handle localhost and local dev
    if (hostname.includes("localhost")) {
        return parts[0];
    }

    if (parts.length >= 3 && parts[0] !== "www") return parts[0];
    if (parts.length > 3) return parts[1]; // fallback
    return null;
}

export function middleware(request: NextRequest) {
    const hostname = request.headers.get("host") || "";
    const subdomain = getSubdomain(hostname);

    // Skip if no subdomain or if it's "app"
    if (!subdomain || subdomain === "app" || subdomain === "localhost")
        return NextResponse.next();

    // Only set cookie if value is different
    const existing = request.cookies.get("shop-handle");
    if (existing?.value === subdomain) return NextResponse.next();

    const response = NextResponse.next();
    response.cookies.set("shop-handle", subdomain, {
        httpOnly: true,
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
    });

    return response;
}

export const config = {
    matcher: ["/((?!api|_next|favicon.ico).*)"],
};