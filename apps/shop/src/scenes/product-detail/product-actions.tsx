"use client";

import { useMemo, useState } from "react";
import { useCart } from "react-use-cart";

import { useRouter } from "next/navigation";

import { Routes } from "@/store.routes";
import { Button } from "@ui/shadcn/button";
import { Spinner } from "@ui/shadcn/spinner";
import type { Product } from "@vyadove/types";
import Cookies from "js-cookie";
import { toast } from "sonner";

import { syncCartWithBackend } from "@/services/cart";

type ProductActionsProps = {
  product: Product;
  selectedOptions: Record<string, string>;
};

export default function ProductActions({
  product,
  selectedOptions,
}: ProductActionsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const { addItem, removeItem, items } = useCart();
  const router = useRouter();

  const buildCartItem = (variant: Product["variants"][0]) => {
    return {
      ...variant,
      id: `${variant.id}`,
      currency: product.currency,
      gallery: variant.gallery?.length
        ? variant.gallery
        : product.variants[0]?.gallery,
      handle: product.handle,
      productId: product.id,
      productName: product.title,
    };
  };

  const handleAddToCart = async () => {
    setIsAdding(true);

    const selectedVariant = findSelectedVariant() || product.variants[0];

    if (!selectedVariant?.id) {
      setIsAdding(false);
      console.error("variant not found");
      toast.error("Variant not found");

      return;
    }

    const newItem = buildCartItem(selectedVariant);

    // Optimistic UI update

    try {
      addItem(newItem, 1);
      const sessionId = getSessionId();

      await syncCartWithBackend(
        {
          id: newItem.id,
          product: newItem.productId,
          variantId: newItem.id,
          quantity: 1,
        },
        sessionId,
      );
      toast.success("Added to cart");
    } catch (error) {
      removeItem(newItem.id);
      toast.error("Failed to sync cart");
      console.error("Failed to sync cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const findSelectedVariant = () => {
    return product.variants?.find((variant) =>
      variant.options?.every(
        (opt) => selectedOptions[opt.option] === opt.value,
      ),
    );
  };

  const getSessionId = () => {
    return Cookies.get("cart-session") || "";
  };

  const selectedVariant =
    product.variants?.find((variant) =>
      variant.options?.every(
        (opt) => selectedOptions[opt.option] === opt.value,
      ),
    ) || product.variants[0];

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center gap-2">
        <Button
          className="flex-1 rounded-xl"
          data-testid="add-product-button"
          disabled={isAdding || !selectedVariant?.available}
          onClick={handleAddToCart}
          size="lg"
        >
          {isAdding && "adding ...."}

          {!selectedVariant?.available ? "Not available" : "Add to cart"}
        </Button>

        <Button
          className="flex-1 rounded-xl"
          disabled={isAdding || !selectedVariant?.available}
          onClick={async () => {
            await handleAddToCart();
            router.push(Routes.checkout);
          }}
          size="lg"
          variant="secondary"
        >
          {isAdding && <Spinner />}
          Buy Now
        </Button>
      </div>
    </div>
  );
}
