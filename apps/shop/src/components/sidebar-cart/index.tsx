"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";

import { useCheckout } from "@/providers/checkout";
import { Button } from "@ui/shadcn/button";
import { Drawer } from "vaul";

import CartIcon from "@/components/icons/cart-icon";

import SidebarCartEmpty from "./sidebar-cart-empty";
import SidebarCartItems from "./sidebar-cart-items";
import { useSidebarCartStore } from "./sidebar-cart.store";

const AUTO_CLOSE_DELAY = 5000; // 5 seconds

function SidebarCart() {
  const { cartTotal, items, totalUniqueItems, updateItemQuantity } =
    useCheckout();

  const {
    isCartOpen,
    shouldAutoClose,
    toggleCart,
    closeCart,
    cancelAutoClose,
  } = useSidebarCartStore();

  const [isMounted, setIsMounted] = useState(false);
  const autoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);

  const hasItems = items && items.length > 0;

  // Clear auto-close timer
  const clearAutoCloseTimer = useCallback(() => {
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }
  }, []);

  // Handle user interaction - cancel auto-close
  const handleUserInteraction = useCallback(() => {
    if (shouldAutoClose) {
      clearAutoCloseTimer();
      cancelAutoClose();
    }
  }, [shouldAutoClose, clearAutoCloseTimer, cancelAutoClose]);

  const modifyQuantity = async (
    variantId: string,
    currentQuantity: number,
    delta: number,
  ) => {
    handleUserInteraction(); // User is interacting, cancel auto-close
    await updateItemQuantity(variantId, currentQuantity + delta);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto-close timer effect
  useEffect(() => {
    if (isCartOpen && shouldAutoClose) {
      clearAutoCloseTimer();
      autoCloseTimerRef.current = setTimeout(() => {
        closeCart();
      }, AUTO_CLOSE_DELAY);
    }

    return () => clearAutoCloseTimer();
  }, [isCartOpen, shouldAutoClose, closeCart, clearAutoCloseTimer]);

  // hide sidebar when esc pressed
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeCart();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeCart]);

  return (
    <Drawer.Root direction="right" onOpenChange={toggleCart} open={isCartOpen}>
      <Drawer.Portal>
        <Drawer.Overlay
          className="fixed inset-0 z-90 bg-black/40"
          onClick={() => toggleCart(false)}
        />
        <Drawer.Content
          className="fixed top-0 right-1 bottom-0 z-95 flex w-lg outline-none"
          style={
            { "--initial-transform": "calc(100% + 8px)" } as React.CSSProperties
          }
        >
          <div
            className="flex h-full w-full grow flex-col overflow-hidden rounded-b-2xl bg-white"
            onClick={handleUserInteraction}
            onMouseMove={handleUserInteraction}
          >
            <div className="mx-auto flex h-full w-full flex-col">
              {/* Header - Dark themed with gradient and rounded bottom */}
              <div className="from-primary/95 to-primary flex items-center gap-3 rounded-b-3xl bg-gradient-to-b px-5 py-9">
                {/* Cart icon in rounded container */}
                <div className="bg-primary-foreground/15 flex size-10 items-center justify-center rounded-lg">
                  <CartIcon className="fill-primary-foreground size-5" />
                </div>

                {/* Title */}
                <h3 className="text-primary-foreground text-lg font-semibold tracking-tight">
                  Shopping Cart
                </h3>

                {/* Item count badge */}
                <span className="bg-primary-foreground/20 text-primary-foreground flex size-7 items-center justify-center rounded-full text-sm font-medium">
                  {isMounted ? totalUniqueItems : 0}
                </span>

                {/* Close button */}
                <Button
                  className="text-primary-foreground hover:bg-primary-foreground/15 ml-auto aspect-square border-0 bg-transparent"
                  onClick={closeCart}
                  size="icon"
                  variant="ghost"
                >
                  <IoClose className="size-5" />
                </Button>
              </div>

              {/* Content */}
              {hasItems ? (
                <SidebarCartItems
                  cartTotal={cartTotal}
                  items={items}
                  onClose={closeCart}
                  onQuantityChange={modifyQuantity}
                  totalUniqueItems={totalUniqueItems}
                />
              ) : (
                <SidebarCartEmpty onClose={closeCart} />
              )}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

export default SidebarCart;
