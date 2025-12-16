import type { Metadata } from "next";

import { notFound } from "next/navigation";

import OrderTracking from "@/scenes/order-tracking";

import { payloadSdk } from "@/utils/payload-sdk";

type Props = {
  params: Promise<{ id: string }>;
};
export const metadata: Metadata = {
  description: "Track your order status and details",
  title: "Track Your Order",
};

export default async function TrackOrder(props: Props) {
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

  await new Promise((resolve) => {
    setTimeout(resolve, 3000);
  });

  const order = orderQuery.docs[0] || null;

  if (!order) {
    return notFound();
  }

  return <OrderTracking order={order} />;
}
