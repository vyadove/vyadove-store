import type { CollectionConfig } from "payload";

import { admins, anyone } from "@/access/roles";
import { HandleField } from "@/fields/handle";
import { RichTextEditor } from "@/fields/RichTextEditor/RichTextEditor";
import { groups } from "../groups";
import { createRevalidateHook } from "@/utils/revalidate-shop";
import { CachePaths } from "@vyadove/types/cache";

export const PrivacyPolicyPage: CollectionConfig = {
    slug: "privacy-policy-page",
    access: {
        create: admins,
        delete: admins,
        read: anyone,
        update: admins,
    },
    admin: {
        defaultColumns: ["title", "handle", "createdAt", "updatedAt"],
        // group: "Settings",
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
    ],

    hooks: {
        afterChange: [
            createRevalidateHook({ path: CachePaths.PRIVACY_POLICY }),
        ],
    },
};
