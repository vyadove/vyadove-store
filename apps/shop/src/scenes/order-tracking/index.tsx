"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { useCheckoutSession } from "@/scenes/checkout/hooks";
import OrderDetails from "@/scenes/order/order-details/order-details";
import PaymentDetails from "@/scenes/order/payment-details";
import { usePayloadFindQuery } from "@/scenes/shop/use-payload-find-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { TypographyH2, TypographyH4, TypographyH5, TypographyP } from "@ui/shadcn/typography";
import type { Order, Shipping } from "@vyadove/types";
import { z } from "zod/index";

import { convertToLocale } from "@/utils/money";

import ShippingDetails from "./shipping-details";
import { Stepper } from "./stepper";
import { MdOutlineInventory } from "react-icons/md";

type OrderCompletedTemplateProps = {
  order: Order;
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

function StepperDemo({ order }: { order: Order }) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      name: "step-1",
      title: <TypographyH5>Order Placed</TypographyH5>,
      icon: <MdOutlineInventory className="" size={30} />,
      // children: <div className="py-4">Content step 1</div>,
    },
    {
      name: "step-2",
      title: <TypographyH5>In Progress</TypographyH5>,
      icon: <MdOutlineInventory className="" size={30} />,

      // children: <div className="py-4">Content step 2</div>,
    },
    {
      name: "step-2",
      title: <TypographyH5>Delivered</TypographyH5>,
      icon: <MdOutlineInventory className="" size={30} />,
      // children: <div className="py-4">Content step 2</div>,
    },
    {
      name: "step-2",
      title: <TypographyH5>Claimed</TypographyH5>,
      icon: <MdOutlineInventory className="" size={30} />,
      // children: <div className="py-4">Content step 2</div>,
    },
  ];

  useEffect(() => {}, []);

  return (
    <div className="space-y-6 p-6">
      <Stepper
        onStepChange={setStep}
        orientation="horizontal"
        step={step}
        steps={steps}
      />
    </div>
  );
}


import {
  ClipboardList,
  ClipboardCheck,
  Package,
  Truck,
  CheckCircle2,
} from "lucide-react";
import { OrderStatusStepper } from "@/scenes/order-tracking/order-stepper";

function OrderPageUi() {
  const steps = [
    {
      label: "Order Placed",
      icon: <ClipboardList size={20} />,
      date: "20 Oct 2024",
      time: "11:00 AM",
    },
    {
      label: "Accepted",
      icon: <ClipboardCheck size={20} />,
      date: "20 Oct 2024",
      time: "11:15 AM",
    },
    {
      label: "In Progress",
      icon: <Package size={20} />,
      date: "21 Oct 2024",
      expected: true,
    },
    {
      label: "On the Way",
      icon: <Truck size={20} />,
      date: "22, 23 Oct 2024",
      expected: true,
    },
    {
      label: "Delivered",
      icon: <CheckCircle2 size={20} />,
      date: "24 Oct 2024",
      expected: true,
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-4 text-lg font-semibold">
        Order ID : #SDGT1254FD
      </div>

      <OrderStatusStepper currentStep={1} steps={steps} />
    </div>
  );
}


const OrderTracking = ({ order }: OrderCompletedTemplateProps) => {
  return (
    <div className="mt-6 mb-20 flex min-h-[calc(100vh-64px)] w-full flex-col gap-8 p-6">

      <OrderPageUi/>

      <StepperDemo order={order} />

      <OrderDetails order={order} />

      <div className="flex flex-col gap-8 px-3 sm:px-6">
        <ShippingDetails order={order} />
        <PaymentDetails order={order} />
      </div>
    </div>
  );
};

export default OrderTracking;
