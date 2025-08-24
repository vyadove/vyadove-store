import { rateLimitGuard } from "@/utils/rate-limit-guard";
import {
    Endpoint,
    generateCookie,
    getCookieExpiration,
    mergeHeaders,
    parseCookies,
    PayloadRequest,
} from "payload";

const getCartBySessionId = async (req: PayloadRequest) => {
    const cartSessionId = parseCookies(req.headers).get("cart-session");

    const cart = await req.payload.find({
        collection: "carts",
        where: {
            sessionId: {
                equals: cartSessionId,
            },
        },
        req,
    });

    return cart.docs[0];
};

export const createCheckoutSession: Endpoint = {
    method: "post",
    path: "/session",
    handler: async (req) => {
        const guard = await rateLimitGuard(req);

        if (!guard.ok) {
            return guard.response;
        }
        const sessionId = crypto.randomUUID();

        const cart = await getCartBySessionId(req);
        const { shipping, payment, shippingAddress, billingAddress } =
            await req.json?.();

        const checkoutCookie = generateCookie({
            name: "checkout-session",
            expires: getCookieExpiration({ seconds: 60 * 60 * 24 * 30 }),
            path: "/",
            returnCookieAsObject: false,
            value: sessionId,
        });

        const newHeaders = new Headers({
            "Set-Cookie": checkoutCookie as string,
        });

        req.responseHeaders = req.responseHeaders
            ? mergeHeaders(req.responseHeaders, newHeaders)
            : newHeaders;

        const checkoutSession = await req.payload.create({
            collection: "checkout-sessions",
            data: {
                sessionId,
                cart: cart.id,
                shipping,
                payment,
                shippingAddress: shippingAddress,
                billingAddress: billingAddress,
            },
            req,
        });

        return Response.json(
            {
                success: true,
                checkoutSession,
            },
            {
                headers: {
                    "Set-Cookie": checkoutCookie as string,
                },
            }
        );
    },
};

export const updateCheckoutSession: Endpoint = {
    method: "patch",
    path: "/session/:sessionId",
    handler: async (req) => {
        const guard = await rateLimitGuard(req);

        if (!guard.ok) {
            return guard.response;
        }
        const { shipping, payment, shippingAddress } = await req.json?.();
        const sessionId = req.routeParams?.sessionId;
        const cart = await getCartBySessionId(req);

        await req.payload.update({
            collection: "checkout-sessions",
            where: {
                sessionId: {
                    equals: sessionId,
                },
            },
            data: {
                cart: cart.id,
                shipping,
                payment,
                shippingAddress: shippingAddress,
            },
            req,
        });

        return Response.json({
            success: true,
        });
    },
};
