import type { Checkout, Product } from "@vyadove/types";
import Cookies from "js-cookie";

import { payloadSdk } from "@/utils/payload-sdk";

import type {
  CheckoutAddressUpdate,
  CheckoutItemInput,
  CheckoutLineItem,
} from "./types";

/**
 * Get current checkout session
 */
export async function getCheckoutAction(): Promise<Checkout | undefined> {
  try {
    const { docs } = await payloadSdk.find({
      collection: "checkout",
      depth: 2,
      where: {
        status: {
          not_equals: "complete",
        },
      },
      limit: 1,
      sort: "-createdAt",
    });

    if (!docs[0]) return undefined;

    return docs[0] as Checkout;
  } catch (error) {
    console.error("Error fetching checkout:", error);

    return undefined;
  }
}

/**
 * Create a new checkout session
 */
async function createCheckoutAction(
  item: CheckoutItemInput,
): Promise<Checkout> {
  try {
    const checkout = await payloadSdk.create({
      collection: "checkout",
      data: {
        sessionId: `temp-${Date.now()}`,
        items: [
          {
            product: item.productId as number,
            variantId: item.variantId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.unitPrice ? item.unitPrice * item.quantity : 0,
          },
        ],
        status: "incomplete",
        currency: "USD",
        subtotal: item.unitPrice ? item.unitPrice * item.quantity : 0,
        total: item.unitPrice ? item.unitPrice * item.quantity : 0,
      },
      depth: 2,
    });

    return checkout;
  } catch (error) {
    console.error("Error creating checkout:", error);
    throw error;
  }
}

/**
 * Helper to sanitize items for Payload (convert product objects to IDs)
 */
function sanitizeCheckoutItems(items: CheckoutLineItem[]): CheckoutLineItem[] {
  return items.map((item) => ({
    ...item,
    product: typeof item.product === "object" ? item.product.id : item.product,
  }));
}

/**
 * Add item to checkout
 */
export async function addToCheckoutAction(
  input: CheckoutItemInput,
  existingCheckout?: Checkout,
): Promise<Checkout> {
  try {
    if (!existingCheckout) {
      // Create new checkout
      return await createCheckoutAction(input);
    }

    // Update existing checkout - add or increment quantity
    const existingItems = (existingCheckout.items || []) as CheckoutLineItem[];
    const existingItemIndex = existingItems.findIndex(
      (item) => item.variantId === input.variantId,
    );

    let updatedItems: CheckoutLineItem[];

    if (existingItemIndex >= 0) {
      // Update existing item
      updatedItems = existingItems.map((item, index) => {
        if (index === existingItemIndex) {
          const newQuantity = item.quantity + input.quantity;

          return {
            ...item,
            quantity: newQuantity,
            totalPrice: item.unitPrice ? item.unitPrice * newQuantity : 0,
          };
        }

        return item;
      });
    } else {
      // Add new item
      updatedItems = [
        ...existingItems,
        {
          product: input.productId || 0,
          variantId: input.variantId,
          quantity: input.quantity,
          unitPrice: input.unitPrice,
          totalPrice: input.unitPrice ? input.unitPrice * input.quantity : 0,
        },
      ];
    }

    const updatedCheckout = await payloadSdk.update({
      collection: "checkout",
      id: existingCheckout.id,
      data: {
        items: sanitizeCheckoutItems(updatedItems),
      },
      depth: 2,
    });

    return updatedCheckout;
  } catch (error) {
    console.error("Error adding to checkout:", error);
    throw error;
  }
}

/**
 * Update checkout item quantity
 */
export async function updateCheckoutItemAction(
  input: CheckoutItemInput,
  existingCheckout?: Checkout,
): Promise<Checkout> {
  try {
    if (!existingCheckout) throw new Error("Checkout not found");

    const existingItems = (existingCheckout.items || []) as CheckoutLineItem[];

    // Update quantity or filter out if quantity is 0
    let updatedItems = existingItems.map((item) => {
      if (item.variantId === input.variantId) {
        return {
          ...item,
          quantity: input.quantity,
          totalPrice: item.unitPrice ? item.unitPrice * input.quantity : 0,
        };
      }

      return item;
    });

    // Filter out zero quantity items
    updatedItems = updatedItems.filter((item) => item.quantity > 0);

    const updatedCheckout = await payloadSdk.update({
      collection: "checkout",
      id: existingCheckout.id,
      data: {
        items: sanitizeCheckoutItems(updatedItems),
      },
      depth: 2,
    });

    return updatedCheckout;
  } catch (error) {
    console.error("Error updating checkout item:", error);
    throw error;
  }
}

/**
 * Remove item from checkout
 */
export async function removeFromCheckoutAction(
  variantId: string,
  existingCheckout?: Checkout,
): Promise<Checkout> {
  try {
    if (!existingCheckout) throw new Error("Checkout not found");

    const existingItems = (existingCheckout.items || []) as CheckoutLineItem[];
    const updatedItems = existingItems.filter(
      (item) => item.variantId !== variantId,
    );

    const updatedCheckout = await payloadSdk.update({
      collection: "checkout",
      id: existingCheckout.id,
      data: {
        items: sanitizeCheckoutItems(updatedItems),
      },
      depth: 2,
    });

    return updatedCheckout;
  } catch (error) {
    console.error("Error removing from checkout:", error);
    throw error;
  }
}

/**
 * Clear all checkout items
 */
export async function clearCheckoutAction(
  existingCheckout?: Checkout,
): Promise<Checkout> {
  try {
    if (!existingCheckout) throw new Error("Checkout not found");

    const updatedCheckout = await payloadSdk.update({
      collection: "checkout",
      id: existingCheckout.id,
      data: {
        items: [],
      },
      depth: 2,
    });

    return updatedCheckout;
  } catch (error) {
    console.error("Error clearing checkout:", error);
    throw error;
  }
}

/**
 * Update checkout address
 */
export async function updateCheckoutAddressAction(
  data: CheckoutAddressUpdate,
  existingCheckout?: Checkout,
): Promise<Checkout> {
  try {
    if (!existingCheckout) throw new Error("Checkout not found");

    const updateData: Partial<Checkout> = {};

    if (data.shippingAddress) updateData.shippingAddress = data.shippingAddress;
    if (data.billingAddress) updateData.billingAddress = data.billingAddress;
    if (data.email) updateData.email = data.email;

    const updatedCheckout = await payloadSdk.update({
      collection: "checkout",
      id: existingCheckout.id,
      data: updateData,
      depth: 2,
    });

    return updatedCheckout;
  } catch (error) {
    console.error("Error updating checkout address:", error);
    throw error;
  }
}

/**
 * Update checkout shipping method
 */
export async function updateCheckoutShippingAction(
  shippingMethodId: number,
  existingCheckout?: Checkout,
): Promise<Checkout> {
  try {
    if (!existingCheckout) throw new Error("Checkout not found");

    const updatedCheckout = await payloadSdk.update({
      collection: "checkout",
      id: existingCheckout.id,
      data: {
        shippingMethod: shippingMethodId,
      },
      depth: 2,
    });

    return updatedCheckout;
  } catch (error) {
    console.error("Error updating checkout shipping:", error);
    throw error;
  }
}

/**
 * Update checkout payment method
 */
export async function updateCheckoutPaymentAction(
  paymentMethodId: number,
  existingCheckout?: Checkout,
): Promise<Checkout> {
  try {
    if (!existingCheckout) throw new Error("Checkout not found");

    const updatedCheckout = await payloadSdk.update({
      collection: "checkout",
      id: existingCheckout.id,
      data: {
        payment: paymentMethodId,
      },
      depth: 2,
    });

    return updatedCheckout;
  } catch (error) {
    console.error("Error updating checkout payment:", error);
    throw error;
  }
}

/**
 * Unified checkout form update - updates addresses, shipping, and payment in one call
 */
export async function updateCheckoutFormAction(
  providerId: string, // Payment provider block ID
  shippingMethodString: string, // Format: "${shippingId}:${blockIndex}"
  addresses: CheckoutAddressUpdate,
  existingCheckout: Checkout,
): Promise<Checkout> {
  try {
    if (!existingCheckout) throw new Error("Checkout not found");

    // Parse shippingMethodString to extract shippingId
    const [shippingId] = shippingMethodString.split(":");

    // Lookup Payment doc by providerId
    const paymentResult = await payloadSdk.find({
      collection: "payments",
      where: {
        "providers.id": { equals: providerId },
      },
      limit: 1,
    });

    if (!paymentResult.docs[0]) {
      throw new Error(
        `Payment method with provider ID ${providerId} not found`,
      );
    }

    // Update checkout with all form data
    const updatedCheckout = await payloadSdk.update({
      collection: "checkout",
      id: existingCheckout.id,
      data: {
        shippingAddress: addresses.shippingAddress,
        billingAddress: addresses.billingAddress,
        email: addresses.email,
        shippingMethod: Number(shippingId),
        payment: paymentResult.docs[0].id,
      },
      depth: 2,
    });

    return updatedCheckout;
  } catch (error) {
    console.error("Error updating checkout form:", error);
    throw error;
  }
}
