import { CollectionBeforeChangeHook } from "payload";
import { Checkout } from "@vyadove/types";
import { parseCookies, generateCookie, getCookieExpiration } from "payload";

export const handleGuestSession: CollectionBeforeChangeHook<Checkout> = async ({
    data,
    req,
    operation,
}) => {
    // Only for create operations
    if (operation !== "create") {
        return data;
    }

    console.log('user : --------------- ', req.user);

    // Authenticated users: associate checkout with user
    if (req.user) {
        // Check if user already has an active checkout
        const existingCheckout = await req.payload.find({
            collection: "checkout",
            where: {
                and: [
                    { customer: { equals: req.user.id } },
                    { completed: { equals: false } },
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
    let sessionId = cookies.get("checkout-session");

    // If session exists, check for active checkout
    if (sessionId) {
        const existingCheckout = await req.payload.find({
            collection: "checkout",
            where: {
                and: [
                    { sessionId: { equals: sessionId } },
                    { completed: { equals: false } },
                ],
            },
            limit: 1,
        });

        if (existingCheckout.docs.length > 0) {
            throw new Error(
                `Active checkout already exists with ID: ${existingCheckout.docs[0].id}.           
                Please update the existing checkout instead of creating a new one.`
            );
        }
    } else {
        // Create new session for new guest
        sessionId = crypto.randomUUID();

        const checkoutCookie = generateCookie({
            name: "checkout-session",
            value: sessionId,
            // domain: '.vyadove.com',
            expires: getCookieExpiration({ seconds: 60 * 60 * 24 * 30 }),
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            returnCookieAsObject: false
        });

        const headers = new Headers({ "Set-Cookie": checkoutCookie as string });
        req.responseHeaders = headers;
    }

    data.sessionId = sessionId;
    data.status = "incomplete";
    data.currency = data.currency || "USD";

    // Calculate pricing if items exist
    if (data.items && data.items.length > 0) {
        const { calculateCheckoutPricing, applyPricingToCheckout } = await import(
            "./utils/calculate-pricing"
        );

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
