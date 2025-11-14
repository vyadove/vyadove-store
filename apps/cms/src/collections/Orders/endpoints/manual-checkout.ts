import type { Cart, Order, Payment, Shipping } from "@vyadove/types";

// /plugins/manual/checkout.ts
import crypto from "crypto";
import { PayloadRequest } from "payload";

type ManualCheckoutProps = {
    req: PayloadRequest;
    cart: Cart;
    payment: Payment;
    shipping: Shipping;
    shippingAddress: Order["shippingAddress"];
    billingAddress: Order["billingAddress"];
    total: number;
    orderId: string;
};

export async function manualCheckout({
    req,
    cart,
    payment,
    shipping,
    total,
    orderId,
    shippingAddress,
    billingAddress,
}: ManualCheckoutProps) {
    const sessionId = `SID-${crypto.randomUUID()}`;

    await req.payload.create({
        collection: "orders",
        data: {
            cart: cart.id,
            currency: "usd",
            orderId,
            orderStatus: "shipped",
            paymentMethod: payment?.providers?.[0]?.id,
            payment: payment?.id,
            shippingAddress: shippingAddress,
            billingAddress: billingAddress,
            shipping: shipping?.id,
            paymentStatus: "paid",
            sessionId,
            totalAmount: total,
        },
        req,
    });

    return {
        redirectUrl: `/order/confirmed/${sessionId}`,
    };
}
