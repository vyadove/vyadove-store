"use client";

import React from "react";

import { Button } from "@ui/shadcn/button";

import { CartSidebar } from "@/components/cart-sidebar";

import { useCart } from "@/context/cart-context";

import CartIcon from "./icons/cart-icon";

export function CartIconButton() {
  const { isCartOpen, openCart, closeCart, itemCount } = useCart();

  return (
    <>
      {/*<ShoppingBag className="h-5 w-5" />*/}

      <Button
        aria-label={`Open cart (${itemCount} items)`}
        className="hover:bg-accent-foreground relative cursor-pointer border-none !bg-transparent"
        onClick={isCartOpen ? closeCart : openCart}
        size="icon"
        variant="outline"
      >
        <CartIcon className="size-5" />

        <span className="bg-accent-foreground text-accent absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      </Button>

      <CartSidebar isOpen={isCartOpen} onClose={closeCart} />
    </>
  );
}
