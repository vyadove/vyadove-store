"use client";

import React, { useState } from "react";
import { TbCreditCardPay } from "react-icons/tb";

import { useRouter } from "next/navigation";

import { useProductDetailContext } from "@/scenes/product-detail/index";
import { Routes } from "@/store.routes";
import { Button } from "@ui/shadcn/button";
import { Spinner } from "@ui/shadcn/spinner";
import type { Product } from "@vyadove/types";

import CartIcon from "@/components/icons/cart-icon";
import { toast } from "@/components/ui/hot-toast";
import { useCheckout } from "@/providers/checkout";

type ProductActionsProps = {
  product: Product;
};

export default function ProductActions({ product }: ProductActionsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCheckout();
  const router = useRouter();
  const { selectedVariant } = useProductDetailContext();

  const handleAddToCart = async () => {
    if (!selectedVariant?.id) {
      toast.error("Please select a variant");

      return;
    }

    setIsAdding(true);

    try {
      await addItem(selectedVariant.id, 1, product);
      toast.success("Added to cart");
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("Failed to add to cart");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center gap-2">
        <Button
          className="flex-1"
          data-testid="add-product-button"
          disabled={isAdding || !selectedVariant}
          onClick={handleAddToCart}
          size="lg"
        >
          {isAdding ? (
            <Spinner className="size-5 " />
          ) : (
            <CartIcon className="size-5 fill-white" />
          )}

          {!selectedVariant?.available ? "Not available" : "Add to cart"}
        </Button>

        <Button
          className="flex-1"
          disabled={isAdding || !selectedVariant}
          onClick={async () => {
            await handleAddToCart();
            router.push(Routes.cart);
          }}
          outlined
          size="lg"
          variant="secondary"
        >
          {isAdding ? <Spinner /> : <TbCreditCardPay />}
          Buy Now
        </Button>
      </div>
    </div>
  );
}
