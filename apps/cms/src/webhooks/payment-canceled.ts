import type { PaymentCanceledHandler } from "@/types/webhooks";
import {
    sendOrderCancellationEmail,
    sendPaymentFailedEmail,
} from "./payment-handlers";

/**
 * This webhook will run whenever a payment intent is canceled
 */
export const paymentCanceled: PaymentCanceledHandler = async ({
    event,
    payload,
}) => {
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
        // Find the order to get checkout ID for retry URL
        const existingOrders = await payload.find({
            collection: "orders",
            where: { orderId: { equals: orderId } },
            limit: 1,
        });

        const existingOrder = existingOrders.docs[0];
        const checkoutId =
            typeof existingOrder?.checkout === "object"
                ? existingOrder.checkout.id
                : existingOrder?.checkout;

        // Update order status in Payload CMS
        const result = await payload.update({
            collection: "orders",
            data: {
                orderStatus: "canceled",
                paymentStatus: "failed",
            },
            where: {
                orderId: {
                    equals: orderId,
                },
            },
        });

        logger.info(`✅ Payment canceled for Order ID: ${orderId}`, result);

        // Send cancellation + failure email with retry link
        if (customerEmail) {
            await sendOrderCancellationEmail(payload, customerEmail, orderId);

            // Send failure email with a retry link if checkout exists
            if (checkoutId) {
                const shopUrl =
                    process.env.NEXT_PUBLIC_STOREFRONT_URL ||
                    "http://localhost:3020";
                const retryUrl = `${shopUrl}/checkout?retry=${checkoutId}`;
                await sendPaymentFailedEmail(
                    payload,
                    customerEmail,
                    orderId,
                    retryUrl
                );
            }
        }
    } catch (error) {
        logger.error("❌ Error updating order status:", error);
    }
};
