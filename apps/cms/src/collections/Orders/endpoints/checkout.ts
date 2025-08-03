import type { Cart, Order } from "@shopnex/types";

import { validateCartItems } from "@/utils/validate-cart-items";
import Decimal from "decimal.js";
import { type Endpoint, parseCookies, type PayloadRequest } from "payload";
import Stripe from "stripe";

const calculateOrderTotals = (
    cartItems: Cart["cartItems"],
    shippingCost: number
) => {
    const subtotal =
        cartItems?.reduce((sum, item) => {
            if (typeof item.product === "number") {
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

export const createCheckoutSession = async (
    lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
    orderId: string
) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
        apiVersion: "2025-02-24.acacia",
    });
    return stripe.checkout.sessions.create({
        cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/cart?canceled=true`,
        expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // Expires in 30 minutes
        line_items: lineItems,
        metadata: {
            cartItemCount: lineItems.length.toString(),
            orderId,
        },
        mode: "payment",
        payment_intent_data: {
            metadata: {
                orderId,
            },
            setup_future_usage: "off_session",
        },
        // payment_method_types: ["card"],
        success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/order/confirmed/{CHECKOUT_SESSION_ID}`,
    });
};

const createOrder = async (
    req: PayloadRequest,
    orderData: Omit<Order, "createdAt" | "id" | "updatedAt">
) => {
    return await req.payload.create({
        collection: "orders",
        data: orderData,
        req,
    });
};

export const checkoutEndpoint: Endpoint = {
    handler: async (req) => {
        const { logger } = req.payload;
        const cookies = parseCookies(req.headers);

        const cartSessionId = cookies.get("cart-session");
        const checkoutId = cookies.get("checkout-session");
        const cartId = cartSessionId ? +cartSessionId : null;
        const orderId = `ORD-${Date.now().toString()}`;
        try {
            if (!req.json) {
                logger.error("Checkout failed - Invalid request body");
                return Response.json(
                    { error: "Invalid request body." },
                    { status: 400 }
                );
            }

            const checkoutSession = await req.payload.find({
                collection: "checkout-sessions",
                req,
                where: {
                    sessionId: {
                        equals: checkoutId,
                    },
                },
            });
            const { customer, payment, shipping, cart } =
                checkoutSession.docs[0];

            if (!cart || typeof cart !== "object") {
                logger.error("Checkout failed - Invalid cart");
                return Response.json(
                    { error: "Invalid cart." },
                    { status: 400 }
                );
            }

            if (typeof shipping !== "object" || typeof payment !== "object") {
                logger.error("Checkout failed - Invalid customer or payment");
                return Response.json(
                    { error: "Invalid shipping or payment." },
                    { status: 400 }
                );
            }

            const { cartItems } = cart;

            logger.info("Processing checkout", {
                customerId: customer?.id,
                itemCount: cartItems?.length,
                payment,
            });

            const isValid = validateCartItems(cartItems, logger);
            if (!isValid) {
                logger.error("Checkout failed - Invalid cart items");
                return Response.json(
                    { error: "Invalid cart items." },
                    { status: 400 }
                );
            }

            const { subtotal, total } = calculateOrderTotals(
                cartItems,
                shipping?.shippingProvider?.[0]?.baseRate || 0
            );

            logger.info("Calculated order totals", {
                subtotal,
                total,
            });

            const paymentMethod = payment?.providers?.[0]?.blockType;

            if (paymentMethod === "manualProvider") {
                const sessionId = `SID-${crypto.randomUUID()}`;
                const order = await createOrder(req, {
                    cart: cartId,
                    currency: "usd",
                    orderId,
                    orderStatus: "shipped",
                    paymentMethod: payment?.providers?.[0]?.id,
                    payment: payment?.id,
                    shipping: shipping?.id,
                    paymentStatus: "paid",
                    sessionId,
                    totalAmount: total,
                });

                logger.info("Created and completed manual order", {
                    orderId: order.id,
                });

                return Response.json({
                    redirectUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}/order/confirmed/${sessionId}`,
                });
            }

            logger.info(
                `Processing ${paymentMethod} payment, orderId: ${orderId}`
            );

            const order = await createOrder(req, {
                cart: cartId,
                currency: "usd",
                orderId,
                orderStatus: "pending",
                paymentGateway: paymentMethod,
                paymentMethod,
                paymentStatus: "pending",
                totalAmount: total,
            });

            return Response.json({
                redirectUrl: order.sessionUrl,
            });
        } catch (error) {
            if (error instanceof Error) {
                logger.error("Checkout error", { error });
                return Response.json({ error: error.message }, { status: 400 });
            } else {
                logger.error("Checkout error", { error: String(error) });
                return Response.json(
                    { error: "Checkout failed." },
                    { status: 500 }
                );
            }
        }
    },
    method: "post",
    path: "/checkout",
};
