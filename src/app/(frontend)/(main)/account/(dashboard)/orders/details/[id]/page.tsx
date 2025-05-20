import type { Metadata } from "next";

import OrderDetailsTemplate from "@/app/(frontend)/_templates/order-details";
import config from "@payload-config";
import { notFound } from "next/navigation";
import { getPayload } from "payload";

type Props = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params;
    const orderId = params.id;

    if (!orderId) {
        notFound();
    }

    return {
        description: "View your order",
        title: `Order #${orderId}`,
    };
}

export default async function OrderDetailPage(props: Props) {
    const params = await props.params;
    const orderId = params.id;

    const payload = await getPayload({ config });
    const order = await payload.findByID({
        id: orderId,
        collection: "orders",
    });

    if (!order) {
        notFound();
    }

    return <OrderDetailsTemplate order={order} />;
}
