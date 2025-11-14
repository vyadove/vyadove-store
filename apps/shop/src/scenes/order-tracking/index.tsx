"use client";

import React, { useLayoutEffect } from "react";
import { useCart } from "react-use-cart";

import Link from "next/link";

import PaymentDetails from "@/scenes/order/payment-details";
import { TypographyH2, TypographyH4 } from "@ui/shadcn/typography";
import type { Order } from "@vyadove/types";
import Cookies from "js-cookie";

import CartTotals from "@/components/cart-totals";

import Items from "./items/items";
import OrderDetails from "./order-details/order-details";
import ShippingDetails from "./shipping-details";
import { OrderSuccess } from "@/scenes/order/order-sucess";

type OrderCompletedTemplateProps = {
  order: Order;
};

const Help = () => {
  return (
    <div className="mt-6">
      <TypographyH4 className="text-base-semi">Need help?</TypographyH4>
      <div className="text-base-regular my-2">
        <ul className="flex flex-col gap-y-2">
          <li>
            <Link href="/support">Contact</Link>
          </li>
          <li>
            <Link href="/support">Returns & Exchanges</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

const OrderTracking = ({ order }: OrderCompletedTemplateProps) => {
  const { emptyCart } = useCart();

  useLayoutEffect(() => {
    emptyCart();
    Cookies.remove("cart-session");
    Cookies.remove("checkout-session");
  }, [emptyCart]);

  return (
    <div className="mx-auto min-h-[calc(100vh-64px)] w-full max-w-3xl py-6">
      <div className="content-container flex h-full w-full max-w-4xl flex-col items-center justify-center gap-y-10">
        <div
          className="flex h-full w-full max-w-4xl flex-col gap-4 bg-white py-6"
          data-testid="order-complete-container"
        >

          <OrderDetails order={order} />

          <TypographyH2 className="flex flex-row font-bold">
            Summary
          </TypographyH2>
          <Items order={order} />
          <CartTotals currencyCode="usd" order={order} />
          <ShippingDetails order={order} />
          <PaymentDetails order={order} />
          <Help />
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
