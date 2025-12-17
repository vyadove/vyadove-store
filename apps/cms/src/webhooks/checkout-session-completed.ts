import type { CheckoutSessionCompletedHandler } from "@/types/webhooks";
import { sendOrderConfirmationEmail } from "./payment-handlers";

/**
 * This webhook runs when a Stripe Checkout Session is completed
 * Used for hosted checkout page flows
 */
export const checkoutSessionCompleted: CheckoutSessionCompletedHandler =
    async ({ event, payload }) => {
        const { logger } = payload;
        const session = event.data.object;

        // Extract orderId from session metadata
        const orderId = session.metadata?.orderId;
        const customerEmail =
            session.customer_details?.email || session.metadata?.email;

        logger.info(
            `🔔 Received checkout.session.completed: ${event.id}, Order ID: ${orderId}`
        );

        if (!orderId) {
            logger.error("❌ Missing orderId in checkout session metadata");
            return;
        }

        try {
            // Find the order
            const existingOrders = await payload.find({
                collection: "orders",
                where: { orderId: { equals: orderId } },
                limit: 1,
            });

            if (!existingOrders.docs.length) {
                logger.error(`❌ Order ${orderId} not found`);
                return;
            }

            const existingOrder = existingOrders.docs[0];

            // Idempotency check: Skip if already paid with same stripeSessionId
            if (
                existingOrder.paymentStatus === "paid" &&
                existingOrder.stripeSessionId === session.id
            ) {
                logger.info(
                    `⏭️ Order ${orderId} already marked as paid, skipping duplicate webhook`
                );
                return;
            }

            // Update order with payment success
            const result = await payload.update({
                collection: "orders",
                data: {
                    orderStatus: "processing",
                    paymentStatus: "paid",
                    paymentIntentId: session.payment_intent as string,
                    updatedAt: new Date().toISOString(),
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
                `✅ Checkout session completed for Order ID: ${orderId}`
            );

            // Send confirmation email
            if (customerEmail) {
                await sendOrderConfirmationEmail(
                    payload,
                    customerEmail,
                    orderId
                );
            }
        } catch (error) {
            logger.error(
                "❌ Error handling checkout.session.completed:",
                error
            );
        }
    };
