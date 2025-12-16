import type { Metadata } from "next";

import { notFound } from "next/navigation";

import OrderTemplate from "@/scenes/order";

import { getServerSdk } from "@/utils/payload-sdk-server";

type Props = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  description: "You purchase was successful",
  title: "Order Confirmed",
};

export default async function OrderConfirmedPage(props: Props) {
  const params = await props.params;
  const sdk = await getServerSdk();

  const orderQuery = await sdk.find({
    collection: "orders",
    depth: 2,
    where: {
      orderId: {
        equals: params.id,
      },
    },
  });

  const order = orderQuery.docs?.[0];

  if (!order) {
    return notFound();
  }

  return <OrderTemplate order={order} />;
}
