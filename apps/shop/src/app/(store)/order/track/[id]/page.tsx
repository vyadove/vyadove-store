import type { Metadata } from "next";

import { notFound } from "next/navigation";

import OrderTracking from "@/scenes/order-tracking";

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

  console.log("order uery : ", orderQuery);

  const [order] = orderQuery?.docs || [];

  if (!order) {
    return notFound();
  }

  return <OrderTracking order={order} />;
}
