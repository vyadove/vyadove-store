import type { CollectionConfig } from "payload";

import { admins, anyone } from "@/access/roles";
import { description } from "@/fields/description";
import { handleField } from "@/fields/slug";

import { groups } from "./groups";

export const Collections: CollectionConfig = {
    slug: "collections",
    access: {
        create: admins,
        delete: admins,
        read: anyone,
        update: admins,
    },
    admin: {
        group: groups.catalog,
        useAsTitle: "title",
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
            type: "join",
            collection: "products", // Points to the collections collection
            hasMany: true, // Allows a collection to have many products
            on: "collections", // Points to the collections collection
        },
    ],
};
