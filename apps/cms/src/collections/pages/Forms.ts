import type { CollectionConfig } from "payload";

import { FormBlock } from "@/blocks/Form";
import { slugField } from "@/fields/slug";
import { groups } from "@/collections/groups";
// import { publishedOnly } from './access/publishedOnly'

export const Forms: CollectionConfig = {
    slug: "pages",

    labels: {
        plural: "Forms",
        singular: "Form",
    },
    access: {
        read: () => true,
    },
    admin: {
        defaultColumns: ["title", "slug", "updatedAt"],
        useAsTitle: "title",
        group: groups.design,
    },
    fields: [
        {
            name: "title",
            type: "text",
            required: true,
            // custom
        },
         {
             name: 'form',
             type: 'relationship',
             relationTo: 'forms',
             required: true,
        },

        {
            type: "tabs",
            tabs: [
                {
                    fields: [
                        {
                            name: "layout",
                            type: "blocks",
                            blocks: [FormBlock],
                            required: true,
                        },
                    ],
                    label: "Content",
                },
            ],
        },
        slugField(),
    ],
    versions: {
        drafts: true,
    },
};
