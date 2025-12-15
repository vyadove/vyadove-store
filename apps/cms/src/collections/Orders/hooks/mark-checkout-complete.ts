import type { CollectionAfterChangeHook } from "payload";
import { generateCookie } from "payload";
import type { Order } from "@vyadove/types";

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
	const checkoutId = typeof doc.checkout === "object" ? doc.checkout.id : doc.checkout;

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
		const clearCookie = generateCookie({
			name: "checkout-session",
			value: "",
			expires: new Date(0),
			path: "/",
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "Strict",
			returnCookieAsObject: false,
		});
		req.responseHeaders = new Headers({ "Set-Cookie": clearCookie as string });
	} catch (error) {
		req.payload.logger.error(
			`Failed to mark checkout ${checkoutId} as complete: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}

	return doc;
};
