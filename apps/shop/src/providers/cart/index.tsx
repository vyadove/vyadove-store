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
import { useLocalStorage } from "react-use";

import {
  addToCartAction,
  clearCartAction,
  getCartAction,
  removeFromCartAction,
  updateCartItemAction,
} from "@/providers/cart/cart-actions";
import type { StoreCart, StoreCartItem } from "@/providers/cart/store-cart";
import type { Cart, Product } from "@vyadove/types";

import { toast } from "@/components/ui/hot-toast";

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

const enrichCartWithVariants = (
  cart: Cart,
  loadingItems: Set<string> = new Set(),
): StoreCart => {
  const items = cart.cartItems || [];

  const enrichedItems = items.map((item) => {
    const product = typeof item.product === "object" ? item.product : undefined;
    const variant = product?.variants?.find((v) => v.id === item.variantId);
    const price = variant?.price?.amount || 0;

    return {
      ...item,
      variant,
      price,
      itemTotal: price * item.quantity,
      isLoading: loadingItems.has(item.variantId),
    } as StoreCartItem;
  });

  const totalItems = enrichedItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );
  const totalUniqueItems = enrichedItems.length;
  const cartTotal = enrichedItems.reduce(
    (sum, item) => sum + item.itemTotal,
    0,
  );

  return {
    ...cart,
    cartItems: enrichedItems,
    totalItems,
    totalUniqueItems,
    cartTotal,
    isEmpty: totalUniqueItems === 0,
    metadata: {},
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

  // Track which items are currently syncing with backend
  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set());

  // Derived state - single enrichment with all calculations
  const cart = useMemo(
    () => enrichCartWithVariants(optimisticCart, loadingItems),
    [optimisticCart, loadingItems],
  );

  const items = cart.cartItems || [];
  const { totalItems: itemCount, totalUniqueItems, cartTotal, isEmpty } = cart;

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
    setLoadingItems((prev) => new Set(prev).add(variantId));
    const rollbackCart = actualCart;

    try {
      await new Promise<void>((resolve, reject) => {
        startCartTransition(async () => {
          try {
            setOptimisticCart({
              type: "ADD_ITEM",
              variantId,
              quantity,
              product,
            });

            const productId = product?.id;
            const updatedCart = await addToCartAction({
              variantId,
              quantity,
              productId,
            });

            setActualCart(updatedCart);
            resolve();
          } catch (err) {
            reject(err);
          }
        });
      });

      return { success: true };
    } catch (error) {
      console.error("Failed to add to cart:", error);

      startCartTransition(() => {
        setActualCart(rollbackCart);
      });

      toast.error(
        error instanceof Error ? error.message : "Failed to add item to cart",
      );

      return { success: false, error };
    } finally {
      setLoadingItems((prev) => {
        const next = new Set(prev);

        next.delete(variantId);

        return next;
      });
    }
  };

  const updateItemQuantity = async (variantId: string, quantity: number) => {
    setLoadingItems((prev) => new Set(prev).add(variantId));
    const rollbackCart = actualCart;

    try {
      await new Promise<void>((resolve, reject) => {
        setOptimisticCart({ type: "UPDATE_ITEM", variantId, quantity });

        startCartTransition(async () => {
          try {
            const item = actualCart?.cartItems?.find(
              (item) => item.variantId === variantId,
            );

            if (!item) {
              reject(new Error("Item not found"));

              return;
            }

            const productId =
              typeof item.product === "object" ? item.product.id : item.product;

            const updatedCart = await updateCartItemAction({
              variantId,
              quantity,
              productId,
            });

            setActualCart(updatedCart);
            resolve();
          } catch (err) {
            reject(err);
          }
        });
      });

      return { success: true };
    } catch (error) {
      console.error("Failed to update cart item:", error);

      startCartTransition(() => {
        setActualCart(rollbackCart);
      });

      toast.error(
        error instanceof Error ? error.message : "Failed to update quantity",
      );

      return { success: false, error };
    } finally {
      setLoadingItems((prev) => {
        const next = new Set(prev);

        next.delete(variantId);

        return next;
      });
    }
  };

  const removeItem = async (variantId: string) => {
    setLoadingItems((prev) => new Set(prev).add(variantId));
    const rollbackCart = actualCart;

    try {
      await new Promise<void>((resolve, reject) => {
        startCartTransition(async () => {
          try {
            setOptimisticCart({ type: "REMOVE_ITEM", variantId });

            const updatedCart = await removeFromCartAction({ variantId });

            setActualCart(updatedCart);
            resolve();
          } catch (err) {
            reject(err);
          }
        });
      });

      return { success: true };
    } catch (error) {
      console.error("Failed to remove from cart:", error);

      startCartTransition(() => {
        setActualCart(rollbackCart);
      });

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to remove item from cart",
      );

      return { success: false, error };
    } finally {
      setLoadingItems((prev) => {
        const next = new Set(prev);

        next.delete(variantId);

        return next;
      });
    }
  };

  const emptyCart = async () => {
    const rollbackCart = actualCart;

    try {
      await new Promise<void>((resolve, reject) => {
        startCartTransition(async () => {
          try {
            setOptimisticCart({ type: "CLEAR_CART" });

            await clearCartAction();

            setActualCart((prev) => ({
              ...prev,
              cartItems: [],
            }));

            resolve();
          } catch (err) {
            reject(err);
          }
        });
      });

      return { success: true };
    } catch (error) {
      console.error("Failed to clear cart:", error);

      startCartTransition(() => {
        setActualCart(rollbackCart);
      });

      toast.error(
        error instanceof Error ? error.message : "Failed to clear cart",
      );

      return { success: false, error };
    }
  };

  const value = {
    cart,
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

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
