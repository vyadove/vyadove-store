# Checkout Pricing Calculation System

## Overview

This module provides a **centralized, optimized pricing calculation system** for the checkout collection. It serves as the **single source of truth** for all pricing calculations.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Checkout Collection                       │
│                                                              │
│  ┌──────────────────┐        ┌──────────────────┐          │
│  │ handleGuestSession│───────▶│ calculateTotals  │          │
│  │  (Hook #1)       │        │  (Hook #2)        │          │
│  └──────────────────┘        └──────────────────┘          │
│         │                             │                      │
│         │                             ▼                      │
│         │                  ┌──────────────────────┐         │
│         │                  │  calculate-pricing   │         │
│         │                  │     (Utility)        │         │
│         └─────────────────▶│                      │         │
│                            │  Single Source of    │         │
│                            │       Truth          │         │
│                            └──────────────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

## What Gets Calculated

### Per Line Item:

1. **unitPrice** - Price per unit from product variant
2. **totalPrice** - `unitPrice × quantity`

### Per Checkout:

1. **subtotal** - Sum of all `item.totalPrice`
2. **shippingTotal** - From shipping method (if selected)
3. **taxTotal** - Tax amount (calculated separately)
4. **discountTotal** - From coupons/vouchers (if applied)
5. **total** - `subtotal + shippingTotal + taxTotal - discountTotal`

## Hook Execution Order

### 1. `handleGuestSession` (First)

- Sets up session ID for guests
- Associates checkout with authenticated users
- **Also calculates pricing** for new checkouts with items

### 2. `calculateTotals` (Second)

- Calculates/recalculates all pricing
- Updates item prices if products changed
- Handles updates to shipping, tax, or discounts

## Core Utility: `calculate-pricing.ts`

### Main Function: `calculateCheckoutPricing()`

```typescript
const pricing = await calculateCheckoutPricing(payload, data, {
    fetchPrices: true, // Fetch prices from products
});
```

**Features:**

- ✅ **Batch fetching** - Fetches all products in one query (optimized)
- ✅ **Price priority** - Uses existing unitPrice if available (snapshot)
- ✅ **Fallback logic** - Falls back to variant price if needed
- ✅ **Type-safe** - Full TypeScript support

### Price Priority Order:

```
1. item.unitPrice (if exists) ← Price snapshot at add-to-cart
   ↓
2. priceMap.get(variantId) ← From batch fetch
   ↓
3. item.product.variants[].price ← From populated product
   ↓
4. Default to 0 ← Shouldn't happen (logs warning)
```

## Optimization Techniques

### 1. **Batch Product Fetching**

Instead of querying products one-by-one:

```typescript
// ❌ Bad - N queries
for (const item of items) {
    const product = await payload.findByID({
        collection: "products",
        id: item.product,
    });
}

// ✅ Good - 1 query
const products = await payload.find({
    collection: "products",
    where: { id: { in: productIds } },
});
```

### 2. **Price Snapshots**

Store `unitPrice` when item is added to preserve price at purchase time:

```typescript
{
  variantId: "variant-1",
  unitPrice: 29.99,  // ← Frozen at add-to-cart time
  quantity: 2,
  totalPrice: 59.98
}
```

### 3. **Minimal Depth**

Only fetch what's needed:

```typescript
await payload.find({
    collection: "products",
    depth: 0, // Don't populate nested relationships
});
```

### 4. **Early Returns**

Skip calculations when not needed:

```typescript
if (!data.items || data.items.length === 0) {
    data.subtotal = 0;
    data.total = 0;
    return data;
}
```

## Usage Examples

### In Hooks:

```typescript
import {
    calculateCheckoutPricing,
    applyPricingToCheckout,
} from "./utils/calculate-pricing";

export const myHook: CollectionBeforeChangeHook<Checkout> = async ({
    data,
    req,
}) => {
    // Calculate pricing
    const pricing = await calculateCheckoutPricing(req.payload, data, {
        fetchPrices: true,
    });

    // Apply to checkout
    applyPricingToCheckout(data, pricing);

    return data;
};
```

### In Endpoints:

```typescript
import { calculateCheckoutPricing } from "../hooks/utils/calculate-pricing";

export const myEndpoint: Endpoint = {
    method: "post",
    path: "/calculate",
    handler: async (req) => {
        const pricing = await calculateCheckoutPricing(
            req.payload,
            checkoutData
        );

        return Response.json({ pricing });
    },
};
```

## Performance Characteristics

| Operation             | Complexity       | Notes                              |
| --------------------- | ---------------- | ---------------------------------- |
| Batch fetch products  | O(1)             | Single DB query                    |
| Map variant prices    | O(n × m)         | n=products, m=variants per product |
| Calculate item totals | O(k)             | k=checkout items                   |
| Sum subtotal          | O(k)             | k=checkout items                   |
| **Total**             | **O(n × m + k)** | **Scales linearly**                |

For typical checkouts:

- Products: 1-10 (n)
- Variants per product: 2-5 (m)
- Items in cart: 1-20 (k)
- **Result: ~50-100 operations** ⚡

## Testing Recommendations

### Unit Tests:

```typescript
test("calculates pricing correctly", async () => {
    const mockPayload = createMockPayload();
    const checkoutData = {
        items: [{ variantId: "v1", product: 1, quantity: 2, unitPrice: 10 }],
    };

    const pricing = await calculateCheckoutPricing(mockPayload, checkoutData);

    expect(pricing.subtotal).toBe(20);
    expect(pricing.total).toBe(20);
});
```

### Integration Tests:

```typescript
test("hook calculates pricing on create", async () => {
    const checkout = await payload.create({
        collection: "checkout",
        data: {
            items: [{ variantId: "v1", product: 1, quantity: 2 }],
        },
    });

    expect(checkout.unitPrice).toBeDefined();
    expect(checkout.subtotal).toBeGreaterThan(0);
});
```

## Future Enhancements

1. **Tax Calculation** - Integrate with tax providers
2. **Shipping Calculation** - Auto-calculate based on address
3. **Discount Application** - Apply coupon codes
4. **Price Caching** - Cache variant prices in Redis
5. **Currency Conversion** - Multi-currency support

## Troubleshooting

### Issue: Prices not calculating

- ✅ Check product variants have `price.amount` set
- ✅ Verify `fetchPrices: true` in options
- ✅ Check console for warning messages

### Issue: Slow performance

- ✅ Verify batch fetching is working (should be 1 query)
- ✅ Check `depth: 0` is used in product fetch
- ✅ Monitor DB query logs

### Issue: Stale prices

- ✅ Clear `unitPrice` to force recalculation
- ✅ Run `calculateTotals` hook manually
- ✅ Update product price and save checkout

## Contributing

When modifying pricing logic:

1. ✅ Update this README
2. ✅ Add tests for new behavior
3. ✅ Ensure backward compatibility
4. ✅ Document breaking changes
