"use client";

import {
  createContext,
  type ReactNode,
  startTransition,
  useContext,
  useEffect,
  useOptimistic,
  useState,
  useTransition,
} from "react";

import {
  addToCartAction,
  getCartAction,
  removeFromCartAction,
  updateCartItemAction,
} from "@/actions/cart-actions";
import type { Cart, ProductInfo } from "commerce-kit";

type CartAction =
  | {
      type: "ADD_ITEM";
      variantId: string;
      quantity: number;
      product?: ProductInfo;
    }
  | { type: "UPDATE_ITEM"; variantId: string; quantity: number }
  | { type: "REMOVE_ITEM"; variantId: string }
  | { type: "SYNC_CART"; cart: Cart | null };

interface CartContextType {
  cart: Cart | null;
  isCartOpen: boolean;
  isLoading: boolean;
  isUpdatingCart: boolean;
  itemCount: number;
  openCart: () => void;
  closeCart: () => void;
  optimisticAdd: (
    variantId: string,
    quantity: number,
    product?: ProductInfo,
  ) => Promise<void>;
  optimisticUpdate: (variantId: string, quantity: number) => Promise<void>;
  optimisticRemove: (variantId: string) => Promise<void>;
}

function cartReducer(state: Cart | null, action: CartAction): Cart | null {
  switch (action.type) {
    case "ADD_ITEM": {
      if (!state) {
        return {
          id: "optimistic",
          items: [
            {
              id: action.variantId,
              productId: action.variantId,
              variantId: action.variantId,
              quantity: action.quantity,
              price: 0,
              product: action.product,
            },
          ],
          total: 0,
          currency: "USD",
        };
      }

      const existingItemIndex = state.items.findIndex(
        (item) => (item.variantId || item.productId) === action.variantId,
      );

      if (existingItemIndex >= 0) {
        const existingItem = state.items[existingItemIndex];

        if (existingItem) {
          const updatedItems = [...state.items];

          updatedItems[existingItemIndex] = {
            ...existingItem,
            quantity: existingItem.quantity + action.quantity,
          };

          return {
            ...state,
            items: updatedItems,
          };
        }
      }

      return {
        ...state,
        items: [
          ...state.items,
          {
            id: action.variantId,
            productId: action.variantId,
            variantId: action.variantId,
            quantity: action.quantity,
            price: 0,
            product: action.product,
          },
        ],
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

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [actualCart, setActualCart] = useState<Cart | null>(null);
  const [optimisticCart, setOptimisticCart] = useOptimistic(
    actualCart,
    cartReducer,
  );

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startCartTransition] = useTransition();
  const isUpdatingCart = isPending;

  // Derive item count from optimistic cart for snappy UI
  const itemCount =
    optimisticCart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  // Initial load
  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const cart = await getCartAction();

        if (!isMounted) return;

        setActualCart(cart);

        // Keep optimistic state in sync on initial load
        setOptimisticCart({ type: "SYNC_CART", cart });
      } catch (error) {
        console.error("Failed to load cart:", error);
        /*toast({
          title: "Could not load your cart",
          description: "Please refresh the page and try again.",
          variant: "destructive",
        })*/
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

  const optimisticAdd = async (
    variantId: string,
    quantity = 1,
    product?: ProductInfo,
  ) => {
    // Snapshot for potential rollback
    const rollbackCart = optimisticCart;

    // Optimistic UI
    setOptimisticCart({ type: "ADD_ITEM", variantId, quantity, product });

    try {
      const updatedCart = await addToCartAction(variantId, quantity);

      // Success: sync both actual + optimistic state to server data
      startCartTransition(() => {
        setActualCart(updatedCart);
        setOptimisticCart({ type: "SYNC_CART", cart: updatedCart });
      });
    } catch (error) {
      console.error("Failed to add to cart:", error);

      // Rollback only on error
      startCartTransition(() => {
        setOptimisticCart({ type: "SYNC_CART", cart: rollbackCart });
      });

      /*toast({
        title: "Could not add item",
        description: "Something went wrong while updating your cart.",
        variant: "destructive",
      })*/ throw error;
    }
  };

  const optimisticUpdate = async (variantId: string, quantity: number) => {
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

      /*toast({
        title: "Could not update item",
        description: "Please try again.",
        variant: "destructive",
      })*/ throw error;
    }
  };

  const optimisticRemove = async (variantId: string) => {
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

      /*toast({
        title: "Could not remove item",
        description: "Please try again.",
        variant: "destructive",
      })*/ throw error;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart: optimisticCart,
        isCartOpen,
        isLoading,
        isUpdatingCart,
        itemCount,
        openCart,
        closeCart,
        optimisticAdd,
        optimisticUpdate,
        optimisticRemove,
      }}
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
