import type { Checkout } from "@vyadove/types";

export const mapCheckoutItems = (items: Checkout["items"]) => {
    return items?.map((item) => ({
        id: item.variantId,
        quantity: item.quantity,
    }));
};

/** @deprecated Use mapCheckoutItems instead */
export const mapCartItems = mapCheckoutItems;
