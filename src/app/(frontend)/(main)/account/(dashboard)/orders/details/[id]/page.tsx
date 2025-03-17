import OrderDetailsTemplate from "@/app/(frontend)/_templates/order-details";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";

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
        title: `Order #${orderId}`,
        description: "View your order",
    };
}

export default async function OrderDetailPage(props: Props) {
    const params = await props.params;
    const orderId = params.id

    const payload = await getPayload({ config })
    const order = await payload.findByID({
        collection: "orders",
        id: orderId,
    })

    if (!order) {
        notFound();
    }

    return <OrderDetailsTemplate order={order} />;
}
