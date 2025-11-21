"use client";

import * as React from "react";

import {
  addToCartAction,
  getCartAction,
  removeFromCartAction,
  updateCartItemAction,
} from "@/actions/cart-actions";
import type { Cart, ProductInfo } from "commerce-kit";
import { toast } from "@/components/ui/hot-toast";

// ─────────────────────────────────────────────
// UI-level Item + Metadata (from cart-context-2)
// ─────────────────────────────────────────────

export interface UiItem {
  id: string;
  price: number;
  quantity: number;
  itemTotal?: number;
  product?: ProductInfo;
  // keep a reference to the raw server item if needed
  raw?: any;
  [key: string]: any;
}

export interface Metadata {
  [key: string]: any;
}

export interface DerivedCartState {
  id: string;
  items: UiItem[];
  isEmpty: boolean;
  totalItems: number;
  totalUniqueItems: number;
  cartTotal: number;
  metadata: Metadata;
}

// ─────────────────────────────────────────────
// Cart actions for optimistic server Cart
// ─────────────────────────────────────────────

type CartAction =
  | {
      type: "ADD_ITEM";
      variantId: string;
      quantity: number;
      product?: ProductInfo;
      // optional client-side price for hybrid pricing
      clientPrice?: number;
    }
  | { type: "UPDATE_ITEM"; variantId: string; quantity: number }
  | { type: "REMOVE_ITEM"; variantId: string }
  | { type: "SYNC_CART"; cart: Cart | null };

export interface CartContextType extends DerivedCartState {
  // raw server-backed (optimistic) cart
  cart: Cart | null;
  isCartOpen: boolean;
  isLoading: boolean;
  isUpdatingCart: boolean;

  openCart: () => void;
  closeCart: () => void;

  optimisticAdd: (
    variantId: string,
    quantity?: number,
    product?: ProductInfo,
    options?: { clientPrice?: number },
  ) => Promise<void>;

  optimisticUpdate: (variantId: string, quantity: number) => Promise<void>;
  optimisticRemove: (variantId: string) => Promise<void>;

  // convenience helpers (from cart-context-2)
  getItem: (id: UiItem["id"]) => UiItem | undefined;
  inCart: (id: UiItem["id"]) => boolean;

  // metadata methods
  clearCartMetadata: () => void;
  setCartMetadata: (metadata: Metadata) => void;
  updateCartMetadata: (metadata: Metadata) => void;
}

// ─────────────────────────────────────────────
// Reducer for the raw Cart (server shape)
// ─────────────────────────────────────────────

function cartReducer(state: Cart | null, action: CartAction): Cart | null {
  switch (action.type) {
    case "ADD_ITEM": {
      const baseItem = {
        id: action.variantId,
        productId: action.variantId,
        variantId: action.variantId,
        quantity: action.quantity,
        // HYBRID PRICING:
        // - use clientPrice for optimistic UI if provided
        // - server will overwrite with real price when it returns
        price: action.clientPrice ?? 0,
        product: action.product,
      };

      if (!state) {
        return {
          id: "optimistic",
          items: [baseItem],
          total: 0,
          currency: "USD",
        };
      }

      const existingIndex = state.items.findIndex(
        (item) => (item.variantId || item.productId) === action.variantId,
      );

      if (existingIndex >= 0) {
        const existingItem = state.items[existingIndex]!;
        const updatedItems = [...state.items];

        updatedItems[existingIndex] = {
          ...existingItem,
          quantity: (existingItem?.quantity ?? 0) + action.quantity,
          // keep optimistic client price if server hasn't given one
          price:
            existingItem?.price ??
            action?.clientPrice ??
            (existingItem as any)?.price ??
            0,
        };

        return {
          ...state,
          items: updatedItems,
        };
      }

      return {
        ...state,
        items: [...state.items, baseItem],
      };
    }

    case "UPDATE_ITEM": {
      if (!state) return state;

      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (item) => (item.variantId || item.productId) !== action.variantId,
          ),
        };
      }

      const updatedItems = state.items.map((item) => {
        if ((item.variantId || item.productId) === action.variantId) {
          return { ...item, quantity: action.quantity };
        }

        return item;
      });

      return {
        ...state,
        items: updatedItems,
      };
    }

    case "REMOVE_ITEM": {
      if (!state) return state;

      return {
        ...state,
        items: state.items.filter(
          (item) => (item.variantId || item.productId) !== action.variantId,
        ),
      };
    }

    case "SYNC_CART": {
      return action.cart;
    }

    default:
      return state;
  }
}

// ─────────────────────────────────────────────
// generateCartState + helpers (from cart-context-2)
// adapted for UiItem + hybrid pricing
// ─────────────────────────────────────────────

// NOTE: we will always call this with a full items array
const emptyDerivedState: DerivedCartState = {
  id: "",
  items: [],
  isEmpty: true,
  totalItems: 0,
  totalUniqueItems: 0,
  cartTotal: 0,
  metadata: {},
};

const generateCartState = (
  items: UiItem[],
  state: Partial<DerivedCartState> = {},
): DerivedCartState => {
  const totalUniqueItems = calculateUniqueItems(items);
  const isEmpty = totalUniqueItems === 0;

  const withTotals = calculateItemTotals(items);

  return {
    ...emptyDerivedState,
    ...state,
    items: withTotals,
    totalItems: calculateTotalItems(withTotals),
    totalUniqueItems,
    cartTotal: calculateTotal(withTotals),
    isEmpty,
  };
};

// Use "effectivePrice": prefer server price, fallback to any client price.
const calculateItemTotals = (items: UiItem[]): UiItem[] =>
  items.map((item) => {
    const price =
      typeof item.price === "number"
        ? item.price
        : ((item as any).clientPrice ?? 0);
    const quantity = item.quantity ?? 0;

    return {
      ...item,
      price,
      quantity,
      itemTotal: price * quantity,
    };
  });

const calculateTotal = (items: UiItem[]) =>
  items.reduce(
    (total, item) => total + (item.quantity ?? 0) * (item.price ?? 0),
    0,
  );

const calculateTotalItems = (items: UiItem[]) =>
  items.reduce((sum, item) => sum + (item.quantity ?? 0), 0);

const calculateUniqueItems = (items: UiItem[]) => items.length;

// Map server Cart -> UiItem[] for UI calculations
const mapCartToUiItems = (cart: Cart | null): UiItem[] => {
  if (!cart) return [];

  return cart.items.map((item: any) => {
    const quantity = item.quantity ?? 0;
    const price =
      typeof item.price === "number"
        ? item.price
        : ((item.clientPrice as number | undefined) ?? 0);

    return {
      id: item.variantId || item.productId || item.id,
      price,
      quantity,
      product: item.product,
      raw: item,
    };
  });
};

// ─────────────────────────────────────────────
// Context & Provider
// ─────────────────────────────────────────────

const CartContext = React.createContext<CartContextType | null>(null);

export function useCart() {
  const context = React.useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  // raw server-backed cart
  const [actualCart, setActualCart] = React.useState<Cart | null>(null);
  const [optimisticCart, setOptimisticCart] = React.useOptimistic(
    actualCart,
    cartReducer,
  );

  const [metadata, setMetadata] = React.useState<Metadata>({});
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isPending, startCartTransition] = React.useTransition();
  const isUpdatingCart = isPending;

  // ── Derived UI items & totals via generateCartState ──
  const uiItems = React.useMemo(
    () => mapCartToUiItems(optimisticCart),
    [optimisticCart],
  );

  const derivedState = React.useMemo(
    () =>
      generateCartState(uiItems, {
        id: optimisticCart?.id ?? "local",
        metadata,
      }),
    [uiItems, metadata, optimisticCart?.id],
  );

  // ── Initial load from server ──
  React.useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const cart = await getCartAction();

        if (!isMounted) return;

        setActualCart(cart);
        setOptimisticCart({ type: "SYNC_CART", cart });
      } catch (error) {
        console.error("Failed to load cart:", error);

        // todo do a toast
        /*toast({

          title: "Could not load your cart",
          description: "Please refresh the page and try again.",
          variant: "destructive",
        });*/
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [setOptimisticCart, toast]);

  // ── UI controls ──
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // ── Convenience helpers on derived items ──
  const getItem = React.useCallback(
    (id: UiItem["id"]) => derivedState.items.find((i) => i.id === id),
    [derivedState.items],
  );

  const inCart = React.useCallback(
    (id: UiItem["id"]) => derivedState.items.some((i) => i.id === id),
    [derivedState.items],
  );

  // ── Metadata helpers ──
  const clearCartMetadata = () => setMetadata({});
  const setCartMetadata = (meta: Metadata) => setMetadata(meta ?? {});
  const updateCartMetadata = (meta: Metadata) =>
    setMetadata((prev) => ({ ...prev, ...(meta ?? {}) }));

  // ─────────────────────────────────────────────
  // Optimistic mutations (hybrid pricing + rollback)
  // ─────────────────────────────────────────────

  const optimisticAdd = async (
    variantId: string,
    quantity = 1,
    product?: ProductInfo,
    options?: { clientPrice?: number },
  ) => {
    if (!variantId || quantity <= 0) return;

    const rollbackCart = optimisticCart;

    // Optimistic UI update (clientPrice used until server responds)
    setOptimisticCart({
      type: "ADD_ITEM",
      variantId,
      quantity,
      product,
      clientPrice: options?.clientPrice,
    });

    try {
      const updatedCart = await addToCartAction(variantId, quantity);

      startCartTransition(() => {
        setActualCart(updatedCart);
        setOptimisticCart({ type: "SYNC_CART", cart: updatedCart });
      });
    } catch (error) {
      console.error("Failed to add to cart:", error);

      // rollback only on error
      startCartTransition(() => {
        setOptimisticCart({ type: "SYNC_CART", cart: rollbackCart });
      });

      // todo - toast
      /*toast({
        title: "Could not add item",
        description: "Something went wrong while updating your cart.",
        variant: "destructive",
      });*/

      throw error;
    }
  };

  const optimisticUpdate = async (variantId: string, quantity: number) => {
    if (!variantId) return;

    const rollbackCart = optimisticCart;

    setOptimisticCart({ type: "UPDATE_ITEM", variantId, quantity });

    try {
      const updatedCart = await updateCartItemAction(variantId, quantity);

      startCartTransition(() => {
        setActualCart(updatedCart);
        setOptimisticCart({ type: "SYNC_CART", cart: updatedCart });
      });
    } catch (error) {
      console.error("Failed to update cart item:", error);

      startCartTransition(() => {
        setOptimisticCart({ type: "SYNC_CART", cart: rollbackCart });
      });

      // todo - toast
      /*toast({
        title: "Could not update item",
        description: "Please try again.",
        variant: "destructive",
      });*/

      throw error;
    }
  };

  const optimisticRemove = async (variantId: string) => {
    if (!variantId) return;

    const rollbackCart = optimisticCart;

    setOptimisticCart({ type: "REMOVE_ITEM", variantId });

    try {
      const updatedCart = await removeFromCartAction(variantId);

      startCartTransition(() => {
        setActualCart(updatedCart);
        setOptimisticCart({ type: "SYNC_CART", cart: updatedCart });
      });
    } catch (error) {
      console.error("Failed to remove from cart:", error);

      startCartTransition(() => {
        setOptimisticCart({ type: "SYNC_CART", cart: rollbackCart });
      });

      // todo - toast
      /*toast({
        title: "Could not remove item",
        description: "Please try again.",
        variant: "destructive",
      });*/

      throw error;
    }
  };

  const value: CartContextType = {
    // raw cart from server (optimistic)
    cart: optimisticCart,

    // derived state (generateCartState)
    id: derivedState.id,
    items: derivedState.items,
    isEmpty: derivedState.isEmpty,
    totalItems: derivedState.totalItems,
    totalUniqueItems: derivedState.totalUniqueItems,
    cartTotal: derivedState.cartTotal,
    metadata: derivedState.metadata,

    // UI flags
    isCartOpen,
    isLoading,
    isUpdatingCart,

    // actions
    openCart,
    closeCart,
    optimisticAdd,
    optimisticUpdate,
    optimisticRemove,

    // helpers
    getItem,
    inCart,

    // metadata helpers
    clearCartMetadata,
    setCartMetadata,
    updateCartMetadata,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
