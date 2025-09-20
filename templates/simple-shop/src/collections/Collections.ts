import type { CollectionConfig } from "payload";

import { admins, anyone } from "@/access/roles";
import { description } from "@/fields/description";
import { HandleField } from "@/fields/handle";

import { groups } from "./groups";
import { SeoField } from "@/fields/seo";
import { RichTextEditor } from "@/fields/RichTextEditor/RichTextEditor";

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
            name: "imageUrl",
            type: "text",
        },
        HandleField(),
        RichTextEditor({
            name: "description",
            label: "Description",
        }),
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
};
