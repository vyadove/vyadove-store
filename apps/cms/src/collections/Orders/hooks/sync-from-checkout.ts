import type { CollectionBeforeChangeHook } from "payload";
import type { Order } from "@vyadove/types";
import { z } from "zod";

// Zod schema for validating checkoutId
const CheckoutIdSchema = z.number().int().positive();

/**
 * Syncs order data from the unified Checkout collection
 * This hook runs before order creation to populate order fields from checkout
 */
export const syncFromCheckout: CollectionBeforeChangeHook<Order> = async ({
    data,
    req,
    operation,
}) => {
    // Only sync on create operations
    if (operation !== "create") {
        return data;
    }

    // Ensure checkout relationship exists
    if (!data.checkout) {
        throw new Error("Checkout is required to create an order");
    }

    const rawCheckoutId =
        typeof data.checkout === "object" ? data.checkout.id : data.checkout;

    // Validate checkoutId with Zod
    const checkoutIdResult = CheckoutIdSchema.safeParse(rawCheckoutId);
    if (!checkoutIdResult.success) {
        throw new Error(
            `Invalid checkout ID: ${checkoutIdResult.error.message}`
        );
    }
    const checkoutId = checkoutIdResult.data;

    // P1.3: Check for existing order from this checkout (race condition prevention)
    const existingOrder = await req.payload.find({
        collection: "orders",
        where: {
            and: [
                { checkout: { equals: checkoutId } },
                { orderStatus: { not_equals: "failed" } },
            ],
        },
        limit: 1,
    });

    if (existingOrder.docs.length > 0) {
        throw new Error(
            `Order already exists for checkout ${checkoutId}: ${existingOrder.docs[0].orderId}`
        );
    }

    // Fetch the checkout with full details
    const checkout = await req.payload.findByID({
        collection: "checkout",
        id: checkoutId,
        depth: 2,
        req,
    });

    if (!checkout) {
        throw new Error(`Checkout with ID ${checkoutId} not found`);
    }

    // Validate checkout has items
    if (!checkout.items || checkout.items.length === 0) {
        throw new Error("Cannot create order from empty checkout");
    }

    // Validate required fields
    if (!checkout.payment) {
        throw new Error("Payment method is required");
    }

    // Fetch payment method to determine routing
    const paymentId =
        typeof checkout.payment === "object"
            ? checkout.payment.id
            : checkout.payment;

    const paymentDoc = await req.payload.findByID({
        collection: "payments",
        id: paymentId,
        depth: 1,
        req,
    });

    // Extract payment type from provider blockType
    const paymentType = paymentDoc?.providers?.[0]?.blockType || "manual";

    // Generate orderId
    const generateOrderId = (len = 6) => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let orderId = "ORD-";
        for (let i = 0; i < len; i++) {
            orderId += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return orderId;
    };

    data.orderId = generateOrderId();

    // Sync data from checkout to order
    const customerId =
        typeof checkout.customer === "object"
            ? checkout.customer?.id
            : checkout.customer;
    data.user = customerId || data.user;
    data.sessionId = checkout.sessionId;
    data.totalAmount = checkout.total;
    data.currency = checkout.currency || data.currency || "usd";
    data.shippingAddress = checkout.shippingAddress || data.shippingAddress;
    data.billingAddress = checkout.billingAddress || data.billingAddress;
    data.giftMessage = checkout.giftMessage || data.giftMessage;

    data.payment =
        typeof checkout.payment === "object"
            ? checkout.payment.id
            : checkout.payment;

    // Store payment type for afterChange hook and set payment method
    data.metadata = {
        ...(typeof data?.metadata === "object" ? data?.metadata : {}),
        paymentType,
        checkoutId: checkout.id,
    };

    data.paymentMethod = paymentType;
    data.paymentStatus = "pending";
    data.orderStatus = "pending";

    // Mark checkout as complete (update after order creation)
    // Note: This happens in afterChange hook to avoid circular updates

    return data;
};
