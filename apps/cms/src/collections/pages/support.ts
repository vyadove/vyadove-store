import type { CollectionConfig } from "payload";

import { admins, anyone } from "@/access/roles";
import { HandleField } from "@/fields/handle";
import { RichTextEditor } from "@/fields/RichTextEditor/RichTextEditor";
import { groups } from "@/collections/groups";

export const Support: CollectionConfig = {
    slug: "support-page",
    access: {
        create: admins,
        delete: admins,
        read: anyone,
        update: admins,
    },
    admin: {
        // defaultColumns: ["title", "handle", "createdAt", "updatedAt"],
        group: groups.design,
        useAsTitle: "title",
    },
    fields: [
        {
            name: "title",
            type: "text",
            required: true,
        },
        RichTextEditor({
            name: "description",
            label: "Description",
        }),
        HandleField(),

        {
            type: "collapsible",
            admin: {
                initCollapsed: false,
            },
            fields: [
                {
                    name: "name",
                    type: "text",
                    required: true,
                },
                {
                    name: "email",
                    type: "email",
                    required: true,
                },
                {
                    name: "message",
                    type: "textarea",
                    required: true,
                },
            ],
            label: "Customer Messages",
        },
    ],
};
