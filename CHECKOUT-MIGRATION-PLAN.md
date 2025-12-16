# Checkout System Migration Plan & Progress

**Status:** 🟡 In Progress (Phase 1.3)
**Started:** 2025-12-04
**Last Updated:** 2025-12-04

---

## Progress Overview

### ✅ Phase 1: Fix Bugs & Create Unified Update Action

- ✅ **1.1** Fix updateAddresses typo in checkout-new.tsx
- ✅ **1.2** Create updateCheckoutFormAction in checkout-actions.ts
- 🔄 **1.3** Add updateCheckoutForm to useCheckout provider (IN PROGRESS)
- ⏳ **1.4** Update checkout-new.tsx step 1 submission logic

### ⏳ Phase 2: Payment Routing in Order Hook

- ⏳ **2.1** Enhance syncFromCheckout hook with payment routing
- ⏳ **2.2** Verify Order schema has required fields

### ⏳ Phase 3: Stripe Session Creation

- ⏳ **3.1** Create create-stripe-session.ts hook file
- ⏳ **3.2** Add createStripeSession to Orders collection hooks
- ⏳ **3.3** Update redirect logic in order-actions.ts

### ⏳ Phase 4: Stripe Webhook Verification

- ⏳ **4.1** Verify Stripe webhook handlers exist

### ⏳ Phase 5: Order & Checkout Lifecycle Management

- ⏳ **5.1** Stripe session expiration handling
- ⏳ **5.2** Checkout cleanup (10 days)
- ⏳ **5.3** Order retry logic
- ⏳ **5.4** Email validation in form

---

## Overview

Fix checkout bugs and implement payment routing (manual vs Stripe) using hook-based architecture. No custom endpoints.

**Issues:**

- `updateAddresses` typo in checkout-new.tsx (should be `updateAddress`)
- Payment/shipping selections not saved to checkout before order creation
- No payment routing differentiates manual vs Stripe payments

**Solution:**

- Unified checkout update action (addresses + shipping + payment)
- Payment routing in `syncFromCheckout` hook checks `payment.providers[0].blockType`
- Stripe payments create session in `afterChange` hook, redirect to Stripe
- Manual payments create order immediately, redirect to confirmation

---

## Phase 1: Fix Bugs & Create Unified Update Action

### ✅ 1.1 Fix Typo

**File:** `apps/shop/src/scenes/checkout/checkout-new.tsx`

- Line 89: `updateAddresses` → `updateAddress` ✅
- Line 271: Update call to `updateAddress()` (Will be done in 1.4)

**Status:** COMPLETED

### ✅ 1.2 Create Unified Update Action

**File:** `apps/shop/src/providers/checkout/checkout-actions.ts`

**Status:** COMPLETED

```typescript
export async function updateCheckoutFormAction(
    providerId: string, // Payment provider block ID
    shippingMethodString: string, // Format: "${shippingId}:${blockIndex}"
    addresses: {
        shippingAddress?: Checkout["shippingAddress"];
        billingAddress?: Checkout["billingAddress"];
        email?: string;
    },
    existingCheckout: Checkout
): Promise<Checkout> {
    // 1. Parse shippingMethodString to extract shippingId
    const [shippingId] = shippingMethodString.split(":");

    // 2. Lookup Payment doc by providerId
    const paymentDoc = await payloadSdk.find({
        collection: "payments",
        where: {
            "providers.id": { equals: providerId },
        },
    });

    // 3. Update checkout with payloadSdk
    return await payloadSdk.update({
        collection: "checkout",
        id: existingCheckout.id,
        data: {
            shippingAddress: addresses.shippingAddress,
            billingAddress: addresses.billingAddress,
            email: addresses.email,
            shippingMethod: Number(shippingId),
            payment: paymentDoc.docs[0]?.id,
        },
    });
    // calculateTotals hook computes shipping cost
}
```

### 🔄 1.3 Add to useCheckout Provider

**File:** `apps/shop/src/providers/checkout/index.tsx`

**Status:** IN PROGRESS

**Completed:**

- ✅ Import `updateCheckoutFormAction`
- ✅ Add method to CheckoutContextType interface
- ✅ Create mutation: `updateFormMutation`

**Remaining:**

- ⏳ Add to `isUpdating` check
- ⏳ Create wrapper method
- ⏳ Export in value object

### ⏳ 1.4 Update checkout-new.tsx Step 1

**File:** `apps/shop/src/scenes/checkout/checkout-new.tsx`

**Status:** PENDING

Replace lines 254-286:

```typescript
if (form.formState.isDirty) {
    await updateCheckoutForm(
        data.paymentMethod, // providerId
        data.shippingMethod, // "${shippingId}:${blockIndex}"
        {
            shippingAddress: {
                firstName: data.recipientFirstName,
                lastName: data.recipientLastName,
                phone: data.recipientPhone,
                email: data.recipientEmail,
            },
            billingAddress: {
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
                email: data.email,
            },
            email: data.email,
        }
    );
    toast.success("Checkout details updated");
}
```

---

## Phase 2: Payment Routing in Order Hook

### ⏳ 2.1 Enhance syncFromCheckout

**File:** `apps/cms/src/collections/Orders/hooks/sync-from-checkout.ts`

**Status:** PENDING

After line 31 (fetching checkout), add:

```typescript
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

// Store payment type for afterChange hook
data.metadata = {
    ...data.metadata,
    paymentType,
    checkoutId: checkout.id,
};

// Set payment method
data.paymentMethod = paymentType;

// Set status based on payment type
if (paymentType === "stripe") {
    data.paymentStatus = "awaiting_payment";
} else {
    data.paymentStatus = "pending";
}
```

### ⏳ 2.2 Verify Order Schema

**File:** `apps/cms/src/collections/Orders/Orders.ts`

**Status:** PENDING

Ensure fields exist:

- `paymentMethod` (text)
- `metadata` (json)
- `sessionId` (text, optional)
- `sessionUrl` (text, optional)

---

## Phase 3: Stripe Session Creation

### ⏳ 3.1 Create Stripe Session Hook (NEW FILE)

**File:** `apps/cms/src/collections/Orders/hooks/create-stripe-session.ts`

**Status:** PENDING

```typescript
import type { CollectionAfterChangeHook } from "payload";
import type { Order } from "@vyadove/types";
// Import createCheckoutSession from stripe-plugin

export const createStripeSession: CollectionAfterChangeHook<Order> = async ({
    doc,
    req,
    operation,
}) => {
    // Only run on create
    if (operation !== "create") return doc;

    // Check if Stripe payment
    if (doc.metadata?.paymentType !== "stripe") return doc;

    // Already has session URL (retry?)
    if (doc.sessionUrl) return doc;

    try {
        // Fetch checkout with items
        const checkout = await req.payload.findByID({
            collection: "checkout",
            id: doc.metadata.checkoutId,
            depth: 2,
            req,
        });

        // Map checkout items to Stripe line items
        const lineItems = checkout.items.map((item) => {
            const product =
                typeof item.product === "object" ? item.product : null;
            const variant = product?.variants?.find(
                (v) => v.id === item.variantId
            );

            return {
                price_data: {
                    currency: checkout.currency || "usd",
                    unit_amount: Math.round((item.unitPrice || 0) * 100),
                    product_data: {
                        name: product?.name || "Product",
                        description: variant?.name || "",
                    },
                },
                quantity: item.quantity,
            };
        });

        // Create Stripe session
        const shopUrl =
            process.env.NEXT_PUBLIC_SHOP_URL || "http://localhost:3020";
        const session = await createCheckoutSession({
            lineItems,
            orderId: doc.orderId,
            metadata: { orderId: doc.id },
            cancelUrl: `${shopUrl}/checkout?canceled=true`,
            successUrl: `${shopUrl}/order/confirmed/${doc.orderId}`,
        });

        // Update order with session info
        await req.payload.update({
            collection: "orders",
            id: doc.id,
            data: {
                sessionId: session.id,
                sessionUrl: session.url,
            },
            req,
        });

        return { ...doc, sessionId: session.id, sessionUrl: session.url };
    } catch (error) {
        req.payload.logger.error(
            `Failed to create Stripe session for order ${doc.id}: ${error.message}`
        );

        // Mark order as failed
        await req.payload.update({
            collection: "orders",
            id: doc.id,
            data: { orderStatus: "failed" },
            req,
        });

        return doc;
    }
};
```

### ⏳ 3.2 Add Hook to Orders Collection

**File:** `apps/cms/src/collections/Orders/Orders.ts`

**Status:** PENDING

```typescript
import { createStripeSession } from "./hooks/create-stripe-session";

hooks: {
  beforeChange: [syncFromCheckout, addOrderTimelineEntry],
  afterChange: [markCheckoutComplete, createStripeSession],
}
```

### ⏳ 3.3 Update Order Action Redirect

**File:** `apps/shop/src/actions/order-actions.ts`

**Status:** PENDING

In `createOrderFromCheckoutAction`, after order creation:

```typescript
// Determine redirect based on payment type
let redirectUrl: string;
if (order.sessionUrl) {
    // Stripe payment - redirect to Stripe checkout
    redirectUrl = order.sessionUrl;
} else {
    // Manual payment - redirect to confirmation
    redirectUrl = `/order/confirmed/${order.orderId}`;
}

return {
    success: true,
    order,
    redirectUrl,
};
```

---

## Phase 4: Stripe Webhook (Verification Only)

### ⏳ 4.1 Verify Webhook Handlers

**File:** Check `packages/stripe-plugin/` or CMS config

**Status:** PENDING

Ensure webhooks handle:

- `payment_intent.succeeded` → Update order: `paymentStatus="paid"`, `orderStatus="processing"`
- `payment_intent.canceled` → Update order: `paymentStatus="canceled"`, `orderStatus="canceled"`

If not implemented, add to Stripe plugin config.

---

## Phase 5: Order & Checkout Lifecycle Management

### ⏳ 5.1 Stripe Session Expiration Handling

**File:** `apps/cms/src/collections/Orders/hooks/check-session-expiration.ts` (NEW)

**Status:** PENDING

```typescript
// Cron job or scheduled task to check expired sessions
// Stripe sessions expire after 30 minutes
export async function checkExpiredStripeSessions(payload) {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

    const expiredOrders = await payload.find({
        collection: "orders",
        where: {
            and: [
                { paymentStatus: { equals: "awaiting_payment" } },
                { createdAt: { less_than: thirtyMinutesAgo } },
                { sessionId: { exists: true } },
            ],
        },
    });

    for (const order of expiredOrders.docs) {
        await payload.update({
            collection: "orders",
            id: order.id,
            data: {
                orderStatus: "canceled",
                paymentStatus: "expired",
            },
        });
    }
}
```

**Setup:** Configure in Payload config or external cron (runs every 5-10 minutes).

### ⏳ 5.2 Checkout Cleanup (10 Days)

**File:** `apps/cms/src/collections/checkout/hooks/cleanup-old-checkouts.ts` (NEW)

**Status:** PENDING

```typescript
// Scheduled task to clean up abandoned checkouts
export async function cleanupOldCheckouts(payload) {
    const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);

    await payload.delete({
        collection: "checkout",
        where: {
            and: [
                { status: { not_equals: "complete" } },
                { updatedAt: { less_than: tenDaysAgo } },
            ],
        },
    });
}
```

**Setup:** Configure as scheduled task (runs daily).

### ⏳ 5.3 Order Retry Logic

**File:** `apps/shop/src/actions/order-actions.ts`

**Status:** PENDING

Add new action:

```typescript
export async function retryOrderPaymentAction(
    orderId: string
): Promise<CreateOrderResult> {
    // Fetch existing order
    // Validate order is in retryable state
    // For Stripe: create new session
    // For Manual: reset status
    // Return redirectUrl
}
```

**UI:** Add "Retry Payment" button on order confirmation page when status is failed/canceled/expired.

### ⏳ 5.4 Email Validation in Form

**File:** `apps/shop/src/scenes/checkout/checkout-new.tsx`

**Status:** ALREADY IMPLEMENTED

Already has email validation in `formSchema` (line 68):

```typescript
email: z.email(),
```

---

## Data Flow Summary

### Manual Payment:

```
User: "Checkout and Pay"
→ createOrderFromCheckoutAction({ checkoutId })
→ CMS: syncFromCheckout hook
   - Fetch checkout & payment
   - Detect blockType="manual"
   - Set paymentStatus="pending"
→ CMS: createStripeSession hook (skipped)
→ Shop: redirectUrl = `/order/confirmed/{orderId}`
→ User sees confirmation (pending payment)
```

### Stripe Payment:

```
User: "Checkout and Pay"
→ createOrderFromCheckoutAction({ checkoutId })
→ CMS: syncFromCheckout hook
   - Fetch checkout & payment
   - Detect blockType="stripe"
   - Set paymentStatus="awaiting_payment"
   - Store paymentType in metadata
→ CMS: createStripeSession hook
   - Map checkout items to Stripe format
   - Create Stripe session
   - Update order with sessionUrl
→ Shop: redirectUrl = order.sessionUrl
→ User redirected to Stripe payment
→ User completes payment
→ Stripe webhook: payment_intent.succeeded
   - Update order: paymentStatus="paid"
→ Stripe redirects to `/order/confirmed/{orderId}`
→ User sees confirmation (paid status)
```

---

## Critical Files

### Core Fixes (Phases 1-3)

1. ✅ **`apps/shop/src/scenes/checkout/checkout-new.tsx`** - Fix typo (DONE), use unified update (TODO)
2. ✅ **`apps/shop/src/providers/checkout/checkout-actions.ts`** - Add updateCheckoutFormAction (DONE)
3. 🔄 **`apps/shop/src/providers/checkout/index.tsx`** - Add updateCheckoutForm method (IN PROGRESS)
4. ⏳ **`apps/cms/src/collections/Orders/hooks/sync-from-checkout.ts`** - Add payment routing
5. ⏳ **`apps/cms/src/collections/Orders/hooks/create-stripe-session.ts`** - NEW FILE
6. ⏳ **`apps/cms/src/collections/Orders/Orders.ts`** - Add createStripeSession hook
7. ⏳ **`apps/shop/src/actions/order-actions.ts`** - Update redirect logic, add retry action

### Lifecycle Management (Phase 5)

8. ⏳ **`apps/cms/src/collections/Orders/hooks/check-session-expiration.ts`** - NEW FILE
9. ⏳ **`apps/cms/src/collections/checkout/hooks/cleanup-old-checkouts.ts`** - NEW FILE
10. ⏳ **`apps/shop/src/scenes/order/confirmed/[orderId].tsx`** - Add retry button (if exists)

---

## Error Handling

- **Action errors**: Return `{ success: false, error: string }`, show toast
- **Hook errors**: Throw for validation, log for Stripe failures
- **Stripe session failure**: Mark order as `failed` status
- **Payment lookup**: Handle missing payment doc gracefully

---

## Implementation Notes

- **Session expiration**: Run cron every 5 min to catch expired sessions promptly
- **Checkout cleanup**: Run daily at low-traffic hours (e.g., 3 AM)
- **Retry tracking**: Store `retryCount` in order metadata for monitoring
- **Email requirement**: Already enforced by Zod schema, no changes needed
- **Shipping cost calculation**: Handled by calculateTotals hook automatically
- **Payment lookup**: Form passes providerId, action finds Payment collection doc

---

## Summary

**5 Phases, 10 Files, Complete Payment Flow**

**What Gets Fixed:**

- ✅ `updateAddresses` typo → `updateAddress`
- ⏳ Payment/shipping selections saved to checkout
- ⏳ Manual vs Stripe routing via hooks
- ⏳ Stripe session creation & redirect
- ⏳ Order retry on payment failure
- ⏳ Automatic session expiration (30min)
- ⏳ Checkout cleanup (10 days)

**Payment Flows:**

- **Manual**: Order → Confirmation (pending payment)
- **Stripe**: Order → Stripe payment → Webhook → Confirmation (paid)

**Security:** All updates via hooks (no custom endpoints), following unified Checkout pattern.
