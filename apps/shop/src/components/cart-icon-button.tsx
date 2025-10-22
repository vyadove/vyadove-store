"use client";

import React from "react";

import { Button } from "@ui/shadcn/button";
import { ShoppingBag } from "lucide-react";

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
        className="hover:bg-accent-foreground relative cursor-pointer border-none bg-none"
        onClick={isCartOpen ? closeCart : openCart}
        size="icon"
        variant="outline"
      >
        <CartIcon className="size-5" />

        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        )}
      </Button>

      <CartSidebar isOpen={isCartOpen} onClose={closeCart} />
    </>
  );
}
