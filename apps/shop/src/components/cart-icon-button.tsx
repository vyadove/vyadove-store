"use client";

import React from "react";

import { useCheckout } from "@/providers/checkout";
import { Button } from "@ui/shadcn/button";

import { useSidebarCartStore } from "@/components/sidebar-cart/sidebar-cart.store";

import CartIcon from "./icons/cart-icon";

export function CartIconButton() {
  const { totalItems: itemCount, totalUniqueItems } = useCheckout();
  const openCart = useSidebarCartStore((s) => s.openCart);

  return (
    <Button
      aria-label={`Open cart (${itemCount} items)`}
      className="hover:bg-accent-foreground relative cursor-pointer border-none !bg-transparent"
      onClick={openCart}
      size="icon"
      variant="outline"
    >
      <CartIcon className="size-5" />

      <span className="bg-accent-foreground text-accent absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold">
        {totalUniqueItems > 99 ? "99+" : totalUniqueItems}
      </span>
    </Button>
  );
}
