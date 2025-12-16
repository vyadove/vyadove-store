import type { Checkout, Order } from "@vyadove/types";

import { payloadSdk } from "@/utils/payload-sdk";

export interface CreateOrderInput {
  checkoutId: number;
  paymentIntentId?: string;
  sessionId?: string;
  sessionUrl?: string;
}

export interface CreateOrderResult {
  success: boolean;
  order?: Order;
  redirectUrl?: string;
  error?: string;
}

/**
 * Creates an order from a checkout using PayloadSDK
 * This is a server action that handles order creation without custom endpoints
 */
export async function createOrderFromCheckoutAction(
  input: CreateOrderInput,
): Promise<CreateOrderResult> {
  try {
    // Validate input
    if (!input.checkoutId) {
      return {
        success: false,
        error: "Checkout ID is required",
      };
    }

    // Fetch the checkout to validate it exists and is ready
    const checkout = await payloadSdk.findByID({
      collection: "checkout",
      id: input.checkoutId,
      depth: 2,
    });

    if (!checkout) {
      return {
        success: false,
        error: "Checkout not found",
      };
    }

    // Validate checkout status
    if (checkout.status === "complete") {
      return {
        success: false,
        error: "This checkout has already been completed",
      };
    }

    if (checkout.status === "expired" || checkout.status === "cancelled") {
      return {
        success: false,
        error: `This checkout is ${checkout.status}`,
      };
    }

    // Validate required fields
    if (!checkout.items || checkout.items.length === 0) {
      return {
        success: false,
        error: "Checkout has no items",
      };
    }

    if (!checkout.shippingMethod) {
      return {
        success: false,
        error: "Shipping method is required",
      };
    }

    if (!checkout.payment) {
      return {
        success: false,
        error: "Payment method is required",
      };
    }

    // Create the order using PayloadSDK
    // The syncFromCheckout hook will automatically populate order fields from checkout
    const order = await payloadSdk.create({
      collection: "orders",
      data: {
        checkout: checkout.id,
        paymentIntentId: input.paymentIntentId,
        sessionId: input.sessionId,
        sessionUrl: input.sessionUrl,

        // All other fields will be synced from checkout by the hook
        orderId: "",
        totalAmount: checkout.total,
        currency: "",
        paymentStatus: "pending",
        orderStatus: "pending",
      },
      depth: 2,
    });

    if (!order) {
      return {
        success: false,
        error: "Failed to create order",
      };
    }

    // Determine redirect based on payment type
    let redirectUrl: string;

    if (order.sessionUrl) {
      // Stripe payment - redirect to Stripe checkout
      redirectUrl = order.sessionUrl;
    } else {
      // Manual payment - redirect to confirmation
      redirectUrl = `/order/confirmed/${order.orderId}`;
    }

    // Return success with order and redirect URL
    return {
      success: true,
      order,
      redirectUrl,
    };
  } catch (error) {
    console.error("Error creating order from checkout:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create order",
    };
  }
}

/**
 * Gets an order by its orderId
 */
export async function getOrderByIdAction(
  orderId: string,
): Promise<Order | null> {
  try {
    const result = await payloadSdk.find({
      collection: "orders",
      where: {
        orderId: {
          equals: orderId,
        },
      },
      depth: 2,
      limit: 1,
    });

    return result.docs[0] || null;
  } catch (error) {
    console.error("Error fetching order:", error);

    return null;
  }
}

/**
 * Gets orders for the current user
 */
export async function getUserOrdersAction(): Promise<Order[]> {
  try {
    const result = await payloadSdk.find({
      collection: "orders",
      depth: 2,
      sort: "-createdAt",
    });

    return result.docs || [];
  } catch (error) {
    console.error("Error fetching user orders:", error);

    return [];
  }
}
