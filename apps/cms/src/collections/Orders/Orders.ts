import type { CollectionConfig } from "payload";

import { adminOrHaveSessionCookie, admins, anyone } from "@/access/roles";

import { groups } from "../groups";
import { readOrderAccess } from "./access/order-access";
import { OrderTimeline } from "./fields/OrderTimeline";
import { addOrderTimelineEntry } from "./hooks/add-order-timeline-entry";
import { syncFromCheckout } from "./hooks/sync-from-checkout";
import { markCheckoutComplete } from "./hooks/mark-checkout-complete";
import { createStripeSession } from "./hooks/create-stripe-session";

export const Orders: CollectionConfig = {
    slug: "orders",
    access: {
        // create: anyone,
        create: adminOrHaveSessionCookie,
        delete: admins,
        read: readOrderAccess,
        update: admins,
    },
    admin: {
        group: groups.orders,
        useAsTitle: "orderId",
    },
    fields: [
        {
            type: "row",
            fields: [
                {
                    name: "orderId",
                    type: "text",
                    required: true,
                    unique: true,
                    admin: {
                        readOnly: true,
                    },
                },
                {
                    name: "totalAmount",
                    type: "number",
                    min: 0,
                    required: true,
                },
            ],
        },
        {
            type: "row",
            fields: [
                {
                    name: "user",
                    type: "relationship",
                    relationTo: "users",
                    required: false,
                },
                {
                    name: "checkout",
                    type: "relationship",
                    relationTo: "checkout",
                    required: true,
                    admin: {
                        description:
                            "Reference to the checkout that created this order",
                    },
                },
            ],
        },
        {
            name: "source",
            type: "select",
            admin: {
                position: "sidebar",
            },
            defaultValue: "manual",
            options: [{ label: "Manual", value: "manual" }],
        },
        {
            name: "currency",
            type: "text",
            admin: {
                position: "sidebar",
                description: "Base currency used for pricing",
            },
            required: true,
        },
        // Stripe Adaptive Pricing fields (populated from webhook)
        {
            name: "presentmentCurrency",
            type: "text",
            admin: {
                position: "sidebar",
                description:
                    "Currency customer actually paid in (Stripe Adaptive Pricing)",
                readOnly: true,
            },
        },
        {
            name: "presentmentAmount",
            type: "number",
            admin: {
                position: "sidebar",
                description: "Amount in presentment currency",
                readOnly: true,
            },
        },
        {
            type: "row",
            fields: [
                {
                    name: "paymentStatus",
                    type: "select",
                    defaultValue: "pending",
                    options: [
                        { label: "Pending", value: "pending" },
                        {
                            label: "Awaiting Payment",
                            value: "awaiting_payment",
                        },
                        { label: "Paid", value: "paid" },
                        { label: "Failed", value: "failed" },
                        { label: "Expired", value: "expired" },
                        { label: "Refunded", value: "refunded" },
                    ],
                    required: true,
                },
                {
                    name: "orderStatus",
                    type: "select",
                    defaultValue: "pending",
                    options: [
                        { label: "Pending", value: "pending" },
                        { label: "Processing", value: "processing" },
                        { label: "Shipped", value: "shipped" },
                        { label: "Failed", value: "failed" },
                        { label: "Delivered", value: "delivered" },
                        { label: "Canceled", value: "canceled" },
                    ],
                    required: true,
                },
            ],
        },

        {
            type: "row",
            fields: [
                {
                    name: "payment",
                    type: "relationship",
                    relationTo: "payments",
                },
                {
                    name: "shipping",
                    type: "relationship",
                    relationTo: "shipping",
                },
            ],
        },
        {
            name: "paymentIntentId",
            type: "text",
            admin: {
                position: "sidebar",
                readOnly: true,
            },
        },
        {
            name: "sessionId",
            type: "text",
            admin: {
                position: "sidebar",
                readOnly: true,
            },
        },
        {
            name: "stripeSessionId",
            type: "text",
            admin: {
                position: "sidebar",
                readOnly: true,
                description: "Stripe Checkout Session ID",
            },
        },
        {
            name: "sessionUrl",
            type: "text",
            admin: {
                disabled: true,
                description: "Stripe Checkout Session URL",
            },
        },
        {
            name: "paymentMethod",
            type: "text",
            admin: {
                position: "sidebar",
            },
            required: false,
        },
        {
            name: "receiptUrl",
            type: "text",
            admin: {
                readOnly: true,
            },
            required: false,
        },
        {
            name: "metadata",
            type: "json",
            admin: {
                readOnly: true,
            },
            typescriptSchema: [
                () => ({
                    type: "object",
                    properties: {
                        paymentType: { type: "string" },
                        checkoutId: { type: "number" },
                    },
                }),
            ],
        },
        {
            name: "shippingAddress",
            type: "json",
            admin: {
                position: "sidebar",
            },
            required: false,
            typescriptSchema: [
                () => ({
                    type: "object",
                    properties: {
                        name: { type: "string" },
                        address: {
                            type: "object",
                            properties: {
                                city: { type: "string" },
                                country: { type: "string" },
                                line1: { type: "string" },
                                line2: { type: "string" },
                                postal_code: { type: "string", required: true },
                                state: { type: "string" },
                                street: { type: "string" },
                            },
                        },
                        phone: { type: "string" },
                    },
                }),
            ],
        },
        {
            name: "billingAddress",
            type: "json",
            admin: {
                position: "sidebar",
            },
            required: false,
            typescriptSchema: [
                () => ({
                    type: "object",
                    properties: {
                        name: { type: "string" },
                        address: {
                            type: "object",
                            properties: {
                                city: { type: "string" },
                                country: { type: "string" },
                                line1: { type: "string" },
                                line2: { type: "string" },
                                postal_code: {
                                    type: "string",
                                },
                                state: { type: "string" },
                            },
                        },
                        email: { type: "string" },
                        phone: { type: "string" },
                    },
                }),
            ],
        },
        OrderTimeline,
    ],
    hooks: {
        beforeChange: [syncFromCheckout, addOrderTimelineEntry],
        afterChange: [markCheckoutComplete, createStripeSession],
    },
};
