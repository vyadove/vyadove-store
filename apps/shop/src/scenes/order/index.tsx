"use client";

import React, { useLayoutEffect } from "react";

import Link from "next/link";
import { notFound } from "next/navigation";

import { useCheckout } from "@/providers/checkout";
import { OrderSuccess } from "@/scenes/order/order-sucess";
import PaymentDetails from "@/scenes/order/payment-details";
import { usePayloadFindQuery } from "@/scenes/shop/use-payload-find-query";
import { Spinner } from "@ui/shadcn/spinner";
import { TypographyH2, TypographyH4, TypographyP } from "@ui/shadcn/typography";
import type { Order } from "@vyadove/types";
import Cookies from "js-cookie";

import CartTotals from "@/components/cart-totals";

import { convertToLocale } from "@/utils/money";

import OrderDetails from "./order-details/order-details";
import ShippingDetails from "./shipping-details";

type OrderCompletedTemplateProps = {
  order: Order;
  // orderId: string;
};

const Total = ({ order }: { order: Order }) => {
  return (
    <div className="flex flex-col gap-4">
      <TypographyH2 className="text-base-semi">Total</TypographyH2>
      <div className="flex gap-x-8 [&>*]:flex-1">
        <div className="flex flex-col">
          <TypographyP className="text-muted-foreground font-light">
            Total Amount
          </TypographyP>
          <TypographyP className="font-semibold capitalize">
            {convertToLocale({
              amount: order?.totalAmount ?? 0,
              minimumFractionDigits: 2,
              minimumIntegerDigits: 1,
            })}
          </TypographyP>
        </div>
      </div>
    </div>
  );
};

const OrderTemplate = ({ order }: OrderCompletedTemplateProps) => {
  const { emptyCart } = useCheckout();

  useLayoutEffect(() => {
    emptyCart();
  }, []);

  return (
    <div className="mt-6 mb-20 flex min-h-[calc(100vh-64px)] w-full flex-col gap-8 p-6">
      <OrderDetails order={order} />

      <div className="flex flex-col gap-8 px-3 sm:px-6">
        <ShippingDetails order={order} />
        <PaymentDetails order={order} />
        <Total order={order} />
      </div>
    </div>
  );
};

export default OrderTemplate;
