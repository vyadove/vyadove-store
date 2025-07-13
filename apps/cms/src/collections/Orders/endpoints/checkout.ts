import type { Cart, Order } from "@shopnex/types";

import { validateCartItems } from "@/utils/validate-cart-items";
import Decimal from "decimal.js";
import { type Endpoint, parseCookies, type PayloadRequest } from "payload";
import Stripe from "stripe";

interface CartItem {
    id: string;
    quantity: number;
}

interface CheckoutRequest {
    cartItems: CartItem[];
    customer: any;
    paymentMethod: "manualProvider" | "stripe";
    shippingMethod: {
        cost: number;
    };
}

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
        if (req.method === "OPTIONS") {
            return new Response(null, {
                headers: {
                    "Access-Control-Allow-Credentials": "true",
                    "Access-Control-Allow-Headers":
                        "Content-Type, x-shop-handle, x-shop-id",
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                    "Access-Control-Allow-Origin":
                        process.env.NEXT_PUBLIC_STOREFRONT_URL ||
                        "http://localhost:3020",
                },
                status: 204,
            });
        }
        const { logger } = req.payload;
        const cookies = parseCookies(req.headers);

        const cartSessionId = cookies.get("cart-session");
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
            const cart = await req.payload.find({
                collection: "carts",
                req,
                where: {
                    id: {
                        equals: cartId,
                    },
                    completed: {
                        equals: false,
                    },
                },
            });

            if (!cart.docs.length) {
                logger.error("Checkout failed - Invalid cart");
                return Response.json(
                    { error: "Invalid cart." },
                    { status: 400 }
                );
            }
            const { cartItems } = cart.docs[0];

            const body: CheckoutRequest = await req.json();
            const { customer, paymentMethod, shippingMethod } = body;

            logger.info("Processing checkout", {
                customerId: customer?.id,
                itemCount: cartItems?.length,
                paymentMethod,
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
                shippingMethod?.cost || 0
            );

            logger.info("Calculated order totals", {
                subtotal,
                total,
            });

            if (paymentMethod === "manualProvider") {
                const sessionId = `SID-${crypto.randomUUID()}`;
                const order = await createOrder(req, {
                    cart: cartId,
                    currency: "usd",
                    orderId,
                    orderStatus: "shipped",
                    paymentGateway: "manual",
                    paymentMethod,
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

            return Response.json(
                {
                    redirectUrl: order.sessionUrl,
                },
                {
                    headers: {
                        "Access-Control-Allow-Credentials": "true",
                        "Access-Control-Allow-Headers":
                            "Content-Type, x-shop-handle, x-shop-id",
                        "Access-Control-Allow-Methods": "POST, OPTIONS",
                        "Access-Control-Allow-Origin":
                            process.env.NEXT_PUBLIC_STOREFRONT_URL ||
                            "http://localhost:3020",
                    },
                }
            );
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
