import Stripe from "stripe";

export const createCheckoutSession = async ({
    lineItems,
    orderId,
    cancelUrl,
    successUrl,
    idempotencyKey,
}: {
    lineItems: Stripe.Checkout.SessionCreateParams.LineItem[];
    orderId: string;
    cancelUrl: string;
    successUrl: string;
    /** Idempotency key to prevent duplicate session creation */
    idempotencyKey?: string;
}) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
        apiVersion: "2022-08-01",
    });

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
        cancel_url: cancelUrl,
        expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // Expires in 30 minutes
        line_items: lineItems,
        metadata: {
            cartItemCount: lineItems.length.toString(),
            orderId,
        },
        mode: "payment",
        payment_intent_data: {
            metadata: {
                orderId,
            },
            setup_future_usage: "off_session",
        },
        // payment_method_types: ["card"],
        success_url: successUrl,
    };

    // Use idempotency key if provided to prevent duplicate charges
    const requestOptions: Stripe.RequestOptions | undefined = idempotencyKey
        ? { idempotencyKey }
        : undefined;

    return stripe.checkout.sessions.create(sessionParams, requestOptions);
};
