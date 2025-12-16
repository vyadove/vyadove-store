import type { Cart, Product } from "@vyadove/types";
import type { Payload } from "payload";

import { isExpandedDoc } from "./is-expanded-doc";

export const validateCartItems = (
    cartItems: Cart["cartItems"],
    logger: Payload["logger"]
) => {
    if (!cartItems) {
        logger.warn("Cart validation failed - No cart items");
        return false;
    }
    const errors = [];

    for (const item of cartItems) {
        const product = item.product;
        if (!isExpandedDoc<Product>(product)) {
            errors.push(`Invalid product: ${product}`);
            continue;
        }
        const variant = product.variants.find((v) => v.id === item.variantId);

        if (!variant) {
            errors.push(
                `Invalid variantId: ${item.variantId} for product: ${product.title}`
            );
        }
    }

    if (errors.length > 0) {
        logger.warn(`Cart validation errors: ${errors.join("; ")}`);
    }

    return errors.length === 0;
};
