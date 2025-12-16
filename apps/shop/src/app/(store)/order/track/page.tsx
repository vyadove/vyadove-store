import type { Metadata } from "next";

import OrderTrackingInputs from "@/scenes/order-tracking/order-tracking-input";

type Props = {
  params: Promise<{ id: string }>;
};
export const metadata: Metadata = {
  description: "You purchase was successful",
  title: "Order Confirmed",
};

export default async function OrderConfirmedPage() {
  return <OrderTrackingInputs />;
}
