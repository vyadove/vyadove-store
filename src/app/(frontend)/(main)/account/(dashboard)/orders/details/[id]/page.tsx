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
    const order = {
        id: 1,
        display_id: "123456",
        created_at: "2023-03-01T00:00:00.000Z",
        total: 100,
        currency_code: "USD",
        items: [
            {
                id: 1,
                title: "Product 1",
                thumbnail:
                    "https://next.medusajs.com/_next/image?url=https%3A%2F%2Fmedusa-server-testing.s3.us-east-1.amazonaws.com%2Fheadphones-nobg-1700675136219.png&w=1920&q=50",
                quantity: 1,
            },
        ],
    };
    if (!order) {
        notFound();
    }

    return {
        title: `Order #${order.display_id}`,
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

    return <OrderDetailsTemplate order={order as any} />;
}
