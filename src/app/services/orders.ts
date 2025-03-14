import config from "@payload-config";
import { getPayload } from "payload";
import type { Order } from "@/payload-types";

export const createPendingOrder = async (
    items: any[],
    stripeSessionId: string,
    total: number,
    orderId: string
): Promise<Order> => {
    const orderData: any = {
        orderId,
        items,
        currency: "usd",
        totalAmount: total,
        user: null,
        sessionId: stripeSessionId,
    };

    const payload = await getPayload({ config: config });
    const order = await payload.create({
        collection: "orders",
        data: orderData,
    });

    if (!order) {
        throw new Error("Failed to create order");
    }

    return order;
};

export const updateOrderStatus = async (
    sessionId: string,
    status: any
): Promise<void> => {
    const payload = await getPayload({ config: config });

    const result = await payload.update({
        collection: "orders",
        where: {
            stripeSessionId: {
                equals: sessionId,
            },
        },
        data: {
            orderStatus: status,
        },
    });

    if (!result) {
        throw new Error("Failed to update order status");
    }
};

export const getOrder = async (orderId: string) => {
    try {
        const payload = await getPayload({ config: config });
        const order = await payload.find({
            collection: "orders",
            where: {
                sessionId: {
                    equals: orderId,
                },
            },
        });

        if (!order.docs.length) {
            return null;
        }

        return order.docs[0];
    } catch (error) {
        console.error("Error retrieving order:", error);
        return null;
    }
};
