import type { Payload } from "payload";
import { sendEmail } from "@/utils";

/**
 * Send order confirmation email
 */
export const sendOrderConfirmationEmail = async (
    payload: Payload,
    email: string,
    orderId: string
): Promise<void> => {
    await sendEmail({
        payload,
        to: email,
        type: "order_confirmation",
        data: { orderId },
    });
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
