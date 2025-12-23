"use client";

import React, { useState } from "react";
import { TbCreditCardPay } from "react-icons/tb";

import { useRouter } from "next/navigation";

import { useCheckout } from "@/providers/checkout";
import { useProductDetailContext } from "@/scenes/product-detail/index";
import { Routes } from "@/store.routes";
import { Button } from "@ui/shadcn/button";
import { Spinner } from "@ui/shadcn/spinner";
import type { Product } from "@vyadove/types";

import CartIcon from "@/components/icons/cart-icon";
import { toast } from "@/components/ui/hot-toast";

type ProductActionsProps = {
  product: Product;
};

export default function ProductActions({ product }: ProductActionsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCheckout();
  const router = useRouter();
  const { selectedVariant, participants } = useProductDetailContext();

  const handleAddToCart = async (openCart = true) => {
    if (!selectedVariant?.id) {
      toast.error("Please select a variant");

      return;
    }

    setIsAdding(true);

    try {
      // Calculate total price based on participants
      const unitPrice = selectedVariant.price?.amount || 0;
      const totalPrice = unitPrice * participants;

      const res = await addItem(
        selectedVariant.id,
        1, // quantity = 1 (participants stored separately)
        product,
        unitPrice,
        participants,
        openCart,
      );

      console.log("addItem response:", res);

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
          className="flex-1 font-light"
          data-testid="add-product-button"
          disabled={
            isAdding || !selectedVariant || selectedVariant.available === false
          }
          onClick={() => handleAddToCart()}
          size="lg"
        >
          {isAdding ? (
            <Spinner className="size-5 " />
          ) : (
            <CartIcon className="size-5 fill-white" />
          )}

          {selectedVariant?.available === false
            ? "Not available"
            : "Add to cart"}
        </Button>

        <Button
          className="flex-1 font-light"
          disabled={
            isAdding || !selectedVariant || selectedVariant.available === false
          }
          onClick={async () => {
            await handleAddToCart(false);
            router.push(Routes.checkout);
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
