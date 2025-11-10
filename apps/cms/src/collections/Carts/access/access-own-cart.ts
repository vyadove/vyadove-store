import { checkRole } from "@/access/roles";
import { parseCookies } from "payload";

export const canAccessOwnCart = ({ req }: any) => {
    if (req.user) {
        if (checkRole(["admin"], req.user)) {
            return true;
        }
    }
    const cookies = parseCookies(req.headers);

    const cartId = cookies.get("cart-session");

    if (!cartId) {
        return false;
    }

    return {
        sessionId: {
            equals: cartId,
        },
    };
};
