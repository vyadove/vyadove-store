"use client";

import React, { useLayoutEffect } from "react";
import { useCart } from "react-use-cart";

import Link from "next/link";

import { OrderSuccess } from "@/scenes/order/order-sucess";
import PaymentDetails from "@/scenes/order/payment-details";
import { TypographyH2, TypographyH4 } from "@ui/shadcn/typography";
import type { Order } from "@vyadove/types";
import Cookies from "js-cookie";

import CartTotals from "@/components/cart-totals";

import Items from "./items/items";
import OrderDetails from "./order-details/order-details";
import ShippingDetails from "./shipping-details";

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

const OrderTemplate = ({ order }: OrderCompletedTemplateProps) => {
  const { emptyCart } = useCart();

  useLayoutEffect(() => {
    emptyCart();
    Cookies.remove("cart-session");
    Cookies.remove("checkout-session");
  }, [emptyCart]);

  console.log('order : ', order);

  return (
    <div className=" min-h-[calc(100vh-64px)] w-full  p-6">
      <OrderSuccess />

      <OrderDetails order={order} />

      <Items order={order} />
      <CartTotals currencyCode="usd" order={order} />
      <ShippingDetails order={order} />
      <PaymentDetails order={order} />
      <Help />
    </div>
  );
};

export default OrderTemplate;
