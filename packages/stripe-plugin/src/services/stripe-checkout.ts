import type { Checkout, Payment, Shipping } from "@vyadove/types";
import type { PayloadRequest } from "payload";
import { createCheckoutSession } from "../utilities/create-checkout-session";
import { mapToStripeLineItems } from "../utilities/map-to-stripe";

type StripeCheckoutProps = {
    req: PayloadRequest;
    checkout: Checkout;
    payment: Payment;
    shipping: Shipping;
    total: number;
    orderId: string;
    /** Base currency for the order (e.g., 'usd'). Stripe AP may convert at checkout. */
    currency?: string;
};

export async function stripeCheckout({
    req,
    checkout,
    payment,
    shipping,
    total,
    orderId,
    currency = "usd",
}: StripeCheckoutProps) {
    const shopUrl =
        req.payload.config?.custom?.shopUrl || process.env.NEXT_PUBLIC_SHOP_URL;

    const order = await req.payload.create({
        collection: "orders",
        data: {
            currency: currency.toLowerCase(),
            checkout: checkout.id,
            orderId,
            orderStatus: "pending",
            paymentMethod: "stripe",
            payment: payment?.id,
            shipping: shipping?.id,
            paymentStatus: "awaiting_payment",
            totalAmount: total,
        },
        req,
    });

    if (!checkout.items?.length) {
        return { redirectUrl: null };
    }

    const cancelUrl = `${shopUrl}/checkout?canceled=true`;
    const successUrl = `${shopUrl}/order/confirmed/${orderId}`;

    const lineItems = mapToStripeLineItems(
        checkout.items,
        checkout.currency || "usd"
    );

    const session = await createCheckoutSession({
        lineItems,
        orderId,
        cancelUrl,
        successUrl,
        currency: currency.toLowerCase(),
    });

    // Update order with session info
    await req.payload.update({
        collection: "orders",
        id: order.id,
        data: {
            sessionId: session.id,
            sessionUrl: session.url,
        },
        req,
    });

    return {
        redirectUrl: session.url,
    };
}
