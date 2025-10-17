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
        // group: groups.catalog,
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
            defaultValue: '',
        },

        // RichTextEditor({
        //     name: "description",
        //     label: "Description",
        // }),
        // {
        //     name: "thumbnail",
        //     // label: "Image",
        //     // hasMany: true,
        //     type: "upload",
        //     relationTo: "media",
        // },
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
};
