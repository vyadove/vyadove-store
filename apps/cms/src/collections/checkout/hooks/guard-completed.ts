import type { CollectionBeforeChangeHook } from "payload";
import type { Checkout } from "@vyadove/types";
import { checkRole } from "@/access/roles";

/**
 * Prevents modifications to completed checkouts.
 * Once a checkout is marked complete (order created), it should be read-only.
 */
export const guardCompletedCheckout: CollectionBeforeChangeHook<Checkout> = async ({
	data,
	req,
	operation,
	originalDoc,
}) => {

	if (operation !== "update") return data;

	// Allow admins to modify completed checkouts
	if (req.user && checkRole(["admin"], req.user)) {
		return data;
	}

	// Block modifications to completed checkouts
	if (originalDoc?.status === "complete") {
		throw new Error(
			"Cannot modify a completed checkout. Please create a new checkout.",
		);
	}

	return data;
};
