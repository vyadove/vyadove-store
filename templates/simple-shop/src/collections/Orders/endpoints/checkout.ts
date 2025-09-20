import type { Cart, Product } from "@shopnex/types";

import { validateCartItems } from "@/utils/validate-cart-items";
import Decimal from "decimal.js";
import { type Endpoint, parseCookies } from "payload";
import { isExpandedDoc } from "@/utils/is-expanded-doc";

import { stripeCheckout } from "@shopnex/stripe-plugin";
import { manualCheckout } from "./manual-checkout";

const calculateOrderTotals = (
    cartItems: Cart["cartItems"],
    shippingCost: number
) => {
    const subtotal =
        cartItems?.reduce((sum, item) => {
            if (!isExpandedDoc<Product>(item.product)) {
                return sum;
            }
            const variant = item.product.variants.find(
                (variant) => variant.id === item.variantId
            );
            if (!variant) {
                return sum;
            }
            return sum.plus(new Decimal(variant.price).times(item.quantity));
        }, new Decimal(0)) || new Decimal(0);
    const total = subtotal.plus(new Decimal(shippingCost));

    return { subtotal: +subtotal, total: +total };
};

const providers: Record<string, (data: any) => Promise<any>> = {
    stripe: stripeCheckout,
    manual: manualCheckout,
};

export const checkoutEndpoint: Endpoint = {
    method: "post",
    path: "/checkout",
    handler: async (req) => {
        const { logger } = req.payload;
        const cookies = parseCookies(req.headers);

        try {
            const checkoutId = cookies.get("checkout-session");
            const checkoutSession = await req.payload.find({
                collection: "checkout-sessions",
                req,
                where: { sessionId: { equals: checkoutId } },
            });

            const { customer, payment, shipping, cart } =
                checkoutSession.docs[0] || {};
            if (!cart || typeof cart !== "object") {
                return Response.json(
                    { error: "Invalid cart." },
                    { status: 400 }
                );
            }

            if (typeof shipping !== "object" || typeof payment !== "object") {
                return Response.json(
                    { error: "Invalid shipping or payment." },
                    { status: 400 }
                );
            }

            if (!payment?.providers?.[0]?.blockType) {
                return Response.json(
                    { error: "Invalid payment method." },
                    { status: 400 }
                );
            }

            const { cartItems } = cart;
            if (!validateCartItems(cartItems, logger)) {
                return Response.json(
                    { error: "Invalid cart items." },
                    { status: 400 }
                );
            }

            const { subtotal, total } = calculateOrderTotals(
                cartItems,
                shipping?.shippingProvider?.[0]?.baseRate || 0
            );

            const paymentMethod = payment.providers[0].blockType;
            const handler = providers[paymentMethod];

            if (!handler) {
                logger.error(`Unsupported provider: ${paymentMethod}`);
                return Response.json(
                    { error: "Unsupported provider." },
                    { status: 400 }
                );
            }

            const orderId = `ORD-${Date.now()}`;

            const result = await handler({
                req,
                orderId,
                cart,
                customer,
                payment,
                shipping,
                total,
                subtotal,
            });

            return Response.json({ redirectUrl: result.redirectUrl });
        } catch (error) {
            logger.error(error, "Checkout error");
            return Response.json(
                {
                    error:
                        error instanceof Error
                            ? error.message
                            : "Checkout failed.",
                },
                { status: 500 }
            );
        }
    },
};
