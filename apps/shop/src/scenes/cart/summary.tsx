"use client";

import { useState, useTransition } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useCheckout } from "@/providers/checkout";
import { Routes } from "@/store.routes";
import { Button } from "@ui/shadcn/button";
import { TypographyH3 } from "@ui/shadcn/typography";
import type { GiftCard } from "@vyadove/types";
import { Edit2 } from "lucide-react";

import CartTotals from "@/components/cart-totals";
import Divider from "@/components/divider";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

const Summary = () => {
  const [isPending, startTransition] = useTransition();
  const [promotions, setPromotions] = useState<GiftCard[]>([]);
  const { items, cartTotal } = useCheckout();
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
        <CartTotals />
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
