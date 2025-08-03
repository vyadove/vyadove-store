import type { BeforeChangeHook } from "@/admin/types";
import { CheckoutSession } from "@shopnex/types";

import { generateCookie, getCookieExpiration, mergeHeaders } from "payload";

export const checkoutSessionHook: BeforeChangeHook<CheckoutSession> = ({
    data,
    operation,
    req,
}) => {
    if (operation !== "create") {
        return;
    }

    const sessionId = crypto.randomUUID();

    const checkoutCookie = generateCookie({
        name: "checkout-session",
        expires: getCookieExpiration({ seconds: 60 * 60 * 24 * 30 }),
        path: "/",
        returnCookieAsObject: false,
        value: sessionId,
    });

    data.sessionId = sessionId;

    const newHeaders = new Headers({
        "Set-Cookie": checkoutCookie as string,
    });

    req.responseHeaders = req.responseHeaders
        ? mergeHeaders(req.responseHeaders, newHeaders)
        : newHeaders;
};
