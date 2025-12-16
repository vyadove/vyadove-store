import type { FieldAccessArgs } from "@/admin/types";
import type { User } from "@vyadove/types";
import { Access, AccessArgs, parseCookies } from "payload";

import { CHECKOUT_COOKIE_NAME } from "@/collections/checkout/utils/checkout-cookie";

export const checkRole = (roles: User["roles"] = [], user?: null | User) =>
    !!user?.roles?.some((role) => roles?.includes(role));

type isAdmin = (args: AccessArgs<User> | FieldAccessArgs<User>) => boolean;

export const adminPluginAccess: Access = ({ req }) => {
    const shopHandle = req.headers.get("x-payload-sdk-token");
    req.user = shopHandle
        ? JSON.parse(req.payload.decrypt(shopHandle!))
        : req.user;
    return admins({ req });
};

export const admins: isAdmin = ({ req: { user } }) => {
    return checkRole(["admin"], user);
};

export const anyone: Access = () => {
    return true;
};

export const adminOrHaveSessionCookie: Access = ({ req }) => {
    // Authenticated users (including admins) can create orders
    if (req.user) {
        return true;
    }

    // Guest users need checkout-session cookie
    const cookies = parseCookies(req.headers);
    const checkoutId = cookies.get(CHECKOUT_COOKIE_NAME);

    return !!checkoutId;
};

export const adminsOrSelf: Access = ({ req: { user } }) => {
    if (user) {
        if (checkRole(["admin"], user)) {
            return true;
        }

        return {
            id: {
                equals: user.id,
            },
        };
    }

    return false;
};
