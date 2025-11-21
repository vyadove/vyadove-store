import type { Order } from "@vyadove/types";
import type { Access, Where } from "payload";

import { checkRole } from "@/access/roles";

export const readOrderAccess: Access<Order> = ({ req }) => {
    if (checkRole(["admin"], req.user)) {
        return true;
    }
    const orderId = (req.query?.where as Where)?.orderId || null;

    if (!orderId) {
        return false;
    }

    return {
        orderId,
    };
};
