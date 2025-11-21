import type { BeforeChangeHook } from "@/admin/types";
import type { Order } from "@vyadove/types";

export const addOrderTimelineEntry: BeforeChangeHook<Order> = ({
    data,
    originalDoc,
    req,
}) => {
    const newTimeline : Order['timeline'] = [...(data.timeline || [])];

    // if order is new, add initial timeline entry as "Order Created"
    if (!originalDoc) {
        newTimeline.push({
            type: "order_created",
            createdBy: req.user?.id || null,
            date: new Date().toISOString(),
            details: `Order created by ${data.billingAddress?.email || "system"}`,
            title: "Order Created",
        });
    }

    if (data.orderStatus !== originalDoc?.orderStatus) {
        let eventType = "other";
        let title = `Order status updated to "${data.orderStatus}"`;

        switch (data.orderStatus) {
            case "canceled":
                eventType = "order_cancelled";
                title = "Order Canceled";
                break;
            case "delivered":
                eventType = "delivered";
                title = "Order Delivered";
                break;
            case "pending":
                eventType = "note";
                title = "Order marked as Pending";
                break;
            case "processing":
                eventType = "fulfillment_started";
                title = "Order Processing Started";
                break;
            case "shipped":
                eventType = "shipped";
                title = "Order Shipped";
                break;
        }

        newTimeline.push({
            type: eventType as any,
            createdBy: req.user?.id || null,
            date: new Date().toISOString(),
            details: `Order status changed by ${req.user?.email || "system"}`,
            title,
        });
    }

    // Detect paymentStatus change
    if (data.paymentStatus !== originalDoc?.paymentStatus) {
        let eventType = "other";
        let title = `Payment status updated to "${data.paymentStatus}"`;

        switch (data.paymentStatus) {
            case "failed":
                eventType = "note";
                title = "Payment Failed";
                break;
            case "paid":
                eventType = "order_paid";
                title = "Payment Received";
                break;
            case "pending":
                eventType = "note";
                title = "Payment Pending";
                break;
            case "refunded":
                eventType = "refund_issued";
                title = "Refund Issued";
                break;
        }

        newTimeline.push({
            type: eventType as any,
            createdBy: req.user?.id || null,
            date: new Date().toISOString(),
            details: `Payment status changed by ${req.user?.email || "system"}`,
            title,
        });
    }

    if (newTimeline.length > (data.timeline?.length || 0)) {
        data.timeline = newTimeline;
    }

    return data;
};
