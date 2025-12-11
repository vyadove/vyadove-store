import type { Order } from "@vyadove/types";
import type { Access, Where } from "payload";
import { parseCookies } from "payload";

import { checkRole } from "@/access/roles";

export const readOrderAccess: Access<Order> = ({ req }) => {
    // Admins can read all orders
    if (checkRole(["admin"], req.user)) {
        return true;
    }

    // Method 1: Cookie-based access (primary)
    const cookies = parseCookies(req.headers);
    const sessionId = cookies.get("checkout-session");

    if (sessionId) {
        return {
            sessionId: {
                equals: sessionId,
            },
        };
    }

    // Method 2: orderId-based access (fallback for bookmarks/sharing)
    // orderId is UUID, effectively a secret token - safe for URL access
    const whereQuery = req.query?.where as
        | Record<string, { equals?: string }>
        | undefined;
    const orderId = whereQuery?.orderId?.equals;

    if (orderId) {
        return {
            orderId: {
                equals: orderId,
            },
        } as any;
    }

    return false;
};
