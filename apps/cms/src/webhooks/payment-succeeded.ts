import type { PaymentSucceededHandler } from "@/types/webhooks";
import { sendOrderConfirmationEmail } from "./payment-handlers";
import Stripe from "stripe";

/**
 * This webhook will run whenever a payment intent is successfully paid to create an order in Payload
 */
export const paymentSucceeded: PaymentSucceededHandler = async ({
    event,
    payload,
}) => {
    const { logger } = payload;
    const paymentIntent = event.data.object;

    // Extract relevant details
    const orderId = paymentIntent.metadata?.orderId;
    const customerEmail =
        paymentIntent.receipt_email || paymentIntent.metadata?.email;

    payload.logger.info(
        `🔔 Received Stripe Event: ${event.id}, Order ID: ${orderId}`
    );

    if (!orderId) {
        logger.error("❌ Missing order ID in payment metadata");
        return;
    }

    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
            apiVersion: "2025-02-24.acacia" as any,
        });
        const charges = await stripe.charges.list({
            payment_intent: paymentIntent.id,
        });
        const latestCharge = charges.data[0];
        const email = latestCharge.billing_details.email;

        const billingDetails = latestCharge?.billing_details;
        const shippingDetails = paymentIntent.shipping || null;

        // Transform Stripe address to Payload format
        const transformAddress = (address: any) => {
            if (!address) return undefined;
            return {
                city: address.city || undefined,
                country: address.country || undefined,
                line1: address.line1 || undefined,
                line2: address.line2 || undefined,
                postal_code: address.postal_code || undefined,
                state: address.state || undefined,
            };
        };

        const userQuery = await payload.find({
            collection: "users",
            where: {
                email: {
                    equals: email,
                },
            },
        });

        // Get the first user (assuming email is unique)
        const user = userQuery.docs[0];
        const result = await payload.update({
            collection: "orders",
            data: {
                billingAddress: billingDetails
                    ? {
                          name: billingDetails.name || undefined,
                          address: transformAddress(billingDetails.address),
                          email: billingDetails.email || undefined,
                          phone: billingDetails.phone || undefined,
                      }
                    : undefined,
                orderStatus: "processing",
                paymentIntentId: paymentIntent.id,
                paymentMethod: paymentIntent.payment_method_types.join(", "),
                paymentStatus: "paid",
                receiptUrl: latestCharge.receipt_url,
                shippingAddress: shippingDetails
                    ? {
                          name: shippingDetails.name || undefined,
                          address: transformAddress(shippingDetails.address),
                          phone: shippingDetails.phone || undefined,
                      }
                    : undefined,
                updatedAt: new Date().toISOString(),
                user: user ? user.id : null,
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

        logger.info(`✅ Payment successful for Order ID: ${orderId}`, result);

        // Send confirmation email
        if (customerEmail) {
            sendOrderConfirmationEmail(customerEmail, orderId, logger);
        }
    } catch (error) {
        logger.error("❌ Error updating order status:", error);
    }
};
