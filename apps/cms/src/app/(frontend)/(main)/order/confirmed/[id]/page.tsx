import type { Metadata } from "next";

import OrderCompletedTemplate from "@/app/(frontend)/_templates/order-completed-template";
import { getOrder } from "@/app/api/services/orders";
import { notFound } from "next/navigation";

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

    if (!order) {
        return notFound();
    }

    return <OrderCompletedTemplate order={order} />;
}
