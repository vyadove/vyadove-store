import { parseCookies, PayloadRequest } from "payload";
import { User } from "@shopnex/types";

export const getShopId = (req: PayloadRequest): number => {
    const shopId = parseCookies(req.headers).get("payload-tenant");
    const user = req.user as User;
    if (user?.roles?.includes("super-admin")) {
        return +(shopId || 0);
    }
    const shopIds =
        user?.shops?.map(({ shop }) => {
            if (typeof shop !== "object") {
                return;
            }
            return shop.id;
        }) || [];
    return shopIds.find((id) => id === +(shopId || 0)) || 0;
};
