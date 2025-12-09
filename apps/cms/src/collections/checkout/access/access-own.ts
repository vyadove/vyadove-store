import { checkRole } from "@/access/roles";
import { Access, parseCookies } from "payload";

export const canAccessOwnCheckout : Access = ({ req }) => {
    if (req.user) {
        if (checkRole(["admin"], req.user)) {
            return true;
        }
    }
    const cookies = parseCookies(req.headers);

    const sessionId = cookies.get("checkout-session");

    console.log('session id --- : ', sessionId);

    if (!sessionId) {
        return false;
    }

    return {
        sessionId: {
            equals: sessionId,
        },
    };
};
