import { admins, anyone } from "@/access/roles";
import { handleField } from "@/fields/slug";
import type { CollectionConfig } from "payload";

export const Policies: CollectionConfig = {
    slug: "policies",
    admin: {
        useAsTitle: "title",
        group: "Settings",
        defaultColumns: ["title", "handle", "createdAt", "updatedAt"],
    },
    access: {
        create: admins,
        read: anyone,
        update: admins,
        delete: admins,
    },
    fields: [
        {
            name: "title",
            type: "text",
            required: true,
        },
        {
            name: "description",
            type: "richText",
        },
        handleField(),
    ],
};
