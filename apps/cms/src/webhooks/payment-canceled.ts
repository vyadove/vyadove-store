import type { PaymentCanceledHandler } from "@/types/webhooks";
import { sendOrderCancellationEmail } from "./payment-handlers";

/**
 * This webhook will run whenever a payment intent is canceled
 */
export const paymentCanceled: PaymentCanceledHandler = async ({ event, payload }) => {
    const paymentIntent = event.data.object;

    // Extract relevant details
    const orderId = paymentIntent.metadata?.orderId;
    const customerEmail =
        paymentIntent.receipt_email || paymentIntent.metadata?.email;

    const { logger } = payload;
    
    logger.info(`🔔 Received Stripe Event: ${event.id}`);

    if (!orderId) {
        logger.error("❌ Missing order ID in payment metadata");
        return;
    }

    try {
        // Update order status in Payload CMS
        const result = await payload.update({
            collection: "orders",
            data: {
                orderStatus: "canceled",
            },
            where: {
                orderId: {
                    equals: orderId,
                },
            },
        });

        logger.info(`✅ Payment canceled for Order ID: ${orderId}`, result);

        // Send cancellation email
        if (customerEmail) {
            sendOrderCancellationEmail(customerEmail, orderId, logger);
        }
    } catch (error) {
        logger.error("❌ Error updating order status:", error);
    }
};

