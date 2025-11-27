"use client";

import React from "react";

import { TypographyP } from "@ui/shadcn/typography";
import type { Order } from "@vyadove/types";

import { useCart } from "@/providers/cart";

import { convertToLocale } from "@/utils/money";

const CartTotals = ({
  currencyCode,
  order,
}: {
  currencyCode: string;
  order: Partial<Order>;
}) => {
  const taxTotal = 0;
  const shippingSubtotal = 0;
  const cartTotal = order.totalAmount;
  const { totalUniqueItems } = useCart();

  return (
    <div className="flex flex-col gap-6 pt-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <TypographyP className="text-muted-foreground">Items</TypographyP>
          <TypographyP data-testid="cart-subtotal" data-value={cartTotal || 0}>
            {totalUniqueItems}
          </TypographyP>
        </div>

        <div className="flex items-center justify-between">
          <TypographyP className="text-muted-foreground">Sub total</TypographyP>

          <TypographyP data-testid="cart-subtotal" data-value={cartTotal || 0}>
            {convertToLocale({
              amount: cartTotal ?? 0,
              currency_code: currencyCode,
              minimumFractionDigits: 2,
            })}
          </TypographyP>
        </div>

        <div className="flex items-center justify-between">
          <TypographyP className="text-muted-foreground">
            Shipping (digital){" "}
          </TypographyP>

          <TypographyP
            data-testid="cart-shipping"
            data-value={shippingSubtotal || 0}
          >
            {convertToLocale({
              amount: shippingSubtotal ?? 0,
              currency_code: currencyCode,
              minimumFractionDigits: 2,
            })}
          </TypographyP>
        </div>

        <div className="flex justify-between">
          <TypographyP className="text-muted-foreground">Taxes</TypographyP>
          <TypographyP data-testid="cart-taxes" data-value={taxTotal || 0}>
            {convertToLocale({
              amount: taxTotal ?? 0,
              currency_code: currencyCode,
              minimumFractionDigits: 2,
              minimumIntegerDigits: 1,
            })}
          </TypographyP>
        </div>
      </div>

      <div className=" flex justify-between border-t py-6">
        <TypographyP className="text-muted-foreground">Total</TypographyP>
        <TypographyP data-testid="cart-taxes" data-value={taxTotal || 0}>
          {convertToLocale({
            amount: cartTotal ?? 0,
            currency_code: currencyCode,
          })}
        </TypographyP>
      </div>
    </div>
  );
};

export default CartTotals;
