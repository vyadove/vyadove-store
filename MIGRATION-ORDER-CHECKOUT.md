# Order Collection Migration to Unified Checkout

This document outlines the changes made to sync the Order collection with the new unified Checkout system, following security best practices by using hooks instead of custom endpoints.

## Overview

The Order collection has been updated to work seamlessly with the unified Checkout system. Orders are now created directly from checkouts using PayloadSDK and hooks, eliminating the need for custom endpoints and improving security.

## Changes Made

### 1. CMS - Order Collection Updates

#### **File: `apps/cms/src/collections/Orders/Orders.ts`**

**Removed:**

- Custom checkout endpoint (`checkoutEndpoint`)
- Old `cart` relationship field

**Added:**

- New hooks: `syncFromCheckout`, `markCheckoutComplete`
- Updated `checkout` relationship to be required

**Changes:**

```typescript
// Before
endpoints: [checkoutEndpoint],
fields: [
    { name: "cart", type: "relationship", relationTo: "carts" },
    { name: "checkout", type: "relationship", relationTo: "checkout" },
],
hooks: {
    beforeChange: [addOrderTimelineEntry],
}

// After
// No endpoints - using hooks only
fields: [
    {
        name: "checkout",
        type: "relationship",
        relationTo: "checkout",
        required: true,
        admin: {
            description: "Reference to the checkout that created this order",
        },
    },
],
hooks: {
    beforeChange: [syncFromCheckout, addOrderTimelineEntry],
    afterChange: [markCheckoutComplete],
}
```

### 2. CMS - New Hooks

#### **File: `apps/cms/src/collections/Orders/hooks/sync-from-checkout.ts`**

**Purpose:** Automatically syncs order data from the unified Checkout collection when creating an order.

**Key Features:**

- Runs on order creation (`operation === "create"`)
- Fetches full checkout details with depth 2
- Validates checkout has items, shipping, and payment
- Generates unique `orderId` if not provided
- Copies data from checkout to order:
    - User/customer
    - Total amount
    - Currency
    - Addresses (shipping & billing)
    - Shipping method
    - Payment method
- Sets default statuses (pending)

**Error Handling:**

- Throws error if checkout not found
- Throws error if checkout is empty
- Throws error if shipping/payment missing

#### **File: `apps/cms/src/collections/Orders/hooks/mark-checkout-complete.ts`**

**Purpose:** Marks the checkout as complete after order is successfully created.

**Key Features:**

- Runs after order creation (`operation === "create"`)
- Updates checkout status to "complete"
- Links order back to checkout
- Graceful error handling with logging

### 3. Shop - Order Actions (PayloadSDK)

#### **File: `apps/shop/src/actions/order-actions.ts`**

**New server actions replacing custom endpoints:**

**`createOrderFromCheckoutAction(input: CreateOrderInput)`**

- Creates an order from a checkout using PayloadSDK
- Validates checkout exists and is ready
- Validates checkout status (not already complete/expired/cancelled)
- Validates required fields (items, shipping, payment)
- Creates order document (hooks handle data sync)
- Returns success/error with redirect URL

**`getOrderByIdAction(orderId: string)`**

- Fetches order by orderId using PayloadSDK
- Returns order with depth 2

**`getUserOrdersAction()`**

- Fetches all orders for current user
- Sorted by creation date (newest first)

**Benefits:**

- No custom endpoints (better security)
- Uses built-in Payload access control
- Type-safe with TypeScript
- Proper error handling
- Returns structured results

### 4. Shop - Checkout Page Migration

#### **File: `apps/shop/src/scenes/checkout/checkout-new.tsx`**

**New streamlined checkout page:**

**Key Changes:**

- Uses unified checkout provider (`useCheckout()`)
- Removes old `useCheckoutSession` hook
- Uses new `createOrderFromCheckoutAction` for order creation
- Simplified two-step flow:
    1. Collect details and update checkout
    2. Review and create order
- Better type safety
- Cleaner code structure

**Flow:**

```
Step 1: Checkout Info
  ↓
  User fills billing/shipping/delivery/payment
  ↓
  Update checkout via provider.updateAddresses()
  ↓
Step 2: Review Order
  ↓
  User reviews all details
  ↓
  Click "Checkout and Pay"
  ↓
  createOrderFromCheckoutAction()
  ↓
  Redirect to /order/confirmed/{orderId}
```

#### **File: `apps/shop/src/scenes/checkout/index.tsx`**

**Updated to export new component:**

```typescript
export { default } from "./checkout-new";
```

### 5. Order Confirmation Flow

#### **Files Verified (No changes needed):**

- `apps/shop/src/app/(store)/order/confirmed/[id]/page.tsx` ✅
- `apps/shop/src/scenes/order/index.tsx` ✅
- `apps/shop/src/scenes/order/order-details/order-details.tsx` ✅

These components already use:

- PayloadSDK for fetching orders
- Order fields directly (not dependent on cart structure)
- Unified checkout provider's `emptyCart()` method

## Order Creation Flow (New)

```
1. Customer completes checkout form
   └─ Checkout page validates input
   └─ Updates checkout via updateAddresses()

2. Customer clicks "Checkout and Pay"
   └─ Shop calls: createOrderFromCheckoutAction({ checkoutId })

3. Server Action validates checkout
   └─ Checks checkout exists
   └─ Checks checkout status (must be incomplete)
   └─ Validates items, shipping, payment

4. Server Action creates order
   └─ Calls: payloadSdk.create({ collection: "orders", data: { checkout: checkoutId } })

5. Order beforeChange hooks run (CMS)
   └─ syncFromCheckout: Fetches checkout and syncs data to order
   └─ addOrderTimelineEntry: Creates "Order Created" timeline entry

6. Order created successfully
   └─ Order document saved with all synced data

7. Order afterChange hooks run (CMS)
   └─ markCheckoutComplete: Updates checkout status to "complete"
   └─ Links order back to checkout

8. Server Action returns success
   └─ redirectUrl: /order/confirmed/{orderId}

9. Customer redirected to confirmation page
   └─ Order displayed with all details
   └─ Checkout provider clears cart
```

## Data Flow Mapping

### Checkout → Order Field Mapping

| Checkout Field    | Order Field                 | Notes                                   |
| ----------------- | --------------------------- | --------------------------------------- |
| `customer`        | `user`                      | User relationship                       |
| `total`           | `totalAmount`               | Grand total                             |
| `currency`        | `currency`                  | Currency code (USD)                     |
| `shippingAddress` | `shippingAddress`           | JSON address                            |
| `billingAddress`  | `billingAddress`            | JSON address                            |
| `shippingMethod`  | `shipping`                  | Relationship to shipping                |
| `payment`         | `payment`                   | Relationship to payments                |
| `items`           | _(referenced via checkout)_ | Items stored in checkout                |
| `status`          | -                           | Checkout status (incomplete → complete) |
| -                 | `orderId`                   | Generated: ORD-XXXXXX                   |
| -                 | `paymentStatus`             | Default: pending                        |
| -                 | `orderStatus`               | Default: pending                        |

## Security Improvements

### Before (Old System)

- Custom REST endpoints in CMS (`/api/orders/checkout`)
- Manual data copying and validation
- Exposed endpoints vulnerable to misuse
- Mixed concerns (checkout logic in order endpoint)

### After (New System)

- No custom endpoints - using hooks only
- Automatic data sync via hooks
- Built-in Payload access control
- PayloadSDK handles authentication
- Clear separation of concerns
- Hook-based architecture (like Checkout collection)

## Benefits

1. **Security:** No custom endpoints, uses Payload's built-in access control
2. **Consistency:** Follows same pattern as unified Checkout collection
3. **Maintainability:** Hooks are easier to test and maintain
4. **Type Safety:** Full TypeScript support throughout
5. **Single Source of Truth:** Checkout contains all data, order syncs from it
6. **Auditability:** Timeline tracking via existing hooks
7. **Reliability:** Automatic rollback on errors via Payload transaction system

## Testing Checklist

- [ ] Create checkout with items
- [ ] Update checkout addresses
- [ ] Create order from checkout
- [ ] Verify order has correct data from checkout
- [ ] Verify checkout status changes to "complete"
- [ ] Verify order references checkout correctly
- [ ] Verify checkout references order correctly
- [ ] Verify order timeline has creation entry
- [ ] Verify order confirmation page displays correctly
- [ ] Verify cart clears after order creation
- [ ] Test error handling (empty checkout, missing fields)
- [ ] Test with authenticated user
- [ ] Test with guest session

## Breaking Changes

**None** - This is a parallel implementation. Old endpoints still exist but are deprecated:

- Old: `POST /api/orders/checkout` (endpoint)
- New: `createOrderFromCheckoutAction()` (server action with hooks)

## Migration Path for Existing Code

If you have code using the old checkout endpoint:

```typescript
// Old way (custom endpoint)
const response = await fetch("/api/orders/checkout", {
    method: "POST",
    body: JSON.stringify({}),
    credentials: "include",
});

// New way (server action)
import { createOrderFromCheckoutAction } from "@/actions/order-actions";

const result = await createOrderFromCheckoutAction({
    checkoutId: checkout.id,
});

if (result.success) {
    router.push(result.redirectUrl);
} else {
    console.error(result.error);
}
```

## Future Enhancements

Potential improvements for future iterations:

1. **Payment Integration:**

    - Add Stripe payment intent creation in order hook
    - Handle payment webhook updates
    - Support multiple payment providers

2. **Inventory Management:**

    - Reserve inventory on order creation
    - Release inventory on order cancellation
    - Update product stock levels

3. **Email Notifications:**

    - Send order confirmation email
    - Send shipping notifications
    - Send payment receipts

4. **Order Status Updates:**

    - Add workflow for status transitions
    - Validate status changes
    - Send notifications on status updates

5. **Refunds & Returns:**
    - Add refund processing hook
    - Handle partial refunds
    - Create return orders

## Related Files

### CMS Files

- `apps/cms/src/collections/Orders/Orders.ts` - Main collection config
- `apps/cms/src/collections/Orders/hooks/sync-from-checkout.ts` - Data sync hook
- `apps/cms/src/collections/Orders/hooks/mark-checkout-complete.ts` - Status update hook
- `apps/cms/src/collections/checkout/index.ts` - Unified checkout collection

### Shop Files

- `apps/shop/src/actions/order-actions.ts` - Server actions for orders
- `apps/shop/src/scenes/checkout/checkout-new.tsx` - New checkout page
- `apps/shop/src/scenes/checkout/index.tsx` - Checkout page export
- `apps/shop/src/providers/checkout/index.tsx` - Unified checkout provider
- `apps/shop/src/app/(store)/order/confirmed/[id]/page.tsx` - Order confirmation

## Support

For questions or issues with this migration:

1. Check this migration document
2. Review the Checkout collection documentation (`apps/cms/src/collections/checkout/README.md`)
3. Check the unified checkout provider implementation
4. Review Payload CMS hooks documentation

---

**Migration completed:** 2024-12-03
**Pattern followed:** Saleor-inspired unified checkout with hook-based order creation
**Security approach:** No custom endpoints, PayloadSDK + hooks only
