"use client";

import React, { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { Routes } from "@/store.routes";
import {
  TypographyH2,
  TypographyH3,
  TypographyLarge,
  TypographyMuted,
  TypographyP,
} from "@ui/shadcn/typography";
import { Info } from "lucide-react";

import CartTotals from "@/components/cart-totals";
import { DiscountCode } from "@/components/discount-code";
import Divider from "@/components/divider";
import Thumbnail from "@/components/products/product-card/thumbnail";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { useCart } from "@/providers/cart";

import { convertToLocale } from "@/utils/money";
import { payloadSdk } from "@/utils/payload-sdk";

export const OrderSummery = () => {
  const { cartTotal, items, cart } = useCart();
  const [shippingFee, setShippingFee] = useState(0);

  useEffect(() => {
    const calculateShippingCost = async () => {
      const shippingMethods = await payloadSdk.find({
        collection: "shipping",
        where: {
          enabled: {
            equals: true,
          },
        },
      });

      const shippingMethod =
        shippingMethods.docs.find(
          (method) => method.id === (cart as any)?.shippingMethodId,
        ) || shippingMethods.docs[0];

      if (!shippingMethod) {
        return;
      }

      const shippingProvider = shippingMethod.shippingProvider?.[0];

      setShippingFee(shippingProvider?.baseRate || 0);
    };

    calculateShippingCost();
  }, [cart]);

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
