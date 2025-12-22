import type { Payload } from "payload";
import type { Order } from "@vyadove/types";
import { sendEmail } from "@/utils";

interface OrderWithGiftInfo {
    giftMessage?: Order["giftMessage"];
    shippingAddress?: Order["shippingAddress"];
}

/**
 * Fetch order data needed for emails
 */
async function fetchOrderForEmail(
    payload: Payload,
    orderId: string
): Promise<OrderWithGiftInfo | null> {
    try {
        const orders = await payload.find({
            collection: "orders",
            where: { orderId: { equals: orderId } },
            limit: 1,
        });
        return orders.docs[0] || null;
    } catch (err) {
        console.error("Failed to fetch order:", err);
        return null;
    }
}

/**
 * Send order confirmation email to buyer
 * Also sends gift delivery email to recipient if gift message is enabled
 */
export const sendOrderConfirmationEmail = async (
    payload: Payload,
    email: string,
    orderId: string
): Promise<void> => {
    const order = await fetchOrderForEmail(payload, orderId);

    // Send confirmation to buyer
    await sendEmail({
        payload,
        to: email,
        type: "order_confirmation",
        data: { orderId, giftMessage: order?.giftMessage },
    });

    // Send gift delivery email to recipient if enabled and different email
    if (order?.giftMessage?.enabled && order?.shippingAddress) {
        const recipientEmail =
            typeof order.shippingAddress === "object"
                ? (order.shippingAddress as { email?: string })?.email
                : undefined;

        if (recipientEmail && recipientEmail !== email) {
            await sendEmail({
                payload,
                to: recipientEmail,
                type: "gift_delivery",
                data: { orderId, giftMessage: order.giftMessage },
            });
        }
    }
};

/**
 * Send order cancellation email
 */
export const sendOrderCancellationEmail = async (
    payload: Payload,
    email: string,
    orderId: string
): Promise<void> => {
    await sendEmail({
        payload,
        to: email,
        type: "order_cancellation",
        data: { orderId },
    });
};

/**
 * Send payment failure email with retry link
 */
export const sendPaymentFailedEmail = async (
    payload: Payload,
    email: string,
    orderId: string,
    retryUrl: string
): Promise<void> => {
    await sendEmail({
        payload,
        to: email,
        type: "payment_failed",
        data: { orderId, retryUrl },
    });
};

/**
 * Send order shipped email
 */
export const sendOrderShippedEmail = async (
    payload: Payload,
    email: string,
    orderId: string,
    trackingUrl?: string
): Promise<void> => {
    await sendEmail({
        payload,
        to: email,
        type: "order_shipped",
        data: { orderId, trackingUrl: trackingUrl || "" },
    });
};

/**
 * Send order delivered email
 */
export const sendOrderDeliveredEmail = async (
    payload: Payload,
    email: string,
    orderId: string
): Promise<void> => {
    await sendEmail({
        payload,
        to: email,
        type: "order_delivered",
        data: { orderId },
    });
};
