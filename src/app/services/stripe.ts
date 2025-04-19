import Decimal from "decimal.js";
import Stripe from "stripe";



export const mapToStripeLineItems = (
    variants: {
        id: string;
        price: number;
        options: { id: string; option: string; value: string }[];
        gallery: { url: string }[];
        quantity: number;
    }[]
): Stripe.Checkout.SessionCreateParams.LineItem[] => {
    return variants.map((variant) => {
        return {
            price_data: {
                currency: "usd", // Adjust if needed
                product_data: {
                    name: `Product ${variant.id}`, // Modify if you have actual product names
                    description: variant.options
                        .map((opt) => `${opt.option}: ${opt.value}`)
                        .join(", "),
                    images:
                        variant.gallery.length > 0
                            ? [variant.gallery[0].url]
                            : [],
                },
                unit_amount: +(new Decimal(variant.price).times(100).toFixed(0)),
            },
            quantity: new Decimal(variant.quantity).toNumber(),
        };
    });
};


export const createCheckoutSession = async (
    lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
    orderId: string
) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
        apiVersion: "2022-08-01",
    });
    return stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/order/confirmed/{CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/cart?canceled=true`,
        metadata: {
            cartItemCount: lineItems.length.toString(),
            orderId: orderId,
        },
        expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // Expires in 30 minutes
        payment_intent_data: {
            setup_future_usage: "off_session",
            metadata: {
                orderId,
            },
        },
        shipping_address_collection: {
            allowed_countries: ["US", "CA", "GB"], // Add the countries you want to support
        },
    });
};

export const retrieveSession = async (sessionId: string) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
        apiVersion: "2022-08-01",
    });
    return stripe.checkout.sessions.retrieve(sessionId);
};

export const constructWebhookEvent = (
    payload: string | Buffer,
    signature: string
) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
        apiVersion: "2022-08-01",
    });
    return stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET as string
    );
};
