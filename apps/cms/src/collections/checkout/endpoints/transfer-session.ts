import { Endpoint, parseCookies } from "payload";
import type { Checkout } from "@vyadove/types";

import {
    CHECKOUT_COOKIE_NAME,
    createCheckoutCookieHeaders,
} from "../utils/checkout-cookie";

/**
 * POST /api/checkout/transfer-session
 *
 * Transfers a guest checkout to an authenticated user.
 * Called after login/signup to link guest checkout with user account.
 *
 * Flow:
 * 1. Require authenticated user
 * 2. Get sessionId from checkout-session cookie
 * 3. Find guest checkout by sessionId (customer = null)
 * 4. Find user's existing incomplete checkout
 * 5. Merge if both exist, transfer if only guest exists
 */
export const transferSessionEndpoint: Endpoint = {
    path: "/transfer-session",
    method: "post",
    handler: async (req) => {
        const logger = req.payload.logger;

        // 1. Require authenticated user
        if (!req.user) {
            return Response.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        const userId = req.user.id;

        // 2. Get sessionId from cookie
        const cookies = parseCookies(req.headers);
        const sessionId = cookies.get(CHECKOUT_COOKIE_NAME);

        if (!sessionId) {
            // No guest session to transfer
            return Response.json({
                transferred: false,
                reason: "no_guest_session",
            });
        }

        try {
            // 3. Find guest checkout by sessionId (where customer is null)
            const guestCheckoutResult = await req.payload.find({
                collection: "checkout",
                where: {
                    and: [
                        { sessionId: { equals: sessionId } },
                        { customer: { equals: null } },
                        { status: { equals: "incomplete" } },
                    ],
                },
                limit: 1,
                depth: 0,
            });

            const guestCheckout = guestCheckoutResult.docs[0] as
                | Checkout
                | undefined;

            // 4. Find user's existing incomplete checkout
            const userCheckoutResult = await req.payload.find({
                collection: "checkout",
                where: {
                    and: [
                        { customer: { equals: userId } },
                        { status: { equals: "incomplete" } },
                    ],
                },
                limit: 1,
                depth: 0,
            });

            const userCheckout = userCheckoutResult.docs[0] as
                | Checkout
                | undefined;

            // 5. Handle transfer scenarios
            let responseHeaders: Headers | undefined;

            if (guestCheckout && !userCheckout) {
                // Guest only: transfer ownership to user
                await req.payload.update({
                    collection: "checkout",
                    id: guestCheckout.id,
                    data: {
                        customer: userId,
                    },
                    req,
                });

                logger.info(
                    `Transferred guest checkout ${guestCheckout.id} to user ${userId}`
                );

                return Response.json({
                    transferred: true,
                    checkoutId: guestCheckout.id,
                    action: "transferred",
                });
            }

            if (!guestCheckout && userCheckout) {
                // User only: update cookie to point to user's checkout
                responseHeaders = createCheckoutCookieHeaders(
                    userCheckout.sessionId
                );

                logger.info(
                    `Updated cookie to user's existing checkout ${userCheckout.id}`
                );

                return new Response(
                    JSON.stringify({
                        transferred: false,
                        checkoutId: userCheckout.id,
                        action: "cookie_updated",
                    }),
                    {
                        status: 200,
                        headers: responseHeaders,
                    }
                );
            }

            if (guestCheckout && userCheckout) {
                // Both exist: merge guest items into user's checkout
                const mergedItems = mergeCheckoutItems(
                    userCheckout.items || [],
                    guestCheckout.items || []
                );

                // Update user's checkout with merged items
                await req.payload.update({
                    collection: "checkout",
                    id: userCheckout.id,
                    data: {
                        items: mergedItems,
                    },
                    req,
                });

                // Delete the guest checkout
                await req.payload.delete({
                    collection: "checkout",
                    id: guestCheckout.id,
                    req,
                });

                // Update cookie to point to user's checkout
                responseHeaders = createCheckoutCookieHeaders(
                    userCheckout.sessionId
                );

                logger.info(
                    `Merged guest checkout ${guestCheckout.id} into user checkout ${userCheckout.id}, deleted guest`
                );

                return new Response(
                    JSON.stringify({
                        transferred: true,
                        checkoutId: userCheckout.id,
                        action: "merged",
                        itemsMerged: guestCheckout.items?.length || 0,
                    }),
                    {
                        status: 200,
                        headers: responseHeaders,
                    }
                );
            }

            // Neither exists
            return Response.json({
                transferred: false,
                reason: "no_checkout_found",
            });
        } catch (error) {
            logger.error(error, "Error transferring checkout session");
            return Response.json(
                { error: "Failed to transfer session" },
                { status: 500 }
            );
        }
    },
};

/**
 * Merge items from guest checkout into user's checkout.
 * For duplicate product+variant combinations, add quantities.
 */
function mergeCheckoutItems(
    userItems: Checkout["items"],
    guestItems: Checkout["items"]
): Checkout["items"] {
    if (!guestItems || guestItems.length === 0) {
        return userItems || [];
    }

    const merged = [...(userItems || [])];

    for (const guestItem of guestItems) {
        const productId =
            typeof guestItem.product === "object"
                ? guestItem.product?.id
                : guestItem.product;

        const existingIndex = merged.findIndex((item) => {
            const itemProductId =
                typeof item.product === "object"
                    ? item.product?.id
                    : item.product;
            return (
                itemProductId === productId &&
                item.variantId === guestItem.variantId
            );
        });

        if (existingIndex >= 0) {
            // Update quantity for existing item
            const existing = merged[existingIndex];
            merged[existingIndex] = {
                ...existing,
                quantity: (existing.quantity || 1) + (guestItem.quantity || 1),
            };
        } else {
            // Add new item
            merged.push({ ...guestItem });
        }
    }

    return merged;
}
