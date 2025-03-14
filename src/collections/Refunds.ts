import { admins } from "@/access/roles";
import { getPayload, type CollectionConfig } from "payload";
import { groups } from "./groups";

export const Refunds: CollectionConfig = {
    slug: "refunds",
    admin: {
        group: groups.orders,
        hidden: true,
    },
    access: {
        create: admins,
        read: admins,
        update: admins,
        delete: admins,
    },

    fields: [
        {
            name: "order",
            type: "relationship",
            relationTo: "orders",
        },
        {
            name: "user",
            type: "relationship",
            relationTo: "users",
            required: false,
        },
        {
            name: "amount",
            type: "text",
            required: true,
        },
    ],
};
