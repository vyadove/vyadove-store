import type { CollectionConfig } from "payload";

import { admins, anyone } from "@/access/roles";
import { HandleField } from "@/fields/handle";
import { SeoField } from "@/fields/seo";
import { createRevalidateHook } from "@/utils/revalidate-shop";
import { CacheTags } from "@vyadove/types/cache";
import { FormBlock } from "@/blocks/Form";
import { groups } from "@/collections/groups";
import slugify from "slugify";
import { BeforeChangeHook } from "@/admin/types";
import { Category as CategoryType } from "@vyadove/types";
import { syncHandleWithTitle } from "@/collections/category/hooks";

export const Category: CollectionConfig = {
    slug: "category",
    access: {
        create: admins,
        delete: admins,
        read: anyone,
        update: admins,
    },
    admin: {
        group: groups.catalog,
        useAsTitle: "title",
        baseListFilter: async ({ req }) => ({
            parent: {
                exists: false, // only show categories with no parent
            },
        }),
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
            // required: true,
        },

        {
            name: "parent",
            type: "relationship",
            relationTo: "category",
            label: "Parent Category",
            hasMany: false,
            admin: {
                position: "sidebar",
                description: "Leave empty for top-level categories.",
            },
        },

        HandleField(),

        // --- Computed display-only fields (counts) ---
        {
            name: "numProducts",
            type: "number",
            label: "Number of Products",
            admin: {
                readOnly: true,
                position: "sidebar",
                description: "Automatically calculated product count",
            },
            hooks: {
                afterRead: [
                    async ({ data, req }) => {
                        if (!data?.id) return 0;
                        try {
                            const products = await req.payload.count({
                                collection: "products",
                                where: { category: { equals: data?.id } },
                            });
                            return products?.totalDocs || 0;
                        } catch (err: any) {
                            console.log("afterRead error : ", err);
                            return -1;
                        }
                    },
                ],
            },
        },
        {
            name: "numSubcategories",
            type: "number",
            label: "Subcategories",
            admin: {
                readOnly: true,
                position: "sidebar",
                description: "Automatically calculated subcategory count",
            },
            hooks: {
                afterRead: [
                    async ({ data, req }) => {
                        if (!data?.id) return 0;
                        const subcats = await req.payload.count({
                            collection: "category",
                            where: { parent: { equals: data.id } },
                        });
                        return subcats?.totalDocs || 0;
                    },
                ],
            },
        },

        // --- tabs ---

        {
            type: "tabs",
            tabs: [
                {
                    fields: [
                        {
                            name: "products",
                            type: "join",
                            collection: "products",
                            hasMany: true,
                            on: "category",
                            maxDepth: 5,
                        },
                    ],
                    label: "Products",
                },

                {
                    label: "Subcategories",
                    fields: [
                        {
                            name: "subcategories",
                            type: "join",
                            collection: "category",
                            on: "parent",
                            hasMany: true,
                            maxDepth: 5,
                            admin: {
                                description:
                                    "These are the subcategories under this category.",
                            },
                        },
                    ],
                },
            ],
        },

        SeoField(),
    ],

    hooks: {
        afterChange: [createRevalidateHook({ tag: CacheTags.CATEGORIES })],
        beforeChange: [syncHandleWithTitle],
    },
};
