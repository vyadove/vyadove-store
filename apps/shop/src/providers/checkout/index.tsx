"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useAuth } from "@/providers/auth";
import { useCurrencyOptional } from "@/providers/currency";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Checkout, Product } from "@vyadove/types";

import { useSidebarCartStore } from "@/components/sidebar-cart/sidebar-cart.store";
import { toast } from "@/components/ui/hot-toast";

import {
  addToCheckoutAction,
  clearCheckoutAction,
  getCheckoutAction,
  removeFromCheckoutAction,
  updateCheckoutAddressAction,
  updateCheckoutCurrencyAction,
  updateCheckoutFormAction,
  updateCheckoutItemAction,
  updateCheckoutPaymentAction,
  updateCheckoutShippingAction,
} from "./checkout-actions";
import type {
  CheckoutAddressUpdate,
  CheckoutLineItem,
  EnrichedCheckoutItem,
} from "./types";

// Extended checkout type with computed fields
interface StoreCheckout extends Checkout {
  itemCount: number;
  totalItems: number;
  totalUniqueItems: number;
  isEmpty: boolean;
  enrichedItems?: EnrichedCheckoutItem[];
}

interface CheckoutContextType {
  checkout: StoreCheckout | null;
  items: EnrichedCheckoutItem[];
  isLoading: boolean;
  isUpdating: boolean;
  itemCount: number;
  totalItems: number;
  totalUniqueItems: number;
  cartTotal: number;
  total: number;
  isEmpty: boolean;
  addItem: (
    variantId: string,
    quantity: number,
    product?: Product,
    unitPrice?: number,
    participants?: number,
    openCart?: boolean,
  ) => Promise<Checkout>;
  updateItemQuantity: (
    variantId: string,
    quantity: number,
  ) => Promise<Checkout>;
  removeItem: (variantId: string) => Promise<Checkout>;
  emptyCart: () => Promise<Checkout>;
  updateAddress: (data: CheckoutAddressUpdate) => Promise<Checkout>;
  updateShipping: (shippingMethodId: number) => Promise<Checkout>;
  updatePayment: (paymentMethodId: number) => Promise<Checkout>;
  refechCheckout: () => Promise<void>;
  updateCheckoutForm: (args: {
    providerId: string;
    shippingMethodString: string;
    addresses: CheckoutAddressUpdate;
  }) => Promise<Checkout>;
}

const CheckoutContext = createContext<CheckoutContextType | null>(null);

const CHECKOUT_QUERY_KEY = ["checkout"] as const;

// Helper to enrich checkout with computed fields
function enrichCheckout(checkout: Checkout | null): StoreCheckout | null {
  if (!checkout) return null;

  const items = (checkout.items || []) as CheckoutLineItem[];
  const enrichedItems: EnrichedCheckoutItem[] = items
    .map((item) => {
      // Only process items with product objects (not IDs)
      if (typeof item.product !== "object") {
        return null;
      }

      const product = item.product as Product;
      const variant = product.variants?.find((v) => v.id === item.variantId);

      return {
        ...item,
        product,
        variant,
      } as EnrichedCheckoutItem;
    })
    .filter((item): item is EnrichedCheckoutItem => item !== null);

  const itemCount = enrichedItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalUniqueItems = enrichedItems.length;

  return {
    ...checkout,
    enrichedItems,
    itemCount,
    // subtotal: checkout.subtotal,
    // total: checkout.total,
    totalItems: itemCount,
    totalUniqueItems,
    isEmpty: totalUniqueItems === 0,
  };
}

// Optimistic update helpers
function optimisticAddItem(args: {
  oldCheckout: Checkout | null;
  variantId: string;
  quantity: number;
  productId?: number;
  unitPrice?: number;
  participants?: number;
  currency?: string;
}): Checkout {
  const {
    oldCheckout,
    variantId,
    quantity,
    productId,
    unitPrice,
    participants = 1,
    currency = "USD",
  } = args;

  if (!oldCheckout) {
    const itemTotal = unitPrice ? unitPrice * quantity * participants : 0;

    return {
      id: 0,
      sessionId: `temp-${Date.now()}`,
      items: [
        {
          variantId,
          product: productId || 0,
          quantity,
          unitPrice,
          participants,
          totalPrice: itemTotal,
          isLoading: true,
        } as CheckoutLineItem,
      ],
      status: "incomplete",
      currency,
      subtotal: itemTotal,
      shippingTotal: 0,
      taxTotal: 0,
      discountTotal: 0,
      total: itemTotal,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    } as Checkout;
  }

  const items = (oldCheckout.items || []) as CheckoutLineItem[];
  const existingItemIndex = items.findIndex(
    (item) => item.variantId === variantId,
  );

  let updatedItems: CheckoutLineItem[];

  if (existingItemIndex >= 0) {
    // Update existing item - preserve participants from existing item
    updatedItems = items.map((item, index) => {
      if (index === existingItemIndex) {
        const newQuantity = item.quantity + quantity;
        const itemParticipants = item.participants || 1;

        return {
          ...item,
          quantity: newQuantity,
          totalPrice: item.unitPrice
            ? item.unitPrice * newQuantity * itemParticipants
            : 0,
          isLoading: true,
        };
      }

      return item;
    });
  } else {
    // Add new item with participants
    updatedItems = [
      ...items,
      {
        variantId,
        product: productId || 0,
        quantity,
        unitPrice,
        participants,
        totalPrice: unitPrice ? unitPrice * quantity * participants : 0,
        isLoading: true,
      },
    ];
  }

  const newSubtotal = updatedItems.reduce(
    (sum, item) => sum + (item.totalPrice || 0),
    0,
  );

  return {
    ...oldCheckout,
    items: updatedItems,
    subtotal: newSubtotal,
    total:
      newSubtotal +
      (oldCheckout.shippingTotal || 0) +
      (oldCheckout.taxTotal || 0) -
      (oldCheckout.discountTotal || 0),
  };
}

function optimisticUpdateItem(
  oldCheckout: Checkout | null,
  variantId: string,
  quantity: number,
): Checkout | null {
  if (!oldCheckout) return null;

  const items = (oldCheckout.items || []) as CheckoutLineItem[];
  let updatedItems: CheckoutLineItem[];

  if (quantity <= 0) {
    // Remove item if quantity is 0
    updatedItems = items.filter((item) => item.variantId !== variantId);
  } else {
    // Update quantity - preserve participants
    updatedItems = items.map((item) => {
      if (item.variantId === variantId) {
        const itemParticipants = item.participants || 1;

        return {
          ...item,
          quantity,
          totalPrice: item.unitPrice
            ? item.unitPrice * quantity * itemParticipants
            : 0,
          isLoading: true,
        };
      }

      return item;
    });
  }

  const newSubtotal = updatedItems.reduce(
    (sum, item) => sum + (item.totalPrice || 0),
    0,
  );

  return {
    ...oldCheckout,
    items: updatedItems,
    subtotal: newSubtotal,
    total:
      newSubtotal +
      (oldCheckout.shippingTotal || 0) +
      (oldCheckout.taxTotal || 0) -
      (oldCheckout.discountTotal || 0),
  };
}

function optimisticRemoveItem(
  oldCheckout: Checkout | null,
  variantId: string,
): Checkout | null {
  if (!oldCheckout) return null;

  const items = (oldCheckout.items || []) as CheckoutLineItem[];
  const updatedItems = items.filter((item) => item.variantId !== variantId);

  const newSubtotal = updatedItems.reduce(
    (sum, item) => sum + (item.totalPrice || 0),
    0,
  );

  return {
    ...oldCheckout,
    items: updatedItems,
    subtotal: newSubtotal,
    total:
      newSubtotal +
      (oldCheckout.shippingTotal || 0) +
      (oldCheckout.taxTotal || 0) -
      (oldCheckout.discountTotal || 0),
  };
}

const CHECKOUT_SESSION_FLAG = "has-checkout-session";

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const openCartWithAutoClose = useSidebarCartStore(
    (s) => s.openCartWithAutoClose,
  );
  const { status: authStatus } = useAuth();
  const prevAuthStatus = useRef<string | null>(null);
  const currencyContext = useCurrencyOptional();
  const selectedCurrency = currencyContext?.currency || "USD";

  // Track whether we should fetch checkout (only if session exists)
  // Start with false to avoid hydration mismatch, then check localStorage on mount
  const [shouldFetchCheckout, setShouldFetchCheckout] = useState<{
    value: boolean;
    isInitial?: boolean;
  }>({
    isInitial: true,
    value: false,
  });

  // Check localStorage after mount to enable query if session exists
  useEffect(() => {
    const hasSession = localStorage.getItem(CHECKOUT_SESSION_FLAG) === "true";

    if (hasSession) {
      setShouldFetchCheckout({
        value: true,
        isInitial: false,
      });
    } else {
      setShouldFetchCheckout({
        value: false,
        isInitial: false,
      });
    }
  }, []);

  // Refetch checkout when auth status changes (login/logout)
  // Track last "settled" state (authenticated or unauthenticated, ignoring loading/idle)
  useEffect(() => {
    const isSettledState =
      authStatus === "authenticated" || authStatus === "unauthenticated";

    if (!isSettledState) return; // Ignore loading/idle states

    const prevSettled = prevAuthStatus.current;
    const didAuthChange = prevSettled !== null && prevSettled !== authStatus;

    if (didAuthChange) {
      // Clear and refetch checkout data
      queryClient.setQueryData(CHECKOUT_QUERY_KEY, null);
      queryClient.invalidateQueries({ queryKey: CHECKOUT_QUERY_KEY });
    }

    // Only update ref when we have a settled state
    prevAuthStatus.current = authStatus;
  }, [authStatus, queryClient]);

  // Fetch checkout - only enabled if we know a session exists
  const {
    data: checkout,
    isLoading,
    isPending,
  } = useQuery({
    queryKey: CHECKOUT_QUERY_KEY,
    queryFn: getCheckoutAction,
    staleTime: 5 * 60 * 1000, // 5 minutes
    // enabled: shouldFetchCheckout.value, // Only fetch if session flag is set
  });

  useEffect(() => {
    // Clear flag if checkout query returns undefined (session expired or completed)
    if (shouldFetchCheckout.value && !isLoading && !checkout) {
      localStorage.removeItem(CHECKOUT_SESSION_FLAG);
      setShouldFetchCheckout({
        value: false,
      });
    }
  }, [shouldFetchCheckout, checkout, isLoading]);

  // Add item mutation
  const addItemMutation = useMutation({
    mutationFn: ({
      variantId,
      quantity,
      productId,
      unitPrice,
      participants,
    }: {
      variantId: string;
      quantity: number;
      productId?: number;
      unitPrice?: number;
      participants?: number;
    }) =>
      addToCheckoutAction(
        {
          variantId,
          quantity,
          productId,
          unitPrice,
          participants,
        },
        checkout,
        selectedCurrency,
      ),
    onMutate: async ({
      variantId,
      quantity,
      productId,
      unitPrice,
      participants,
    }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: CHECKOUT_QUERY_KEY });

      // Snapshot previous value
      const previousCheckout =
        queryClient.getQueryData<Checkout>(CHECKOUT_QUERY_KEY);

      // Optimistically update
      queryClient.setQueryData<Checkout>(CHECKOUT_QUERY_KEY, (old) =>
        optimisticAddItem({
          oldCheckout: old || null,
          variantId,
          quantity,
          productId,
          unitPrice,
          participants,
          currency: selectedCurrency,
        }),
      );

      return { previousCheckout };
    },
    onSettled: (data, error, variables, onMutateResult) => {
      if (error) {
        // Rollback on error
        queryClient.setQueryData(
          CHECKOUT_QUERY_KEY,
          onMutateResult?.previousCheckout,
        );
        toast.error(error.message || "Failed to add item to cart");
      }

      if (data) {
        // Set flag to enable future queries (persists across page reloads)
        if (!shouldFetchCheckout && data.sessionId) {
          localStorage.setItem(CHECKOUT_SESSION_FLAG, "true");
          setShouldFetchCheckout({
            value: true,
          });
        }

        queryClient.setQueryData(CHECKOUT_QUERY_KEY, data);
      }
    },
    onSuccess: (data) => {
      console.log("onSuccess data --- : ", data);
    },
  });

  // Update item mutation
  const updateItemMutation = useMutation({
    mutationFn: ({
      variantId,
      quantity,
    }: {
      variantId: string;
      quantity: number;
    }) => updateCheckoutItemAction({ variantId, quantity }, checkout),
    onMutate: async ({ variantId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: CHECKOUT_QUERY_KEY });

      const previousCheckout =
        queryClient.getQueryData<Checkout>(CHECKOUT_QUERY_KEY);

      queryClient.setQueryData<Checkout | null>(CHECKOUT_QUERY_KEY, (old) =>
        optimisticUpdateItem(old || null, variantId, quantity),
      );

      return { previousCheckout };
    },
    onError: (error, _variables, context) => {
      queryClient.setQueryData(CHECKOUT_QUERY_KEY, context?.previousCheckout);
      toast.error(
        error instanceof Error ? error.message : "Failed to update quantity",
      );
    },
    onSuccess: (data) => {
      queryClient.setQueryData(CHECKOUT_QUERY_KEY, data);
    },
  });

  // Remove item mutation
  const removeItemMutation = useMutation({
    mutationFn: ({ variantId }: { variantId: string }) =>
      removeFromCheckoutAction(variantId, checkout),
    onMutate: async ({ variantId }) => {
      await queryClient.cancelQueries({ queryKey: CHECKOUT_QUERY_KEY });

      const previousCheckout =
        queryClient.getQueryData<Checkout>(CHECKOUT_QUERY_KEY);

      queryClient.setQueryData<Checkout | null>(CHECKOUT_QUERY_KEY, (old) =>
        optimisticRemoveItem(old || null, variantId),
      );

      return { previousCheckout };
    },
    onError: (error, _variables, context) => {
      queryClient.setQueryData(CHECKOUT_QUERY_KEY, context?.previousCheckout);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to remove item from cart",
      );
    },
    onSuccess: (data) => {
      queryClient.setQueryData(CHECKOUT_QUERY_KEY, data);
    },
  });

  // Clear cart mutation
  const clearCartMutation = useMutation({
    mutationFn: () => clearCheckoutAction(checkout),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: CHECKOUT_QUERY_KEY });

      const previousCheckout =
        queryClient.getQueryData<Checkout>(CHECKOUT_QUERY_KEY);

      queryClient.setQueryData<Checkout | null>(CHECKOUT_QUERY_KEY, (old) =>
        old ? { ...old, items: [], subtotal: 0, total: 0 } : null,
      );

      return { previousCheckout };
    },
    onError: (error, _variables, context) => {
      queryClient.setQueryData(CHECKOUT_QUERY_KEY, context?.previousCheckout);
      toast.error(
        error instanceof Error ? error.message : "Failed to clear cart",
      );
    },
    onSuccess: (data) => {
      queryClient.setQueryData(CHECKOUT_QUERY_KEY, data);
    },
  });

  // Update address mutation
  const updateAddressMutation = useMutation({
    mutationFn: (args: CheckoutAddressUpdate) =>
      updateCheckoutAddressAction(args, checkout),
    onSuccess: (data) => {
      queryClient.setQueryData(CHECKOUT_QUERY_KEY, data);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update address",
      );
    },
  });

  // Update shipping mutation
  const updateShippingMutation = useMutation({
    mutationFn: (shippingMethodId: number) =>
      updateCheckoutShippingAction(shippingMethodId, checkout),
    onSuccess: (data) => {
      queryClient.setQueryData(CHECKOUT_QUERY_KEY, data);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update shipping",
      );
    },
  });

  // Update payment mutation
  const updatePaymentMutation = useMutation({
    mutationFn: (paymentMethodId: number) =>
      updateCheckoutPaymentAction(paymentMethodId, checkout),
    onSuccess: (data) => {
      queryClient.setQueryData(CHECKOUT_QUERY_KEY, data);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update payment",
      );
    },
  });

  // Unified form update mutation
  const updateFormMutation = useMutation({
    mutationFn: ({
      providerId,
      shippingMethodString,
      addresses,
    }: {
      providerId: string;
      shippingMethodString: string;
      addresses: CheckoutAddressUpdate;
    }) =>
      updateCheckoutFormAction(
        providerId,
        shippingMethodString,
        addresses,
        checkout!,
      ),
    onSuccess: (data) => {
      queryClient.setQueryData(CHECKOUT_QUERY_KEY, data);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update checkout details",
      );
    },
  });

  // Update currency mutation
  const updateCurrencyMutation = useMutation({
    mutationFn: (currency: string) =>
      updateCheckoutCurrencyAction(currency, checkout),
    onMutate: async (currency) => {
      await queryClient.cancelQueries({ queryKey: CHECKOUT_QUERY_KEY });
      const previousCheckout =
        queryClient.getQueryData<Checkout>(CHECKOUT_QUERY_KEY);

      queryClient.setQueryData<Checkout | null>(CHECKOUT_QUERY_KEY, (old) =>
        old ? { ...old, currency } : null,
      );

      return { previousCheckout };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(CHECKOUT_QUERY_KEY, context?.previousCheckout);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(CHECKOUT_QUERY_KEY, data);
    },
  });

  // Sync currency changes to checkout (when user changes currency and checkout exists)
  useEffect(() => {
    if (!isLoading && checkout && checkout.currency !== selectedCurrency) {
      updateCurrencyMutation.mutate(selectedCurrency);
    }
  }, [selectedCurrency, checkout?.id]);

  // Enrich checkout with computed fields
  const enrichedCheckout = useMemo(
    () => enrichCheckout(checkout || null),
    [checkout],
  );

  const items = enrichedCheckout?.enrichedItems || [];
  const itemCount = enrichedCheckout?.itemCount || 0;
  const totalUniqueItems = enrichedCheckout?.totalUniqueItems || 0;

  const cartTotal = enrichedCheckout?.subtotal || 0;
  const total = enrichedCheckout?.total || 0;
  const isEmpty = enrichedCheckout?.isEmpty ?? true;

  const isCartLoading =
    isLoading || (shouldFetchCheckout.isInitial === true && isPending);

  const isUpdating =
    addItemMutation.isPending ||
    updateItemMutation.isPending ||
    removeItemMutation.isPending ||
    clearCartMutation.isPending ||
    updateAddressMutation.isPending ||
    updateShippingMutation.isPending ||
    updatePaymentMutation.isPending ||
    updateFormMutation.isPending ||
    updateCurrencyMutation.isPending;

  const addItem = async (
    variantId: string,
    quantity = 1,
    product?: Product,
    unitPrice?: number,
    participants = 1,
    openCart = true,
  ) => {
    const result = await addItemMutation.mutateAsync({
      variantId,
      quantity,
      productId: product?.id,
      unitPrice:
        unitPrice ||
        product?.variants?.find((v) => v.id === variantId)?.price?.amount,
      participants,
    });

    // Auto-open cart after successfully adding item
    if (result?.id && openCart) {
      openCartWithAutoClose();
    }

    return result;
  };

  const updateItemQuantity = async (variantId: string, quantity: number) => {
    return await updateItemMutation.mutateAsync({ variantId, quantity });
  };

  const removeItem = async (variantId: string) => {
    return await removeItemMutation.mutateAsync({ variantId });
  };

  const emptyCart = async () => {
    return await clearCartMutation.mutateAsync();
  };

  const updateAddress = async (data: CheckoutAddressUpdate) => {
    return await updateAddressMutation.mutateAsync(data);
  };

  const updateShipping = async (shippingMethodId: number) => {
    return await updateShippingMutation.mutateAsync(shippingMethodId);
  };

  const updatePayment = async (paymentMethodId: number) => {
    return await updatePaymentMutation.mutateAsync(paymentMethodId);
  };

  const updateCheckoutForm: CheckoutContextType["updateCheckoutForm"] = async (
    args,
  ) => {
    return await updateFormMutation.mutateAsync({
      ...args,
    });
  };

  const refechCheckout = async () => {
    queryClient.setQueryData(CHECKOUT_QUERY_KEY, () => null);

    return queryClient.invalidateQueries({ queryKey: CHECKOUT_QUERY_KEY });
  };

  const value: CheckoutContextType = {
    checkout: enrichedCheckout,
    items,
    isLoading: isCartLoading,
    isUpdating,
    itemCount,
    totalItems: itemCount,
    totalUniqueItems,
    cartTotal,
    total,
    isEmpty,
    addItem,
    updateItemQuantity,
    removeItem,
    emptyCart,
    updateAddress,
    updateShipping,
    updatePayment,
    updateCheckoutForm,
    refechCheckout,
  };

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);

  if (!context) {
    throw new Error("useCheckout must be used within a CheckoutProvider");
  }

  return context;
}
