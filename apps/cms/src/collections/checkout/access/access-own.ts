import { checkRole } from "@/access/roles";
import { Access, parseCookies, Where } from "payload";

import { CHECKOUT_COOKIE_NAME } from "../utils/checkout-cookie";

export const canAccessOwnCheckout: Access = ({ req }) => {
    // Admins: full access
    if (req.user && checkRole(["admin"], req.user)) {
        return true;
    }

    const cookies = parseCookies(req.headers);
    const sessionId = cookies.get(CHECKOUT_COOKIE_NAME);

    // Build OR condition: sessionId match OR customer match
    const conditions: Where[] = [];

    if (sessionId) {
        conditions.push({ sessionId: { equals: sessionId } });
    }

    if (req.user) {
        conditions.push({ customer: { equals: req.user.id } });
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
