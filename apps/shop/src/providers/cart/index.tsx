"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useOptimistic,
  useState,
  useTransition,
} from "react";
import * as React from "react";

import {
  addToCartAction,
  clearCartAction,
  getCartAction,
  removeFromCartAction,
  updateCartItemAction,
} from "@/providers/cart/cart-actions";
import type { StoreCart, StoreCartItem } from "@/providers/cart/store-cart";
import type { Cart, Product } from "@vyadove/types";

type CartAction =
  | {
      type: "ADD_ITEM";
      variantId: string;
      quantity: number;
      product?: Product;
    }
  | { type: "UPDATE_ITEM"; variantId: string; quantity: number }
  | { type: "REMOVE_ITEM"; variantId: string }
  | { type: "CLEAR_CART" }
  | { type: "SYNC_CART"; cart: Cart };

interface CartContextType {
  cart: StoreCart | null;
  items: StoreCartItem[];
  isCartOpen: boolean;
  isLoading: boolean;
  isUpdatingCart: boolean;
  itemCount: number; // Total quantity of all items
  totalItems: number; // Alias for itemCount to match react-use-cart
  totalUniqueItems: number;
  cartTotal: number;
  isEmpty: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: (value?: boolean) => void;
  addItem: (
    variantId: string,
    quantity: number,
    product?: Product,
  ) => Promise<{ success: boolean; error?: unknown }>;
  updateItemQuantity: (
    variantId: string,
    quantity: number,
  ) => Promise<{ success: boolean; error?: unknown }>;
  removeItem: (
    variantId: string,
  ) => Promise<{ success: boolean; error?: unknown }>;
  emptyCart: () => Promise<{ success: boolean; error?: unknown }>;
}

const initialCartState = {
  id: 0,
  cartItems: [],
  completed: false,
  updatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
};

const calculateItemTotals = (items: StoreCart["cartItems"] = []) =>
  items.map((item) => {
    if (item?.variant) {
      return item;
    }

    const price = item?.variant?.price || 0;
    const quantity = item.quantity ?? 0;

    return {
      ...item,
      price,
      quantity,
      itemTotal: price * quantity,
    };
  });

const calculateTotalItems = (items: StoreCart["cartItems"] = []) =>
  items.reduce((sum, item) => sum + (item.quantity ?? 0), 0);

const calculateUniqueItems = (items: any[]) => items.length;

const calculateTotal = (items: StoreCart["cartItems"] = []) =>
  items.reduce(
    (total, item) => total + (item.quantity ?? 0) * (item.price ?? 0),
    0,
  );

const generateCartState = (cart: Cart) => {
  const totalUniqueItems = calculateUniqueItems(cart.cartItems || []);
  const isEmpty = totalUniqueItems === 0;

  const storeCart = cart as unknown as StoreCart;

  const withVariants = storeCart?.cartItems?.map((item) => {
    const product = typeof item.product === "object" ? item.product : undefined;
    const variant = product?.variants?.find((v) => v.id === item.variantId);

    return {
      ...item,
      // product,
      variant,
      price: variant ? variant.price : 0,
    };
  });

  const withTotals = calculateItemTotals(withVariants);

  return {
    ...cart,
    totalUniqueItems,
    totalItems: calculateTotalItems(withTotals),
    cartItems: withTotals,
    cartTotal: calculateTotal(withTotals),
    isEmpty,
  } as StoreCart;
};

function cartReducer(state: Cart, action: CartAction): Cart {
  switch (action.type) {
    case "ADD_ITEM": {
      if (!state) {
        return {
          id: 0,
          // sessionId: `temp_${Date.now()}`,
          cartItems: [
            {
              variantId: action.variantId,
              product: (action.product as any) || 0,
              quantity: action.quantity,
            },
          ],
          completed: false,
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        };
      }

      const items = state.cartItems || [];
      const existingItemIndex = items.findIndex(
        (item) => item.variantId === action.variantId,
      );

      if (existingItemIndex >= 0) {
        const existingItem = items[existingItemIndex];

        if (existingItem) {
          const updatedItems = [...items];

          updatedItems[existingItemIndex] = {
            ...existingItem,
            quantity: existingItem.quantity + action.quantity,
          };

          return {
            ...state,
            cartItems: updatedItems,
          };
        }
      }

      return {
        ...state,
        cartItems: [
          ...items,
          {
            variantId: action.variantId,
            product: (action.product as any) || 0,
            quantity: action.quantity,
          },
        ],
      };
    }

    case "UPDATE_ITEM": {
      if (!state) return state;

      const items = state.cartItems || [];

      if (action.quantity <= 0) {
        return {
          ...state,
          cartItems: items.filter(
            (item) => item.variantId !== action.variantId,
          ),
        };
      }

      const updatedItems = items.map((item) => {
        if (item.variantId === action.variantId) {
          return { ...item, quantity: action.quantity };
        }

        return item;
      });

      return {
        ...state,
        cartItems: updatedItems,
      };
    }

    case "REMOVE_ITEM": {
      if (!state) return state;

      const items = state.cartItems || [];

      return {
        ...state,
        cartItems: items.filter((item) => item.variantId !== action.variantId),
      };
    }

    case "CLEAR_CART": {
      return state ? { ...state, cartItems: [] } : state;
    }

    case "SYNC_CART": {
      return action.cart;
    }

    default:
      return state;
  }
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [actualCart, setActualCart] = useState<Cart>(initialCartState);
  const [optimisticCart, setOptimisticCart] = useOptimistic(
    actualCart,
    cartReducer,
  );

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startCartTransition] = useTransition();
  const isUpdatingCart = isPending;

  // Derived state - memoized for performance
  const derivedState = React.useMemo(
    () => generateCartState(optimisticCart),
    [optimisticCart],
  );

  const items = React.useMemo(
    () => derivedState.cartItems || [],
    [derivedState],
  );

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const totalUniqueItems = useMemo(() => items.length, [items]);

  const cartTotal = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + (item.variant?.price || 0) * item.quantity,
        0,
      ),
    [items],
  );

  const isEmpty = useMemo(() => itemCount === 0, [itemCount]);

  // Initial load
  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const cartResponse = await getCartAction();
        const cart = cartResponse || initialCartState;

        if (!isMounted) return;

        setActualCart(cart);
        // Keep optimistic state in sync on initial load
        setOptimisticCart({ type: "SYNC_CART", cart });
      } catch (error) {
        console.error("Failed to load cart:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [setOptimisticCart]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = (value?: boolean) =>
    setIsCartOpen((prev) => (value !== undefined ? value : !prev));

  const addItem = async (
    variantId: string,
    quantity = 1,
    product?: Product,
  ) => {
    const rollbackCart = actualCart;

    // Optimistic update - must NOT be in transition for smooth UI
    setOptimisticCart({ type: "ADD_ITEM", variantId, quantity, product });

    try {
      const productId = product?.id;
      const updatedCart = await addToCartAction({
        variantId,
        quantity,
        productId,
      });

      // Update actual cart - useOptimistic will auto-sync
      startCartTransition(() => {
        setActualCart(updatedCart);
      });

      return { success: true };
    } catch (error) {
      console.error("Failed to add to cart:", error);

      // Rollback on error
      startCartTransition(() => {
        setActualCart(rollbackCart);
      });

      return { success: false, error };
    }
  };

  const updateItemQuantity = async (variantId: string, quantity: number) => {
    const rollbackCart = actualCart;

    // Optimistic update - must NOT be in transition for smooth UI
    setOptimisticCart({ type: "UPDATE_ITEM", variantId, quantity });

    try {
      // Find the item to get its productId
      const item = optimisticCart?.cartItems?.find(
        (item) => item.variantId === variantId,
      );

      if (!item) {
        return { success: false, error: "Item not found" };
      }

      const productId =
        typeof item?.product === "object" ? item.product.id : item?.product;

      const updatedCart = await updateCartItemAction({
        variantId,
        quantity,
        productId,
      });

      // Update actual cart - useOptimistic will auto-sync
      startCartTransition(() => {
        setActualCart(updatedCart);
      });

      return { success: true };
    } catch (error) {
      console.error("Failed to update cart item:", error);

      // Rollback on error
      startCartTransition(() => {
        setActualCart(rollbackCart);
      });

      return { success: false, error };
    }
  };

  const removeItem = async (variantId: string) => {
    const rollbackCart = actualCart;

    // Optimistic update - must NOT be in transition for smooth UI
    setOptimisticCart({ type: "REMOVE_ITEM", variantId });

    try {
      // Find the item to get its productId
      const item = optimisticCart?.cartItems?.find(
        (item) => item.variantId === variantId,
      );

      if (!item) {
        return { success: false, error: "Item not found" };
      }

      // const productId =
      //   typeof item?.product === "object" ? item.product.id : item?.product;

      const updatedCart = await removeFromCartAction({ variantId });

      // Update actual cart - useOptimistic will auto-sync
      startCartTransition(() => {
        setActualCart(updatedCart);
      });

      return { success: true };
    } catch (error) {
      console.error("Failed to remove from cart:", error);

      // Rollback on error
      startCartTransition(() => {
        setActualCart(rollbackCart);
      });

      return { success: false, error };
    }
  };

  const emptyCart = async () => {
    const rollbackCart = actualCart;

    // Optimistic update - must NOT be in transition for smooth UI
    setOptimisticCart({ type: "CLEAR_CART" });

    try {
      await clearCartAction();

      // Update actual cart - useOptimistic will auto-sync
      startCartTransition(() => {
        setActualCart((prev) => ({
          ...prev,
          cartItems: [],
        }));
      });

      return { success: true };
    } catch (error) {
      console.error("Failed to clear cart:", error);

      // Rollback on error
      startCartTransition(() => {
        setActualCart(rollbackCart);
      });

      return { success: false, error };
    }
  };

  const value = {
    cart: derivedState,
    items,
    isCartOpen,
    isLoading,
    isUpdatingCart,
    itemCount,
    totalItems: itemCount,
    totalUniqueItems,
    cartTotal,
    isEmpty,
    openCart,
    closeCart,
    toggleCart,
    addItem,
    updateItemQuantity,
    removeItem,
    emptyCart,
  };

  return (
    <CartContext.Provider
      value={value}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
