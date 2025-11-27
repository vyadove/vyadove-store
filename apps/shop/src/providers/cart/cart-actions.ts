import type { StoreCart, StoreCartItem } from "@/providers/cart/store-cart";
import type { Cart } from "@vyadove/types";
import Cookies from "js-cookie";

import { payloadSdk } from "@/utils/payload-sdk";

/**
 * Enriches cart items with the variant object by finding the matching variant
 * from product.variants based on variantId
 */
function enrichCartWithVariants(cart: StoreCart | null): StoreCart | null {
  if (!cart || !cart.cartItems) return cart;

  const enrichedItems = cart.cartItems.map((item) => {
    // Find the matching variant from product.variants using variantId
    const variant = item.product?.variants?.find(
      (v) => v.id === item.variantId,
    );

    return {
      ...item,
      variant, // Attach the variant object for easier UI access
    };
  });

  return {
    ...cart,
    cartItems: enrichedItems as StoreCartItem[],
  };
}

interface CartItemInput {
  variantId: string;
  quantity: number;
  productId?: number;
}

interface RemoveCartItemInput {
  variantId: string;
  // productId?: number;
}

export async function getCartAction() {
  try {
    const { docs } = await payloadSdk.find({
      collection: "carts",
      depth: 2,
    });

    if (!docs[0]) return null;

    // const cart = docs[0] as StoreCart;
    const cart = docs[0];

    return cart;

    // return enrichCartWithVariants(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    // Remove invalid session cookie to prevent 403 loops
    Cookies.remove("cart-session");

    return null;
  }
}

function sanitizeCartItems(items: Cart["cartItems"]) {
  return items?.map((item) => ({
    ...item,
    product: typeof item.product === "object" ? item.product.id : item.product,
  }));
}

export async function addToCartAction(input: CartItemInput) {
  try {
    const existingCart = await getCartAction();

    if (existingCart) {
      // Update existing cart using standard SDK
      const existingItems = existingCart.cartItems || [];
      const existingItemIndex = existingItems.findIndex(
        (item) => item.variantId === input.variantId,
      );

      const updatedItems = [...existingItems];

      if (existingItemIndex > -1) {
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex]!,
          quantity: updatedItems[existingItemIndex]!.quantity + input.quantity,
        };
      } else {
        updatedItems.push({
          variantId: input.variantId,
          product: input.productId as any,
          quantity: input.quantity,
        });
      }

      const updatedCart = await payloadSdk.update({
        collection: "carts",
        id: existingCart.id,
        data: {
          cartItems: sanitizeCartItems(updatedItems),
        },
        depth: 2, // Ensure product.variants is populated
      });

      // fake delay for optimistic update
      await new Promise((resolve) => setTimeout(resolve, 3100));

      return updatedCart;
      // return enrichCartWithVariants(updatedCart as unknown as StoreCart);
    } else {
      // Create new cart using custom endpoint to set session cookie
      const item = {
        id: input.variantId,
        product: input.productId,
        variantId: input.variantId,
        quantity: input.quantity,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/carts/session`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            item,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`Cart creation failed: ${response.statusText}`);
      }

      // const data = await response.json();

      // If we fetch fresh immediately:
      const freshCart = await getCartAction();

      if (freshCart) return freshCart;

      throw new Error("Failed to retrieve new cart session");
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
}

export async function updateCartItemAction(input: CartItemInput) {
  try {
    const existingCart = await getCartAction();

    if (!existingCart) throw new Error("Cart not found");

    const existingItems = existingCart.cartItems || [];
    let updatedItems = existingItems.map((item) => {
      if (item.variantId === input.variantId) {
        return { ...item, quantity: input.quantity };
      }

      return item;
    });

    // Filter out zero quantity
    updatedItems = updatedItems.filter((item) => item.quantity > 0);

    const updatedCart = await payloadSdk.update({
      collection: "carts",
      id: existingCart.id,
      data: {
        cartItems: sanitizeCartItems(updatedItems),
      },
      depth: 2, // Ensure product.variants is populated
    });

    return updatedCart;

    // return enrichCartWithVariants(updatedCart as unknown as StoreCart);
  } catch (error) {
    console.error("Error updating cart item:", error);
    throw error;
  }
}

export async function removeFromCartAction(input: RemoveCartItemInput) {
  try {
    const existingCart = await getCartAction();

    if (!existingCart) throw new Error("Cart not found");

    const existingItems = existingCart.cartItems || [];
    const updatedItems = existingItems.filter(
      (item) => item.variantId !== input.variantId,
    );

    const updatedCart = await payloadSdk.update({
      collection: "carts",
      id: existingCart.id,
      data: {
        cartItems: sanitizeCartItems(updatedItems),
      },
      depth: 2,
    });

    return updatedCart;
    // return enrichCartWithVariants(updatedCart as unknown as StoreCart);
  } catch (error) {
    console.error("Error removing from cart:", error);
    throw error;
  }
}

export async function clearCartAction(): Promise<void> {
  try {
    const existingCart = await getCartAction();

    if (!existingCart) return;

    await payloadSdk.update({
      collection: "carts",
      id: existingCart.id,
      data: {
        cartItems: [],
      },
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw error;
  }
}

export async function getCartItemCount(): Promise<number> {
  const cart = await getCartAction();

  return cart?.cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
}
