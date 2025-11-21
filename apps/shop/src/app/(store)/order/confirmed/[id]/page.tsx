import type { Metadata } from "next";

import { notFound } from "next/navigation";

import OrderTemplate from "@/scenes/order";

import { getOrder } from "@/services/orders";

import { payloadSdk } from "@/utils/payload-sdk";

type Props = {
  params: Promise<{ id: string }>;
};
export const metadata: Metadata = {
  description: "You purchase was successful",
  title: "Order Confirmed",
};

export default async function OrderConfirmedPage(props: Props) {
  const params = await props.params;

  const orderQuery = await payloadSdk.find({
    collection: "orders",
    depth: 2,
    where: {
      orderId: {
        equals: params.id,
      },
    },
  });

  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  })

  const order = orderQuery.docs[0] || null;

  console.log('order --  ', order);

  if (!order) {
    return notFound();
  }

  return <OrderTemplate order={order} />;
}
