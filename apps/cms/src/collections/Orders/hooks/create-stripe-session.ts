import type { CollectionAfterChangeHook } from "payload";
import type { Order } from "@vyadove/types";
import { z } from "zod";

import {
    createCheckoutSession,
    mapToStripeLineItems,
} from "@vyadove/stripe-plugin";

// Zod schema for validating checkoutId
const CheckoutIdSchema = z.number().int().positive();

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

    // Already has session URL (retry/idempotency scenario)
    if (doc.sessionUrl) return doc;

    try {
        // Validate checkoutId from metadata
        const checkoutIdResult = CheckoutIdSchema.safeParse(
            doc.metadata?.checkoutId
        );
        if (!checkoutIdResult.success) {
            throw new Error(
                `Invalid checkout ID: ${checkoutIdResult.error.message}`
            );
        }
        const checkoutId = checkoutIdResult.data;

        // Fetch checkout with items
        const checkout = await req.payload.findByID({
            collection: "checkout",
            id: checkoutId,
            depth: 2,
            req,
        });

        if (!checkout || !checkout.items || checkout.items.length === 0) {
            throw new Error("Cannot create Stripe session for empty checkout");
        }

        // Map checkout items to Stripe line items using utility
        const lineItems = mapToStripeLineItems(
            checkout.items,
            checkout.currency || "usd"
        );

        const shopUrl =
            process.env.NEXT_PUBLIC_SHOP_URL || "http://localhost:3020";

        // Create Stripe checkout session with idempotency key
        const session = await createCheckoutSession({
            lineItems,
            orderId: doc.orderId,
            cancelUrl: `${shopUrl}/checkout?canceled=true`,
            successUrl: `${shopUrl}/order/confirmed/${doc.orderId}`,
            idempotencyKey: `order-${doc.orderId}-checkout-${checkoutId}`,
        });

        // Update order with Stripe session info
        await req.payload.update({
            collection: "orders",
            id: doc.id,
            data: {
                stripeSessionId: session.id,
                sessionUrl: session.url,
                paymentStatus: "awaiting_payment",
            },
            req,
        });

        req.payload.logger.info(
            `Created Stripe session ${session.id} for order ${doc.orderId}`
        );

        return { ...doc, stripeSessionId: session.id, sessionUrl: session.url };
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        req.payload.logger.error(
            `Failed to create Stripe session for order ${doc.id}: ${errorMessage}`
        );

        // Mark order as failed for audit trail
        try {
            await req.payload.update({
                collection: "orders",
                id: doc.id,
                data: {
                    paymentStatus: "failed",
                    metadata: {
                        ...doc.metadata,
                        stripeError: errorMessage,
                    },
                },
                req,
            });
        } catch (updateError) {
            req.payload.logger.error(
                `Failed to mark order ${doc.id} as failed: ${updateError}`
            );
        }

        // Re-throw to signal failure to caller
        throw error;
    }
};
