import { checkRole } from "@/access/roles";
import { CheckoutSession } from "@shopnex/types";
import { Access, Where } from "payload";

export const readSessionAccess: Access<CheckoutSession> = ({ req }) => {
    if (checkRole(["admin"], req.user)) {
        return true;
    }
    const session = (req.query?.where as Where)?.sessionId || null;

    if (!session) {
        return false;
    }

    return {
        sessionId: session,
    };
};

export const createSessionAccess: Access<CheckoutSession> = async ({ req }) => {
    return true;
};

export const updateSessionAccess: Access<CheckoutSession> = ({ req }) => {
    if (checkRole(["admin"], req.user)) {
        return true;
    }
    const session = (req.query?.where as Where)?.sessionId || null;

    if (!session) {
        return false;
    }

    return {
        sessionId: session,
    };
};
