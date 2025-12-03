import type { Order } from "@vyadove/types";
import { Access, parseCookies, Where } from "payload";

import { checkRole } from "@/access/roles";

export const readOrderAccess: Access<Order> = ({ req }) => {
    if (checkRole(["admin"], req.user)) {
        return true;
    }

    const cookies = parseCookies(req.headers);
    const sessionId = cookies.get("checkout-session");

    if (!sessionId) {
        return false;
    }

    return {
        sessionId: {
            equals: sessionId,
        },
    };
};
