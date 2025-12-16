import { CollectionBeforeChangeHook, parseCookies } from "payload";
import { Checkout } from "@vyadove/types";

import {
    CHECKOUT_COOKIE_NAME,
    createCheckoutCookieHeaders,
} from "../utils/checkout-cookie";

export const handleGuestSession: CollectionBeforeChangeHook<Checkout> = async ({
    data,
    req,
    operation,
}) => {
    // Only for create operations
    if (operation !== "create") {
        return data;
    }

    // Authenticated users: associate checkout with user
    if (req.user) {
        // Check if user already has an active checkout
        const existingCheckout = await req.payload.find({
            collection: "checkout",
            where: {
                and: [
                    { customer: { equals: req.user.id } },
                    { status: { equals: "incomplete" } },
                ],
            },
            limit: 1,
        });

        if (existingCheckout.docs.length > 0) {
            throw new Error(
                `create - Active checkout already exists with ID: ${existingCheckout.docs[0].id}.
                  Please update the existing checkout instead of creating a new one.`
            );
        }

        data.customer = req.user.id;
        return data;
    }

    // Guest flow: Check for existing session
    const cookies = parseCookies(req.headers);
    let sessionId = cookies.get(CHECKOUT_COOKIE_NAME);

    // Helper to set session cookie on response
    const setSessionCookie = (newSessionId: string) => {
        req.responseHeaders = createCheckoutCookieHeaders(newSessionId);
    };

    // If session exists, check if sessionId is already used
    if (sessionId) {
        const existingCheckout = await req.payload.find({
            collection: "checkout",
            where: { sessionId: { equals: sessionId } },
            limit: 1,
        });

        if (existingCheckout.docs.length > 0) {
            const checkout = existingCheckout.docs[0];

            if (checkout.status === "incomplete") {
                // Active checkout exists - user should update, not create
                throw new Error(
                    `Active checkout already exists with ID: ${checkout.id}. Please update the existing checkout instead of creating a new one.`
                );
            }

            // SessionId used by completed/expired checkout - generate new one
            sessionId = crypto.randomUUID();
            setSessionCookie(sessionId);
        }
    } else {
        // No session cookie - create new session for new guest
        sessionId = crypto.randomUUID();
        setSessionCookie(sessionId);
    }

    data.sessionId = sessionId;
    data.status = "incomplete";
    data.currency = data.currency || "USD";

    // Calculate pricing if items exist
    if (data.items && data.items.length > 0) {
        const { calculateCheckoutPricing, applyPricingToCheckout } =
            await import("./utils/calculate-pricing");

        const pricing = await calculateCheckoutPricing(req.payload, data, {
            fetchPrices: true,
        });

        applyPricingToCheckout(data, pricing);
    } else {
        // No items - initialize with 0
        data.subtotal = 0;
        data.total = 0;
    }

    return data;
};
