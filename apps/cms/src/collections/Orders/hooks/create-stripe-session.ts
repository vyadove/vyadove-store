import type { CollectionAfterChangeHook } from "payload";
import type { Order } from "@vyadove/types";
import * as s from "@vyadove/stripe-plugin";
import { createCheckoutSession } from "@/collections/CheckoutSessions/endpoints/checkout-session";

/**
 * Creates Stripe checkout session for orders with Stripe payment method
 * This hook runs after order creation to generate payment session
 */
export const createStripeSession: CollectionAfterChangeHook<Order> = async ({
    doc,
    req,
    operation,
}) => {
    // Only run on create operations
    if (operation !== "create") return doc;

    // Check if Stripe payment
    if (doc.paymentMethod !== "stripe") return doc;

    // Already has session URL (retry scenario)
    if (doc.sessionUrl) return doc;

    try {
        // Fetch checkout with items
        const checkout = await req.payload.findByID({
            collection: "checkout",
            id: doc.metadata?.checkoutId as number,
            depth: 2,
            req,
        });

        if (!checkout || !checkout.items || checkout.items.length === 0) {
            throw new Error("Cannot create Stripe session for empty checkout");
        }

        // Map checkout items to Stripe line items format
        const lineItems = checkout.items.map((item) => {
            const product =
                typeof item.product === "object" ? item.product : null;
            const variant = product?.variants?.find(
                (v) => v.id === item.variantId
            );

            return {
                price_data: {
                    currency: checkout.currency || "usd",
                    unit_amount: Math.round((item.unitPrice || 0) * 100), // Convert to cents
                    product_data: {
                        name: product?.title || "Product",
                        description: product?.description || "",
                        variant: variant?.id || "",
                    },
                },
                quantity: item.quantity,
            };
        });

        // Create Stripe checkout session

        throw new Error("createCheckoutSession is not implemented yet!");

        /*const shopUrl =
            process.env.NEXT_PUBLIC_SHOP_URL || "http://localhost:3020";
        const session = await createCheckoutSession({
            lineItems,
            orderId: doc.orderId,
            cancelUrl: `${shopUrl}/checkout?canceled=true`,
            successUrl: `${shopUrl}/order/confirmed/${doc.orderId}`,
        });

        // Update order with Stripe session info
        await req.payload.update({
            collection: "orders",
            id: doc.id,
            data: {
                sessionId: session.id,
                sessionUrl: session.url,
            },
            req,
        });

        req.payload.logger.info(
            `Created Stripe session ${session.id} for order ${doc.orderId}`
        );

        return { ...doc, sessionId: session.id, sessionUrl: session.url }; */
    } catch (error) {
        req.payload.logger.error(
            `Failed to create Stripe session for order ${doc.id}: ${error instanceof Error ? error.message : "Unknown error"}`
        );

        // todo -- handle failed session creation
        /* // Mark order as failed
        await req.payload.update({
            collection: "orders",
            id: doc.id,
            data: {
                orderStatus: "failed",
            },
            req,
        });*/

        return doc;
    }
};
