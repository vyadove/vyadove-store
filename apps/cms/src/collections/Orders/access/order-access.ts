import type { Order } from "@shopnex/types";
import type { Access } from "payload";

import { checkRole } from "@/access/roles";

export const readOrderAccess: Access<Order> = ({ req }) => {
    if (checkRole(["admin"], req.user)) {
        return true;
    }
    return {
        sessionId: (req.query?.where as any)?.sessionId,
    };
};
