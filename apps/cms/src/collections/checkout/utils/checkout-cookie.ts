import { generateCookie, getCookieExpiration } from "payload";

export const CHECKOUT_COOKIE_NAME = "checkout-session";
export const CHECKOUT_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

/**
 * Generate checkout session cookie string.
 * Centralizes cookie config for consistent behavior across all checkout operations.
 */
export function createCheckoutSessionCookie(sessionId: string): string {
    return generateCookie({
        name: CHECKOUT_COOKIE_NAME,
        value: sessionId,
        expires: getCookieExpiration({
            seconds: CHECKOUT_COOKIE_MAX_AGE_SECONDS,
        }),
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        returnCookieAsObject: false,
    }) as string;
}

/**
 * Generate cookie string to clear checkout session (expires immediately).
 */
export function clearCheckoutSessionCookie(): string {
    return generateCookie({
        name: CHECKOUT_COOKIE_NAME,
        value: "",
        expires: new Date(0),
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        returnCookieAsObject: false,
    }) as string;
}

/**
 * Create Headers object with Set-Cookie for checkout session.
 */
export function createCheckoutCookieHeaders(sessionId: string): Headers {
    return new Headers({
        "Set-Cookie": createCheckoutSessionCookie(sessionId),
    });
}

/**
 * Create Headers object to clear checkout session cookie.
 */
export function clearCheckoutCookieHeaders(): Headers {
    return new Headers({ "Set-Cookie": clearCheckoutSessionCookie() });
}
