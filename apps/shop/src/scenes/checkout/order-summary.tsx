"use client";

import React from "react";

import Image from "next/image";

import { useCheckout } from "@/providers/checkout";
import {
  TypographyH2,
  TypographyLarge,
  TypographyMuted,
  TypographyP,
} from "@ui/shadcn/typography";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { convertToLocale } from "@/utils/money";

export const OrderSummery = () => {
  const { cartTotal, items } = useCheckout();

  return (
    <Card className="sticky top-12 self-start rounded-4xl shadow-xl lg:col-span-1">
      <CardHeader className="">
        <TypographyH2 className="text-accent">Summary</TypographyH2>
      </CardHeader>

      <CardContent>
        {/*<DiscountCode
          applyPromotion={applyPromotion}
          promotions={promotions}
          setPromotions={setPromotions}
        />
        <Divider />

        */}

        <div className="flex flex-col gap-6 ">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <TypographyP className="text-muted-foreground">
                {" "}
                {items.length} Items
              </TypographyP>
              <div className="flex flex-col gap-2">
                {items.map((item: any) => (
                  <div className="flex items-center space-x-4" key={item.id}>
                    <div className="relative flex size-[60px] items-start">
                      <Image
                        alt={"product image"}
                        className="w-full rounded-xl object-cover"
                        fill
                        src={item.product?.gallery?.[0]?.url}
                      />
                    </div>

                    <div className="flex-1">
                      <TypographyLarge className="line-clamp-2">
                        {item.product?.title}
                      </TypographyLarge>

                      <TypographyMuted className="text-sm">
                        {item.quantity} x{" "}
                        {convertToLocale({
                          amount: item.price || 0,
                          minimumFractionDigits: 2,
                          hiddeCurrency: true,
                        })}{" "}
                        ={" "}
                        {convertToLocale({
                          amount: item.price * item.quantity || 0,
                          minimumFractionDigits: 2,
                        })}
                      </TypographyMuted>

                      <TypographyMuted className="font-medium"></TypographyMuted>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <span />
            <span />

            <div className="flex items-center justify-between">
              <TypographyP className="text-muted-foreground">
                Sub total
              </TypographyP>

              <TypographyP
                data-testid="cart-subtotal"
                data-value={cartTotal || 0}
              >
                {convertToLocale({
                  amount: cartTotal ?? 0,
                  minimumFractionDigits: 2,
                })}
              </TypographyP>
            </div>

            <div className="flex items-center justify-between">
              <TypographyP className="text-muted-foreground">
                Shipping (digital){" "}
              </TypographyP>

              <TypographyP data-testid="cart-shipping" data-value={0}>
                {convertToLocale({
                  amount: 0,
                  minimumFractionDigits: 2,
                })}
              </TypographyP>
            </div>

            <div className="flex justify-between">
              <TypographyP className="text-muted-foreground">Taxes</TypographyP>
              <TypographyP data-testid="cart-taxes" data-value={0}>
                {convertToLocale({
                  amount: 0,
                  minimumFractionDigits: 2,
                  minimumIntegerDigits: 1,
                })}
              </TypographyP>
            </div>
          </div>

          <div className=" flex justify-between border-t pt-6">
            <TypographyLarge className="text-muted-foreground">
              Total to pay
            </TypographyLarge>
            <TypographyP data-testid="cart-taxes" data-value={0}>
              {convertToLocale({
                amount: cartTotal ?? 0,
              })}
            </TypographyP>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2"></CardFooter>
    </Card>
  );
};
