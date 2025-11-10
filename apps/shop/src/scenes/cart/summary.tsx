"use client";

import { useState, useTransition } from "react";
import { useCart } from "react-use-cart";

import { useRouter } from "next/navigation";

import { Button } from "@ui/shadcn/button";
import { TypographyH2 } from "@ui/shadcn/typography";
import type { GiftCard } from "@vyadove/types";

import CartTotals from "@/components/cart-totals";
import { DiscountCode } from "@/components/discount-code";
import Divider from "@/components/divider";

const Summary = () => {
  const [isPending, startTransition] = useTransition();
  const [promotions, setPromotions] = useState<GiftCard[]>([]);
  const { items } = useCart();
  const router = useRouter();

  const handleClick = () => {
    router.push("/checkout/address");
  };

  const applyPromotion = async (code: string) => {
    try {
      const response = await fetch(`/api/gift-cards/verify?code=${code}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to verify gift card code.");
      }

      // todo : type this
      const data : any = await response.json();

      setPromotions((prev) => [...prev, data]);
    } catch (error) {
      console.error("Error verifying gift card code:", error);
    }
  };

  return (
    <div className="flex flex-col gap-y-4">
      <TypographyH2 className="text-[2rem] leading-[2.75rem]">
        Summary
      </TypographyH2>
      <DiscountCode
        applyPromotion={applyPromotion}
        promotions={promotions}
        setPromotions={setPromotions}
      />
      <Divider />
      <CartTotals
        currencyCode={items[0]?.currency}
        order={{
          totalAmount: items.reduce(
            (acc, item: any) => acc + item.price * item.quantity,
            0,
          ),
        }}
      />
      <Button
        className="h-10 w-full"
        disabled={isPending}
        onClick={handleClick}
      >
        {isPending ? "Processing..." : "Go to checkout"}
      </Button>
    </div>
  );
};

export default Summary;
