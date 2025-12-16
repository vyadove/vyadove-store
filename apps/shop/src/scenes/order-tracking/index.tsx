"use client";

import React from "react";

import { OrderStatusStepper } from "@/scenes/order-tracking/order-stepper";
import PaymentDetails from "@/scenes/order/payment-details";
import { TypographyH2, TypographyP } from "@ui/shadcn/typography";
import type { Order } from "@vyadove/types";
import {
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  Package,
} from "lucide-react";

import ShippingDetails from "./shipping-details";

type OrderCompletedTemplateProps = {
  order: Order;
};

function OrderPageUi() {
  const steps = [
    {
      label: "Order Placed",
      icon: <ClipboardList size={30} />,
      date: "20 Oct 2024",
      time: "11:00 AM",
    },
    {
      label: "Accepted",
      icon: <ClipboardCheck size={30} />,
      date: "20 Oct 2024",
      time: "11:15 AM",
    },
    {
      label: "In Progress",
      icon: <Package size={30} />,
      date: "21 Oct 2024",
      expected: true,
    },
    {
      label: "Delivered",
      icon: <CheckCircle2 size={30} />,
      date: "24 Oct 2024",
      expected: true,
    },
  ];

  return <OrderStatusStepper currentStep={1} steps={steps} />;
}

const OrderTracking = ({ order }: OrderCompletedTemplateProps) => {
  return (
    <div className="mt-10 mb-20 flex min-h-[calc(100vh-64px)] w-full flex-col gap-8">
      <div className="px-3 sm:px-6">
        <OrderPageUi />
      </div>

      {/* <OrderDetails order={order} /> */}

      <div className="flex flex-col gap-8 px-3 sm:px-6">
        <ShippingDetails order={order} />
        <PaymentDetails order={order} />
      </div>
    </div>
  );
};

export default OrderTracking;
