import Stripe from "stripe";
import Decimal from "decimal.js";
import type { Checkout, Product } from "@vyadove/types";

type CheckoutItem = NonNullable<Checkout["items"]>[number];

export const mapToStripeLineItems = (
    items: NonNullable<Checkout["items"]>,
    currency = "usd"
): Stripe.Checkout.SessionCreateParams.LineItem[] => {
    return items.map((item) => {
        const product = typeof item.product === "object" ? item.product : null;
        const variant = product?.variants?.find((v) => v.id === item.variantId);

        // Build variant description from options
        const variantDesc = variant?.options
            ?.map((opt) => `${opt.option}: ${opt.value}`)
            .join(", ");

        return {
            price_data: {
                currency,
                product_data: {
                    name: product?.title || `Product ${item.variantId}`,
                    description: variantDesc || undefined,
                },
                unit_amount: +new Decimal(variant?.price?.amount || 0)
                    .times(100)
                    .toFixed(0),
            },
            quantity: item.quantity,
        };
    });
};
