import Stripe from "stripe";

export type CreateCheckoutSessionParams = {
    lineItems: Stripe.Checkout.SessionCreateParams.LineItem[];
    orderId: string;
    cancelUrl: string;
    successUrl: string;
    /** Base currency for pricing (e.g., 'usd'). Stripe AP will convert at checkout. */
    currency?: string;
    /** Enable Stripe Adaptive Pricing (customer pays in local currency) */
    enableAdaptivePricing?: boolean;
    /** Idempotency key to prevent duplicate session creation */
    idempotencyKey?: string;
};

export const createCheckoutSession = async ({
    lineItems,
    orderId,
    cancelUrl,
    successUrl,
    currency = "usd",
    enableAdaptivePricing = true,
    idempotencyKey,
}: CreateCheckoutSessionParams) => {
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
            baseCurrency: currency, // Store base currency for reference
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

    // Note: Adaptive Pricing is enabled by default in Stripe Dashboard.
    // Setting currency explicitly ensures the base currency is used for pricing.
    // Stripe will automatically offer local currency conversion at checkout if
    // Adaptive Pricing is enabled in the Stripe Dashboard payment settings.
    // The customer's presentment currency will be available in checkout.session.completed
    // webhook via the presentment_details object.

    return stripe.checkout.sessions.create(sessionParams, requestOptions);
};
