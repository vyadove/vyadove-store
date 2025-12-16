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
};

export async function stripeCheckout({
    req,
    checkout,
    payment,
    shipping,
    total,
    orderId,
}: StripeCheckoutProps) {
    const shopUrl =
        req.payload.config?.custom?.shopUrl || process.env.NEXT_PUBLIC_SHOP_URL;

    const order = await req.payload.create({
        collection: "orders",
        data: {
            checkout: checkout.id,
            currency: checkout.currency || "usd",
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
