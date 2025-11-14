"use client";

import React, { useMemo, useState } from "react";
import { BiMoney } from "react-icons/bi";
import { MdMoney } from "react-icons/md";
import { TbCreditCardPay } from "react-icons/tb";
import { useCart } from "react-use-cart";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useProductDetailContext } from "@/scenes/product-detail/index";
import { Routes } from "@/store.routes";
import { Button } from "@ui/shadcn/button";
import { Spinner } from "@ui/shadcn/spinner";
import type { Media, Product } from "@vyadove/types";
import Cookies from "js-cookie";
import { toast } from "sonner";

import CartIcon from "@/components/icons/cart-icon";

import { syncCartWithBackend } from "@/services/cart";

type ProductActionsProps = {
  product: Product;
};

export default function ProductActions({ product }: ProductActionsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const { addItem, removeItem, items, updateItemQuantity } = useCart();
  const router = useRouter();
  const { selectedVariant } = useProductDetailContext();

  const buildCartItem = (variant: Product["variants"][0]) => {
    return {
      ...variant,
      id: `${variant.id}`,
      currency: product.currency,
      image: (product.gallery as Media[])[0]?.url,
      productId: product.id,
      productName: product.title,
      product: product,
    };
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast.error("Please select a variant");

      return;
    }

    setIsAdding(true);

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
      ).then((res: any) => {
        if (res?.error) {

          if(res.errorCode === 'CART_NOT_FOUND'){
            Cookies.remove("cart-session");
          }

          throw new Error(res.error);
        }
      });
      toast.success("Added to cart");
    } catch (error) {

      console.log('error ---- : ', error);

      updateItemQuantity(newItem.id, -1);
      toast.error("Failed to sync cart");
      console.error("Failed to sync cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const getSessionId = () => {
    return Cookies.get("cart-session") || "";
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
          size="lg"
          variant="accent"
        >
          {isAdding ? <Spinner /> : <TbCreditCardPay />}
          Buy Now
        </Button>
      </div>
    </div>
  );
}
