import type { Payload } from "payload";
import type { Checkout, Product } from "@vyadove/types";

/**
 * Product pricing information
 */
interface ProductPricing {
    productId: number;
    variantId: string;
    unitPrice: number;
}

/**
 * Calculated checkout pricing
 */
export interface CheckoutPricing {
    items: Array<{
        variantId: string;
        product: number | Product;
        quantity: number;
        participants: number;
        unitPrice: number;
        totalPrice: number;
    }>;
    subtotal: number;
    shippingTotal: number;
    taxTotal: number;
    discountTotal: number;
    total: number;
}

/**
 * Fetch product prices in batch for optimization
 * Returns a Map of variantId -> unitPrice
 */
async function fetchProductPrices(
    payload: Payload,
    items: Checkout["items"]
): Promise<Map<string, number>> {
    if (!items || items.length === 0) {
        return new Map();
    }

    // Extract unique product IDs
    const productIds = [
        ...new Set(
            items
                .map((item) =>
                    typeof item.product === "object"
                        ? item.product.id
                        : item.product
                )
                .filter((id): id is number => typeof id === "number")
        ),
    ];

    if (productIds.length === 0) {
        return new Map();
    }

    // Batch fetch all products
    const { docs: products } = await payload.find({
        collection: "products",
        where: {
            id: {
                in: productIds,
            },
        },
        depth: 0, // Only need variants, not nested relationships
        limit: productIds.length,
    });

    // Build variant price map
    const priceMap = new Map<string, number>();

    for (const product of products) {
        if (!product.variants || product.variants.length === 0) continue;

        for (const variant of product.variants) {
            if (variant.id && variant.price?.amount) {
                priceMap.set(variant.id, variant.price.amount);
            }
        }
    }

    return priceMap;
}

/**
 * Calculate unit price for an item
 * Priority: item.unitPrice > variant.price.amount > 0
 */
function calculateUnitPrice(
    item: NonNullable<Checkout["items"]>[number],
    priceMap: Map<string, number>
): number {
    // 1. Use existing unitPrice if available (price snapshot at time of adding)
    if (item.unitPrice && item.unitPrice > 0) {
        return item.unitPrice;
    }

    // 2. Look up variant price from the map
    const variantPrice = priceMap.get(item.variantId);
    if (variantPrice !== undefined) {
        return variantPrice;
    }

    // 3. If product is populated, check variant directly
    if (typeof item.product === "object" && item.product.variants) {
        const variant = item.product.variants.find(
            (v) => v.id === item.variantId
        );
        if (variant?.price?.amount) {
            return variant.price.amount;
        }
    }

    // 4. Default to 0 (shouldn't happen in production)
    console.warn(
        `No price found for variant ${item.variantId}. Defaulting to 0.`
    );
    return 0;
}

/**
 * Calculate all pricing for a checkout
 * This is the single source of truth for pricing calculations
 */
export async function calculateCheckoutPricing(
    payload: Payload,
    data: Partial<Checkout>,
    options: {
        fetchPrices?: boolean; // Set to false if prices are already in items
    } = { fetchPrices: true }
): Promise<CheckoutPricing> {
    const items = data.items || [];

    // Fetch product prices if needed
    const priceMap = options.fetchPrices
        ? await fetchProductPrices(payload, items)
        : new Map();

    // Calculate per-item pricing (including participants)
    const pricedItems = items.map((item) => {
        const unitPrice = calculateUnitPrice(item, priceMap);
        const participants =
            (item as { participants?: number }).participants || 1;
        const totalPrice = unitPrice * item.quantity * participants;

        return {
            variantId: item.variantId,
            product: item.product,
            quantity: item.quantity,
            participants,
            unitPrice,
            totalPrice,
        };
    });

    // Calculate subtotal (sum of all item totals)
    const subtotal = pricedItems.reduce(
        (sum, item) => sum + item.totalPrice,
        0
    );

    // Get other totals from data or default to 0
    const shippingTotal = data.shippingTotal || 0;
    const taxTotal = data.taxTotal || 0;
    const discountTotal = data.discountTotal || 0;

    // Calculate grand total
    const total = subtotal + shippingTotal + taxTotal - discountTotal;

    return {
        items: pricedItems,
        subtotal,
        shippingTotal,
        taxTotal,
        discountTotal,
        total,
    };
}

/**
 * Apply calculated pricing to checkout data
 * Mutates the data object
 */
export function applyPricingToCheckout(
    data: Partial<Checkout>,
    pricing: CheckoutPricing
): void {
    data.items = pricing.items;
    data.subtotal = pricing.subtotal;
    data.shippingTotal = pricing.shippingTotal;
    data.taxTotal = pricing.taxTotal;
    data.discountTotal = pricing.discountTotal;
    data.total = pricing.total;
}
