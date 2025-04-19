import type { StripeWebhookHandler } from "@payloadcms/plugin-stripe/types";
import Stripe from "stripe";

/**
 * This webhook will run whenever a payment intent is successfully paid to create an order in Payload
 */
export const paymentSucceeded: StripeWebhookHandler<{
    id: string;
    data: {
        object: Stripe.PaymentIntent;
    };
}> = async ({ event, payload }) => {
    const paymentIntent = event.data.object;

    // Extract relevant details
    const orderId = paymentIntent.metadata?.orderId;
    const customerEmail =
        paymentIntent.receipt_email || paymentIntent.metadata?.email;

    console.log(`🔔 Received Stripe Event: ${event.id}, Order ID: ${orderId}`);

    if (!orderId) {
        console.error("❌ Missing order ID in payment metadata");
        return;
    }

    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
            apiVersion: "2022-08-01",
        });
        const charges = await stripe.charges.list({
            payment_intent: paymentIntent.id,
        });
        const latestCharge = charges.data[0];
        const email = latestCharge.billing_details.email;

        const billingDetails = latestCharge?.billing_details;
        const shippingDetails = paymentIntent.shipping || null;

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
            where: {
                orderId: {
                    equals: orderId,
                },
            },
            data: {
                user: user ? user.id : null,
                paymentStatus: "paid",
                orderStatus: "processing",
                paymentIntentId: paymentIntent.id,
                paymentMethod: paymentIntent.payment_method_types.join(", "),
                receiptUrl: latestCharge.receipt_url,
                updatedAt: new Date().toISOString(),
                paymentGateway: "stripe",
                shippingAddress: shippingDetails
                    ? {
                          name: shippingDetails.name,
                          address: shippingDetails.address,
                          phone: shippingDetails.phone,
                      } as any
                    : undefined,
                billingAddress: billingDetails
                    ? {
                          name: billingDetails.name,
                          email: billingDetails.email,
                          phone: billingDetails.phone,
                          address: billingDetails.address,
                      } as any
                    : undefined,
            },
        });

        if (result.errors.length) throw new Error(result.errors[0].message);

        console.log(`✅ Payment successful for Order ID: ${orderId}`, result);

        // (Optional) Send confirmation email
        if (customerEmail) {
            await sendOrderConfirmationEmail(customerEmail, orderId);
        }
    } catch (error) {
        console.error("❌ Error updating order status:", error);
    }
};

// Dummy function for email sending (replace with actual implementation)
async function sendOrderConfirmationEmail(email: string, orderId: string) {
    console.log(
        `📧 Sending confirmation email to ${email} for Order ID: ${orderId}`
    );
}
