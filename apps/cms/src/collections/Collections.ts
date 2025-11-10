import type { CollectionConfig } from "payload";

import { admins, anyone } from "@/access/roles";
import { HandleField } from "@/fields/handle";
import { SeoField } from "@/fields/seo";
import { revalidateShop } from "@/collections/Products/hooks/revalidate-shop";
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
        {
            name: "description",
            type: "text",
            required: true,
            defaultValue: "",
        },
        {
            name: "visible",
            type: "checkbox",
            admin: {
                position: "sidebar",
            },
            defaultValue: true,
            label: "Visibility",
        },

        {
            name: "thumbnail",
            label: "Thumbnail Image",
            type: "upload",
            relationTo: "media",
        },
        {
            name: "imageUrl",
            type: "text",
        },
        HandleField(),

        {
            name: "products",
            type: "join",
            collection: "products",
            hasMany: true,
            on: "collections",
            maxDepth: 5,
        },
        SeoField(),
    ],

    hooks: {
        afterChange: [revalidateShop],
    },
};
