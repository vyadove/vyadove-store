import type { CollectionAfterChangeHook } from "payload";
import type { Order } from "@vyadove/types";

import { clearCheckoutCookieHeaders } from "@/collections/checkout/utils/checkout-cookie";

/**
 * Marks the checkout as complete after order is successfully created
 * Also links the order back to the checkout
 */
export const markCheckoutComplete: CollectionAfterChangeHook<Order> = async ({
    doc,
    req,
    operation,
}) => {
    // Only run on create operations
    if (operation !== "create") {
        return doc;
    }

    // Get checkout ID
    const checkoutId =
        typeof doc.checkout === "object" ? doc.checkout.id : doc.checkout;

    if (!checkoutId) {
        req.payload.logger.warn("Order created without checkout reference");
        return doc;
    }

    try {
        // Update checkout to mark as complete
        // Note: order field is a join (virtual) - no need to set it
        await req.payload.update({
            collection: "checkout",
            id: checkoutId,
            data: {
                status: "complete",
            },
            req,
        });

        // Clear checkout-session cookie to force new session on next cart action
        req.responseHeaders = clearCheckoutCookieHeaders();
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        req.payload.logger.error(
            `Failed to mark checkout ${checkoutId} as complete: ${errorMessage}`
        );

        // P1.2: Compensating transaction - mark order as failed
        try {
            await req.payload.update({
                collection: "orders",
                id: doc.id,
                data: {
                    orderStatus: "failed",
                    metadata: {
                        ...(typeof doc.metadata === "object"
                            ? doc.metadata
                            : {}),
                        failureReason: "checkout_update_failed",
                        failureDetails: errorMessage,
                    },
                },
                req,
            });
            req.payload.logger.info(
                `Marked order ${doc.orderId} as failed due to checkout update failure`
            );
        } catch (compensateError) {
            req.payload.logger.error(
                `Failed to mark order ${doc.id} as failed: ${compensateError instanceof Error ? compensateError.message : "Unknown error"}`
            );
        }

        // Re-throw to signal failure upstream
        throw error;
    }

    return doc;
};
