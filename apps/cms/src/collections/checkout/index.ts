import type { CollectionConfig, Field } from "payload";
import { groups } from "../groups";

import { admins, anyone } from "@/access/roles";
import { canAccessOwnCheckout } from "./access/access-own";
import { transferSessionEndpoint } from "./endpoints/transfer-session";
import { calculateTotals } from "./hooks/calculate-totals";
import { guardCompletedCheckout } from "./hooks/guard-completed";
import { handleGuestSession } from "@/collections/checkout/hooks/guest-session";

export const MoneyField = (name: string, label?: string): Field => ({
    name,
    label: label || name,
    type: "group",
    fields: [
        { name: "amount", type: "number", required: true, min: 0 },
        { name: "currency", type: "text", required: true },
    ],
});

export const Checkouts: CollectionConfig = {
    slug: "checkout",
    labels: {
        singular: "Checkout",
        plural: "Checkouts",
    },
    access: {
        create: anyone,
        delete: admins,
        read: canAccessOwnCheckout,
        update: canAccessOwnCheckout,
    },
    admin: {
        useAsTitle: "sessionId",
        group: groups.orders,
        defaultColumns: ["sessionId", "email", "status", "total", "createdAt"],
    },

    endpoints: [transferSessionEndpoint],

    hooks: {
        beforeChange: [
            guardCompletedCheckout,
            handleGuestSession,
            calculateTotals,
        ],
    },

    fields: [
        // --- Identity & ownership ---
        {
            name: "sessionId",
            required: true,
            type: "text",
            unique: true,
            admin: {
                position: "sidebar",
                readOnly: true,
            },
        },
        {
            name: "customer",
            type: "relationship",
            relationTo: "users",
            admin: {
                position: "sidebar",
                description: "Linked user account if authenticated",
            },
        },

        // --- Line Items (Products in checkout) ---
        {
            name: "items",
            label: "Line Items",
            type: "array",
            minRows: 0,
            maxRows: 100,
            fields: [
                {
                    type: "row",
                    fields: [
                        {
                            name: "product",
                            type: "relationship",
                            relationTo: "products",
                            required: true,
                        },
                        {
                            name: "variantId",
                            type: "text",
                            required: true,
                        },
                    ],
                },
                {
                    type: "row",
                    fields: [
                        {
                            name: "quantity",
                            type: "number",
                            required: true,
                            defaultValue: 1,
                            min: 1,
                        },
                        {
                            name: "participants",
                            type: "number",
                            defaultValue: 1,
                            min: 1,
                            max: 100,
                            admin: {
                                description:
                                    "Number of participants for this experience",
                            },
                        },
                    ],
                },
                {
                    type: "row",
                    fields: [
                        {
                            name: "unitPrice",
                            type: "number",
                            admin: {
                                description:
                                    "Price per participant at time of adding to checkout",
                            },
                        },
                        {
                            name: "totalPrice",
                            type: "number",
                            admin: {
                                description:
                                    "Unit price × participants × quantity",
                            },
                        },
                    ],
                },
            ],
        },

        // --- Addresses ---
        {
            type: "row",
            fields: [
                {
                    name: "shippingAddress",
                    type: "json",
                    admin: {
                        description: "Delivery address details",
                    },
                    typescriptSchema: [
                        () => ({
                            type: "object",
                            properties: {
                                firstName: { type: "string" },
                                lastName: { type: "string" },
                                company: { type: "string" },
                                streetAddress1: { type: "string" },
                                streetAddress2: { type: "string" },
                                city: { type: "string" },
                                postalCode: { type: "string" },
                                state: { type: "string" },
                                country: { type: "string" },
                                phone: { type: "string" },
                            },
                        }),
                    ],
                },
                {
                    name: "billingAddress",
                    type: "json",
                    admin: {
                        description: "Billing address details",
                    },
                    typescriptSchema: [
                        () => ({
                            type: "object",
                            properties: {
                                firstName: { type: "string" },
                                lastName: { type: "string" },
                                company: { type: "string" },
                                streetAddress1: { type: "string" },
                                streetAddress2: { type: "string" },
                                city: { type: "string" },
                                postalCode: { type: "string" },
                                state: { type: "string" },
                                country: { type: "string" },
                                phone: { type: "string" },
                            },
                        }),
                    ],
                },
            ],
        },

        // --- Shipping & Delivery & Payment ---
        // --- Payment ---
        {
            type: "row",
            fields: [
                {
                    name: "shippingMethod",
                    type: "relationship",
                    relationTo: "shipping",
                    admin: {
                        description: "Selected shipping method",
                    },
                },
                {
                    name: "payment",
                    type: "relationship",
                    relationTo: "payments",
                    admin: {
                        description: "Selected payment method",
                    },
                },
            ],
        },

        // use a group as a separator
        {
            // name: "price",
            label: "Price",
            type: "group",
            admin: {
                description: "Pricing Breakdown",
            },
            fields: [],
        },

        {
            name: "paymentIntentId",
            type: "text",
            admin: {
                position: "sidebar",
                readOnly: true,
                description: "Stripe payment intent ID",
            },
        },

        // --- Pricing Breakdown ---
        {
            type: "row",
            fields: [
                {
                    name: "currency",
                    type: "text",
                    defaultValue: "USD",
                    required: true,
                },
                {
                    name: "subtotal",
                    type: "number",
                    min: 0,
                    defaultValue: 0,
                    admin: {
                        description: "Sum of all line item totals",
                    },
                },
            ],
        },
        {
            type: "row",
            fields: [
                {
                    name: "shippingTotal",
                    type: "number",
                    min: 0,
                    defaultValue: 0,
                    admin: {
                        description: "Shipping cost",
                    },
                },
                {
                    name: "taxTotal",
                    type: "number",
                    min: 0,
                    defaultValue: 0,
                    admin: {
                        description: "Total tax amount",
                    },
                },
            ],
        },
        {
            type: "row",
            fields: [
                {
                    name: "discountTotal",
                    type: "number",
                    min: 0,
                    defaultValue: 0,
                    admin: {
                        description: "Total discount applied",
                    },
                },
                {
                    name: "total",
                    type: "number",
                    min: 0,
                    defaultValue: 0,
                    required: true,
                    admin: {
                        description:
                            "Grand total (subtotal + shipping + tax - discount)",
                    },
                },
            ],
        },

        // --- Discounts & Coupons ---
        {
            // name: "price",
            label: "Discounts & Coupons",
            type: "group",
            admin: {
                description: "Pricing Breakdown",
            },
            fields: [],
        },
        {
            type: "row",
            fields: [
                {
                    name: "voucherCode",
                    type: "text",
                    admin: {
                        description: "Applied coupon/voucher code",
                    },
                },
                {
                    name: "giftCard",
                    type: "relationship",
                    relationTo: "gift-cards",
                    admin: {
                        description: "Applied gift card",
                    },
                },
            ],
        },

        // --- Customer Notes ---
        {
            type: "row",
            fields: [
                {
                    name: "customerNote",
                    type: "textarea",
                    admin: {
                        description: "Optional note from customer",
                    },
                },
                {
                    name: "email",
                    type: "email",
                    admin: {
                        description: "Contact email for order confirmation",
                    },
                },
            ],
        },

        // --- Gift Message ---
        {
            name: "giftMessage",
            type: "group",
            admin: {
                description: "Personal message to include with gift delivery",
            },
            fields: [
                {
                    name: "enabled",
                    type: "checkbox",
                    defaultValue: false,
                    admin: {
                        description: "Include personal message",
                    },
                },
                {
                    type: "row",
                    fields: [
                        {
                            name: "recipientName",
                            type: "text",
                            maxLength: 100,
                            admin: {
                                description: "To (appears in greeting)",
                            },
                        },
                        {
                            name: "senderName",
                            type: "text",
                            maxLength: 100,
                            admin: {
                                description: "From (sender name)",
                            },
                        },
                    ],
                },
                {
                    name: "message",
                    type: "textarea",
                    maxLength: 300,
                    admin: {
                        description: "Personal message (max 300 chars)",
                    },
                },
            ],
        },

        // --- Status & Lifecycle ---
        {
            name: "status",
            type: "select",
            defaultValue: "incomplete",
            required: true,
            options: [
                { label: "Incomplete", value: "incomplete" },
                { label: "Complete", value: "complete" },
                { label: "Expired", value: "expired" },
                { label: "Cancelled", value: "cancelled" },
            ],
            admin: {
                position: "sidebar",
            },
        },
        {
            name: "completedAt",
            type: "date",
            admin: {
                position: "sidebar",
                description:
                    "When checkout was completed and converted to order",
            },
        },
        {
            name: "expiresAt",
            type: "date",
            admin: {
                position: "sidebar",
                description:
                    "When this checkout session becomes invalid (typically 30 days)",
            },
        },

        // --- Related Order (virtual join - no DB column) ---
        {
            name: "order",
            type: "join",
            collection: "orders",
            on: "checkout",
            admin: {
                description: "Created order when checkout is completed",
            },
        },

        // --- Metadata ---
        {
            name: "metadata",
            type: "json",
            admin: {
                description: "Additional custom data",
            },
        },
    ],
};
