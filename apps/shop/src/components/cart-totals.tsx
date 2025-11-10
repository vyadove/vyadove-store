"use client";

import React from "react";

import type { Order } from "@vyadove/types";

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

  return (
    <div>
      <div className="txt-medium text-ui-fg-subtle flex flex-col gap-y-2 ">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-x-1">
            Subtotal (excl. shipping and taxes)
          </span>
          <span data-testid="cart-subtotal" data-value={cartTotal || 0}>
            {convertToLocale({
              amount: cartTotal ?? 0,
              currency_code: currencyCode,
            })}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Shipping</span>
          <span data-testid="cart-shipping" data-value={shippingSubtotal || 0}>
            {convertToLocale({
              amount: shippingSubtotal ?? 0,
              currency_code: currencyCode,
            })}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="flex items-center gap-x-1 ">Taxes</span>
          <span data-testid="cart-taxes" data-value={taxTotal || 0}>
            {convertToLocale({
              amount: taxTotal ?? 0,
              currency_code: currencyCode,
            })}
          </span>
        </div>
      </div>
      <div className="my-4 h-px w-full border-b border-gray-200" />
      <div className="text-ui-fg-base txt-medium mb-2 flex items-center justify-between ">
        <span>Total</span>
        <span
          className="txt-xlarge-plus"
          data-testid="cart-total"
          data-value={cartTotal || 0}
        >
          {convertToLocale({
            amount: cartTotal ?? 0,
            currency_code: currencyCode,
          })}
        </span>
      </div>
      <div className="mt-4 h-px w-full border-b border-gray-200" />
    </div>
  );
};

export default CartTotals;
