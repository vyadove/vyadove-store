import type { CollectionBeforeChangeHook } from "payload";
import type { Checkout } from "@vyadove/types";

import {
  calculateCheckoutPricing,
  applyPricingToCheckout,
} from "./utils/calculate-pricing";

/**
 * Calculate checkout totals (items pricing + checkout totals)
 * Runs on both create and update operations
 */
export const calculateTotals: CollectionBeforeChangeHook<Checkout> = async ({
  data,
  req,
  operation,
}) => {
  // Only calculate if there are items
  if (!data.items || data.items.length === 0) {
    // Empty checkout - set all totals to 0
    data.subtotal = 0;
    data.total = 0;
    return data;
  }

  // Calculate all pricing using centralized utility
  const pricing = await calculateCheckoutPricing(req.payload, data, {
    fetchPrices: true, // Fetch prices from products
  });

  // Apply calculated pricing to data
  applyPricingToCheckout(data, pricing);

  return data;
};
