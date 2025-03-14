"use server";

import type { CheckoutResult } from "../types/checkout";
import { createPendingOrder, updateOrderStatus } from "../services/orders";
import {
    createCheckoutSession,
    retrieveSession,
    mapToStripeLineItems,
} from "../services/stripe";
import type { Stripe } from "stripe";
import { getVariants } from "../services/products";
import Decimal from "decimal.js";

export async function handleCheckout(items: any[]): Promise<CheckoutResult> {
    const variantIds = items.map((item) => item.id);
    const variants = await getVariants(variantIds);
    const variantsWithQty = variants.map((variant) => ({
        ...variant,
        quantity: items.find((item) => item.id === variant.id)?.quantity || 0,
    }));

    const total = variantsWithQty.reduce(
        (sum, variant) =>
            sum.plus(new Decimal(variant.price).times(variant.quantity)),
        new Decimal(0)
    );
    const orderItems = variantsWithQty.map((variant) => ({
        product: variant.product,
        variant: {
            variantId: variant.vid,
            name: variant.options.map((opt: any) => opt.value).join(" / "),
            price: variant.price,
        },
        quantity: variant.quantity,
        totalPrice: +total,
    }));

    try {
        const orderId = `ORD-${Date.now().toString()}`;
        const lineItems = mapToStripeLineItems(variantsWithQty);

        const session = await createCheckoutSession(lineItems, orderId);

        if (!session?.url || !session?.id) {
            throw new Error("Failed to create checkout session");
        }

        await createPendingOrder(orderItems, session.id, +total, orderId);

        return {
            url: session.url,
            sessionId: session.id,
        };
    } catch (error) {
        console.error("Stripe Checkout Error:", error);

        const errorMessage =
            error instanceof Error
                ? error.message
                : "An unexpected error occurred during checkout";

        return {
            error: `Checkout failed: ${errorMessage}`,
        };
    }
}

// Handle webhook events from Stripe
export async function handleStripeWebhook(event: Stripe.Event): Promise<void> {
    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;
                await updateOrderStatus(session.id, "completed");
                break;
            }
            case "checkout.session.expired": {
                const session = event.data.object as Stripe.Checkout.Session;
                await updateOrderStatus(session.id, "cancelled");
                break;
            }
            case "payment_intent.payment_failed": {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                const session = await retrieveSession(
                    paymentIntent.metadata?.checkout_session_id as string
                );
                await updateOrderStatus(session.id, "failed");
                break;
            }
        }
    } catch (error) {
        console.error("Error handling webhook:", error);
        throw error;
    }
}
