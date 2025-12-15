"use client";

import React from "react";
import { MdEdit } from "react-icons/md";

import Image from "next/image";

import { useCheckout } from "@/providers/checkout";
import { Routes } from "@/store.routes";
import { Button } from "@/ui/shadcn/button";
import {
  TypographyH2, TypographyH3, TypographyH5, TypographyLarge, TypographyMuted, TypographyP,
} from "@ui/shadcn/typography";
import { VyaLink } from "@ui/vya-link";
import { Edit, Edit2 } from "lucide-react";

import CartTotals from "@/components/cart-totals";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { convertToLocale } from "@/utils/money";

export const OrderSummery = () => {
  const { cartTotal, items, totalUniqueItems, checkout } = useCheckout();

  return (
    <Card className="sticky top-12 self-start rounded-4xl shadow-xl lg:col-span-1 ">
      <CardHeader className="flex flex-row items-center justify-between">
        <TypographyH2 className="text-accent">Summary</TypographyH2>
        <VyaLink href={Routes.cart}>
          <Button outlined size="icon-sm" variant="ghost">
            <MdEdit />
          </Button>
        </VyaLink>
      </CardHeader>

      <CardContent className='pb-0'>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <TypographyP className="text-muted-foreground">
              {" "}
              {totalUniqueItems} Items
            </TypographyP>
            <div className="flex flex-col gap-2">
              {items.map((item) => (
                <div
                  className="flex items-center space-x-4"
                  key={item.variantId}
                >
                  <div className="relative flex size-[60px] items-start">
                    <Image
                      alt={"product image"}
                      className="w-full rounded-xl object-cover"
                      fill
                      src={item.product?.gallery?.[0]?.url || ""}
                    />
                  </div>

                  <div className="flex-1">
                    <TypographyH5 className="line-clamp-2 font-medium">
                      {item.product?.title}
                    </TypographyH5>

                    <TypographyMuted className="text-sm">
                      {item.quantity} x{" "}
                      {convertToLocale({
                        amount: item.unitPrice || 0,
                        minimumFractionDigits: 2,
                        hiddeCurrency: true,
                      })}{" "}
                      ={" "}
                      {convertToLocale({
                        amount: item.totalPrice || 0,
                        minimumFractionDigits: 2,
                      })}
                    </TypographyMuted>

                    <TypographyMuted className="font-medium"></TypographyMuted>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <CartTotals totalLabel='Total To Pay' />
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2"></CardFooter>
    </Card>
  );
};
