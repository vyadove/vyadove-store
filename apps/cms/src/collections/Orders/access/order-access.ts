import type { Order } from "@vyadove/types";
import type { Access, Where } from "payload";
import { parseCookies } from "payload";

import { checkRole } from "@/access/roles";
import { CHECKOUT_COOKIE_NAME } from "@/collections/checkout/utils/checkout-cookie";

export const readOrderAccess: Access<Order> = ({ req }) => {
    // Admins can read all orders
    if (checkRole(["admin"], req.user)) {
        return true;
    }

    const cookies = parseCookies(req.headers);
    const sessionId = cookies.get(CHECKOUT_COOKIE_NAME);

    // Build OR condition: sessionId match OR user match
    const conditions: Where[] = [];

    // Method 1: Cookie-based access
    if (sessionId) {
        conditions.push({ sessionId: { equals: sessionId } });
    }

    // Method 2: User-based access (authenticated users)
    if (req.user) {
        conditions.push({ user: { equals: req.user.id } });
    }

    // Method 3: orderId-based access (fallback for bookmarks/sharing)
    // orderId is UUID, effectively a secret token - safe for URL access
    const whereQuery = req.query?.where as
        | Record<string, { equals?: string }>
        | undefined;
    const orderId = whereQuery?.orderId?.equals;

    if (orderId) {
        conditions.push({ orderId: { equals: orderId } });
    }

    // No valid access method
    if (conditions.length === 0) {
        return false;
    }

    // Single condition: return directly
    if (conditions.length === 1) {
        return conditions[0];
    }

    // Multiple conditions: OR them
    return { or: conditions };
};
