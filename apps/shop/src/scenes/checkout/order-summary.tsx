"use client";

import React, { useEffect, useState } from "react";
import type { Item } from "react-use-cart";
import { useCart } from "react-use-cart";

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

import { convertToLocale } from "@/utils/money";
import { payloadSdk } from "@/utils/payload-sdk";

export const OrderSummery = () => {
  const { cartTotal, items, metadata } = useCart();
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
          (method) => method.id === metadata?.shippingMethodId,
        ) || shippingMethods.docs[0];

      if (!shippingMethod) {
        return;
      }

      const shippingProvider = shippingMethod.shippingProvider?.[0];

      setShippingFee(shippingProvider?.baseRate || 0);
    };

    calculateShippingCost();
  }, [metadata]);

  return (
    <Card className="sticky top-12 self-start rounded-4xl shadow-xl lg:col-span-1">
      <CardHeader className=''>
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
                {items.map((item: Item) => (
                  <div className="flex items-center space-x-4" key={item.id}>
                    <div className="relative flex size-[60px] items-start">
                      <Image
                        alt={"product image"}
                        className="w-full rounded-xl object-cover"
                        fill
                        src={item.gallery?.[0]?.url}
                      />
                    </div>

                    <div className="flex-1">
                      <TypographyLarge className="line-clamp-2">
                        {item.productName}
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
                          amount: item.itemTotal || 0,
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

  return (
    <div className="lg:col-span-1">
      <Card className="sticky top-8">
        <CardHeader>
          <CardTitle>In your Cart</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item: Item) => (
            <div className="flex items-center space-x-4" key={item.id}>
              <div className="relative flex size-[70px] items-start">
                <Image
                  alt={"product image"}
                  className="w-full rounded-xl object-cover"
                  fill
                  src={item.gallery?.[0]?.url}
                />
              </div>

              <div className="flex-1">
                <h3 className="line-clamp-2 font-medium">{item.productName}</h3>

                <TypographyP className="text-blue-600">
                  {item.quantity}x ${item.price.toFixed(2)}
                </TypographyP>

                <TypographyP className="font-medium">
                  ${item.itemTotal?.toFixed(2)}
                </TypographyP>
              </div>
            </div>
          ))}

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1">
                <span className="flex items-center gap-x-1">Subtotal</span>
                <Info className="h-4 w-4 text-gray-400" />
              </span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Taxes</span>
              <span>$0.00</span>
            </div>
          </div>

          <Separator />

          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>${(cartTotal + shippingFee).toFixed(2)}</span>
          </div>

          <Button className="h-auto p-0 text-blue-600" variant="link">
            <span className="flex items-center space-x-1">
              <span>Add gift card or discount code</span>
              <Info className="h-4 w-4" />
            </span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
