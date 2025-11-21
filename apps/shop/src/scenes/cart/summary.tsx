"use client";

import { useState, useTransition } from "react";
import { useCart } from "react-use-cart";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Routes } from "@/store.routes";
import { Button } from "@ui/shadcn/button";
import { TypographyH2, TypographyH3 } from "@ui/shadcn/typography";
import type { GiftCard } from "@vyadove/types";

import CartTotals from "@/components/cart-totals";
import { DiscountCode } from "@/components/discount-code";
import Divider from "@/components/divider";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Summary = () => {
  const [isPending, startTransition] = useTransition();
  const [promotions, setPromotions] = useState<GiftCard[]>([]);
  const { items } = useCart();
  const router = useRouter();

  const handleClick = () => {
    router.push("/checkout");
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
      const data: any = await response.json();

      setPromotions((prev) => [...prev, data]);
    } catch (error) {
      console.error("Error verifying gift card code:", error);
    }
  };

  return (
    <Card className="rounded-4xl shadow-xl">
      <CardHeader>
        <TypographyH3 className="">Basket Summary</TypographyH3>
      </CardHeader>

      <CardContent>
        {/*<DiscountCode
          applyPromotion={applyPromotion}
          promotions={promotions}
          setPromotions={setPromotions}
        />*/}
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
      </CardContent>

      <CardFooter className="flex flex-col gap-2">
        <Link className="w-full" href={Routes.checkout}>
          <Button className="h-10 w-full" disabled={isPending}>
            {isPending ? "Processing..." : "Go to checkout"}
          </Button>
        </Link>

        <Link className="w-full" href={Routes.shop}>
          <Button
            className="w-full"
            disabled={isPending}
            size="sm"
            variant="link"
          >
            Continue Shopping
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default Summary;
