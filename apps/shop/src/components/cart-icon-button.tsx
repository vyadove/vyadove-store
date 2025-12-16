"use client";

import React from "react";

import { useCheckout } from "@/providers/checkout";
import { Button } from "@ui/shadcn/button";

import SidebarCart from "@/components/sidebar-cart";

import CartIcon from "./icons/cart-icon";

export function CartIconButton() {
  const { totalItems: itemCount, totalUniqueItems, toggleCart } = useCheckout();

  return (
    <>
      {/*<ShoppingBag className="h-5 w-5" />*/}

      <Button
        aria-label={`Open cart (${itemCount} items)`}
        className="hover:bg-accent-foreground relative cursor-pointer border-none !bg-transparent"
        onClick={() => toggleCart(true)}
        size="icon"
        variant="outline"
      >
        <CartIcon className="size-5" />

        <span className="bg-accent-foreground text-accent absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold">
          {totalUniqueItems > 99 ? "99+" : totalUniqueItems}
        </span>
      </Button>

      <SidebarCart />
    </>
  );
}
