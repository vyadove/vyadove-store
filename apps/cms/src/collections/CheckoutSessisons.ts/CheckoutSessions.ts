import { anyone } from "@/access/roles";
import { CollectionConfig } from "payload";
import { groups } from "../groups";
import { createCheckoutSession } from "../Orders/endpoints/checkout";
import { checkoutSessionHook } from "./hooks/checkout-session-hook";

export const CheckoutSessions: CollectionConfig = {
    slug: "checkout-sessions",
    access: {
        create: anyone,
        delete: anyone,
        read: anyone,
        update: anyone,
    },
    admin: {
        useAsTitle: "sessionId",
        group: groups.orders,
    },
    hooks: {
        beforeChange: [checkoutSessionHook],
    },
    fields: [
        {
            name: "sessionId",
            type: "text",
            admin: {
                position: "sidebar",
                readOnly: true,
            },
        },
        {
            name: "customer",
            type: "relationship",
            relationTo: "users",
        },
        {
            name: "cart",
            type: "relationship",
            relationTo: "carts",
            required: true,
        },
        {
            name: "shipping",
            type: "relationship",
            relationTo: "shipping",
        },
        {
            name: "payment",
            type: "relationship",
            relationTo: "payments",
        },
        {
            name: "shippingAddress",
            type: "json",
            admin: {
                position: "sidebar",
            },
        },
        {
            name: "billingAddress",
            type: "json",
            admin: {
                position: "sidebar",
            },
        },
    ],
};
