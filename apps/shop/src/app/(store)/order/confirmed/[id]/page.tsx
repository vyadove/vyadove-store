import type { Metadata } from "next";

import { notFound } from "next/navigation";


import { getOrder } from "@/services/orders";
import OrderTemplate from "@/scenes/order";

type Props = {
  params: Promise<{ id: string }>;
};
export const metadata: Metadata = {
  description: "You purchase was successful",
  title: "Order Confirmed",
};

export default async function OrderConfirmedPage(props: Props) {
  const params = await props.params;
  const order = await getOrder(params.id);

  console.log('order -- : ', order);

  if (!order) {
    return notFound();
  }

  return <OrderTemplate order={order} />;
}
