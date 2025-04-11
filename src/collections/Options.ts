import { admins, anyone } from "@/access/roles";
import type { CollectionConfig } from "payload";

export const Options: CollectionConfig = {
    slug: "options",
    access: {
        create: admins,
        read: anyone,
        update: admins,
        delete: admins,
    },
    admin: {
        hidden: true,
        useAsTitle: "option",
    },
    fields: [
        {
            name: "product",
            type: "relationship",
            relationTo: "products",
            required: true,
        },
        {
            name: "product2",
            type: "relationship",
            relationTo: "products",
        },
        {
            name: "option",
            type: "text",
            required: true,
        },
        {
            name: "values",
            type: "array",
            required: true,
            fields: [
                {
                    name: "value",
                    type: "text",
                    required: true,
                },
            ],
        },
    ],
};
