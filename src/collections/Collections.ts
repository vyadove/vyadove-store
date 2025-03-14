import { admins, anyone } from "@/access/roles";
import { description } from "@/fields/description";
import { handleField } from "@/fields/slug";
import type { CollectionConfig } from "payload";
import { groups } from "./groups";

export const Collections: CollectionConfig = {
    slug: "collections",
    access: {
        create: admins,
        read: anyone,
        update: admins,
        delete: admins,
    },
    admin: {
        useAsTitle: "title",
        group: groups.catalog,
    },
    fields: [
        {
            name: "title",
            type: "text",
            required: true,
        },
        handleField(),
        description(),
        {
            name: "products",
            type: "relationship",
            relationTo: "products", // Points to the Products collection
            hasMany: true, // Allows a collection to have many products
            admin: {
                position: "sidebar",
            },
        },
    ],
};
