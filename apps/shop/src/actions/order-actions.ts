import type { Order } from "@vyadove/types";
import { z } from "zod";

import { payloadSdk } from "@/utils/payload-sdk";

// Zod schemas for input validation
const CreateOrderInputSchema = z.object({
  checkoutId: z
    .number()
    .int()
    .positive("Checkout ID must be a positive integer"),
});

const OrderIdSchema = z.string().min(1, "Order ID is required");

export type CreateOrderInput = z.infer<typeof CreateOrderInputSchema>;

export interface CreateOrderResult {
  success: boolean;
  order?: Order;
  redirectUrl?: string;
  error?: string;
  validationErrors?: z.inferFlattenedErrors<typeof CreateOrderInputSchema>;
}

/**
 * Creates an order from a checkout using PayloadSDK
 * This is a server action that handles order creation without custom endpoints
 */
export async function createOrderFromCheckoutAction(
  input: CreateOrderInput,
): Promise<CreateOrderResult> {
  // Validate input with Zod
  const parsed = CreateOrderInputSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: "Invalid input",
      validationErrors: parsed.error.flatten(),
    };
  }

  const validatedInput = parsed.data;

  try {
    // Fetch the checkout to validate it exists and is ready
    const checkout = await payloadSdk.findByID({
      collection: "checkout",
      id: validatedInput.checkoutId,
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
    // The syncFromCheckout hook will populate order fields from checkout
    // The createStripeSession hook will set stripeSessionId + sessionUrl for Stripe payments
    const order = await payloadSdk.create({
      collection: "orders",
      data: {
        checkout: checkout.id,
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
  // Validate input
  const parsed = OrderIdSchema.safeParse(orderId);

  if (!parsed.success) {
    console.error("Invalid orderId:", parsed.error.flatten());

    return null;
  }

  try {
    const result = await payloadSdk.find({
      collection: "orders",
      where: {
        orderId: {
          equals: parsed.data,
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
