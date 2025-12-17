import type { StripeWebhookHandler } from "@vyadove/stripe-plugin/types";
import type Stripe from "stripe";

interface CheckoutSessionEvent {
    data: {
        object: Stripe.Checkout.Session & {
            // Stripe Adaptive Pricing adds presentment_details
            presentment_details?: {
                presentment_amount?: number;
                presentment_currency?: string;
            };
        };
    };
    id: string;
}

export type CheckoutCompletedHandler = StripeWebhookHandler<CheckoutSessionEvent>;

/**
 * Handle checkout.session.completed event
 * Updates order with Stripe Adaptive Pricing presentment details
 */
export const checkoutCompleted: CheckoutCompletedHandler = async ({
    event,
    payload,
}) => {
    const { logger } = payload;
    const session = event.data.object;

    const orderId = session.metadata?.orderId;

    if (!orderId) {
        logger.info("checkout.session.completed: No orderId in metadata, skipping");
        return;
    }

    logger.info(
        `🔔 Checkout completed for Order ID: ${orderId}, Session: ${session.id}`
    );

    // Check for Stripe Adaptive Pricing presentment details
    const presentmentDetails = session.presentment_details;

    if (presentmentDetails?.presentment_currency) {
        try {
            // Update order with presentment currency info
            const result = await payload.update({
                collection: "orders",
                data: {
                    presentmentCurrency: presentmentDetails.presentment_currency,
                    presentmentAmount: presentmentDetails.presentment_amount
                        ? presentmentDetails.presentment_amount / 100 // Convert from cents
                        : undefined,
                },
                where: {
                    orderId: {
                        equals: orderId,
                    },
                },
            });

            if (result.errors.length) {
                throw new Error(result.errors[0].message);
            }

            logger.info(
                `✅ Updated order ${orderId} with presentment details: ${presentmentDetails.presentment_currency} ${presentmentDetails.presentment_amount}`
            );
        } catch (error) {
            logger.error(
                `❌ Error updating order presentment details for ${orderId}:`,
                error
            );
        }
    } else {
        logger.info(
            `ℹ️ No Adaptive Pricing presentment details for Order ${orderId} (customer paid in base currency)`
        );
    }
};
