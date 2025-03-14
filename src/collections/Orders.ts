import { admins, adminsOrSelf, anyone } from "@/access/roles";
import type { CollectionConfig } from "payload";
import { groups } from "./groups";

export const Orders: CollectionConfig = {
    slug: "orders",
    admin: {
        useAsTitle: "orderId",
        group: groups.orders,
    },
    access: {
        create: anyone,
        read: adminsOrSelf,
        update: admins,
        delete: admins,
    },
    fields: [
        {
            name: "orderId",
            type: "text",
            required: true,
            unique: true, // Ensures no duplicate orders
        },
        {
            name: "user",
            type: "relationship",
            relationTo: "users",
            required: false,
        },
        {
            name: "items",
            type: "array",
            required: true,
            fields: [
                {
                    name: "product",
                    type: "relationship",
                    relationTo: "products",
                    required: false,
                },
                {
                    name: "variant",
                    type: "group",
                    fields: [
                        {
                            name: "variantId",
                            type: "text",
                            required: true,
                        },
                        {
                            name: "name",
                            type: "text",
                            required: true,
                        },
                        {
                            name: "price",
                            type: "number",
                            required: true,
                        },
                    ],
                },
                {
                    name: "quantity",
                    type: "number",
                    min: 1,
                    required: true,
                },
                {
                    name: "totalPrice",
                    type: "number",
                    required: true,
                },
            ],
        },
        {
            name: "totalAmount",
            type: "number",
            required: true,
            min: 0,
        },
        {
            name: "currency",
            type: "text",
            required: true,
            admin: {
                position: "sidebar",
            },
        },
        {
            name: "paymentStatus",
            type: "select",
            options: [
                { label: "Pending", value: "pending" },
                { label: "Paid", value: "paid" },
                { label: "Failed", value: "failed" },
                { label: "Refunded", value: "refunded" },
            ],
            defaultValue: "pending",
            required: true,
        },
        {
            name: "orderStatus",
            type: "select",
            options: [
                { label: "Pending", value: "pending" },
                { label: "Processing", value: "processing" },
                { label: "Shipped", value: "shipped" },
                { label: "Delivered", value: "delivered" },
                { label: "Canceled", value: "canceled" },
            ],
            defaultValue: "pending",
            required: true,
        },
        {
            name: "paymentIntentId",
            type: "text",
            admin: {
                readOnly: true,
            },
        },
        {
            name: "sessionId",
            type: "text",
            required: true,
            admin: {
                position: "sidebar",
                readOnly: true,
            },
        },
        {
            name: "paymentGateway",
            type: "select",
            options: [{ label: "Stripe", value: "stripe" }],
        },
        {
            name: "paymentMethod",
            type: "text",
            required: false,
            admin: {
                position: "sidebar",
            },
        },
        {
            name: "receiptUrl",
            type: "text",
            required: false,
            admin: {
                readOnly: true,
            },
        },
        {
            name: "metadata",
            type: "json",
            admin: {
                readOnly: true,
            },
        },
        {
            name: "shippingAddress",
            typescriptSchema: [
                () => ({
                    type: "object",
                    properties: {
                        name: { type: "string" },
                        phone: { type: "string" },
                        address: {
                            type: "object",
                            properties: {
                                street: { type: "string" },
                                city: { type: "string" },
                                state: { type: "string" },
                                line1: { type: "string" },
                                line2: { type: "string" },
                                postal_code: { type: "string", required: true },
                                country: { type: "string" },
                            },
                        },
                    },
                }),
            ],
            type: "json",
            required: false,
            admin: {
                position: "sidebar",
            },
        },
        {
            name: "billingAddress",
            type: "json",
            required: false,
            typescriptSchema: [
                () => ({
                    type: "object",
                    properties: {
                        name: { type: "string" },
                        email: { type: "string" },
                        phone: { type: "string" },
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
                    },
                }),
            ],
            admin: {
                position: "sidebar",
            },
        },
        {
            name: "updatedAt",
            type: "date",
            defaultValue: () => new Date(),
            admin: {
                readOnly: true,
            },
        },
        {
            name: "createdAt",
            type: "date",
            defaultValue: () => new Date(),
            admin: {
                readOnly: true,
            },
        },
    ],
};
