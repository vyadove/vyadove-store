import type { CollectionConfig } from "payload";

import { admins, anyone } from "@/access/roles";
import { handleField } from "@/fields/slug";
import { description } from "@/fields/description";
import { groups } from "./groups";

export const Products: CollectionConfig = {
    slug: "products",
    access: {
        create: admins,
        delete: admins,
        read: anyone,
        update: admins,
    },
    admin: {
        useAsTitle: "title",
        group: groups.catalog,
        defaultColumns: ["title", "variants", "collections"],
    },
    hooks: {
        beforeRead: [
            async ({ doc, req }) => {
                const storeSettings = await req.payload.findGlobal({
                    slug: "store-settings",
                });
                doc.currency = storeSettings.currency;
            },
        ],
    },
    fields: [
        {
            name: "pid",
            type: "text",
            admin: {
                disabled: true,
            },
        },
        {
            name: "title",
            type: "text",
            required: true,
        },
        {
            name: "currency",
            type: "text",
            admin: {
                disabled: true,
            },
        },
        {
            label: "Visibility",
            name: "visible",
            type: "checkbox",
            admin: {
                position: "sidebar",
            },
            defaultValue: true,
        },
        {
            label: "Sales Channels",
            name: "salesChannels",
            type: "select",
            admin: {
                position: "sidebar",
                disabled: true,
                description:
                    "Choose where this product should be available to customers.",
            },
            hasMany: true,
            options: [
                {
                    label: "All Channels",
                    value: "all",
                },
                {
                    label: "Online Store",
                    value: "onlineStore",
                },
                { label: "POS", value: "pos" },
                { label: "Mobile App", value: "mobileApp" },
            ],
            defaultValue: "all",
        },
        description(),
        {
            label: "Tags",
            name: "collections",
            type: "relationship",
            admin: {
                position: "sidebar",
            },
            hasMany: true,
            relationTo: "collections",
        },
        handleField(),
        {
            label: "Build Variants",
            type: "collapsible",
            fields: [
                {
                    name: "variantOptions",
                    type: "array",
                    maxRows: 5,
                    admin: {
                        description: "Choose the options for this product.",
                    },
                    fields: [
                        {
                            admin: {
                                placeholder: "Enter an option",
                            },
                            name: "option",
                            type: "text",
                            required: true,
                        },
                        {
                            admin: {
                                description: "(press enter to add multiple values)",
                                placeholder: "Enter a value",
                            },
                            name: "value",
                            type: "text",
                            required: true,
                            hasMany: true,
                        },
                    ],
                },
                {
                    name: "buildVariantsButton",
                    type: "ui",
                    admin: {
                        components: {
                            Field: "@/custom/BuildVariantsButton/BuildVariantsButton",
                        },
                    },
                },
            ],
        },

        {
            name: "variants",
            type: "array",
            minRows: 1,
            maxRows: 10,
            fields: [
                {
                    name: "vid",
                    type: "text",
                    label: "Variant ID",
                    admin: {
                        disabled: true,
                    },
                },
                {
                    name: "imageUrl",
                    type: "text",
                    label: "Image",
                    admin: {
                        disabled: true,
                    },
                },
                {
                    label: "Image",
                    name: "gallery",
                    type: "upload",
                    relationTo: "media",
                    hasMany: true,
                    admin: {
                        isSortable: false,
                        components: {
                            Cell: "@/custom/custom-image-cell",
                            // Field: "@/custom/custom-image-field#UploadField",
                        },
                    },
                },
                {
                    name: "price",
                    type: "number",
                },
                {
                    name: "originalPrice",
                    type: "number",
                    admin: {
                        disabled: true,
                    },
                },

                {
                    name: "options",
                    label: "Options",
                    type: "array",
                    fields: [
                        {
                            name: "option",
                            type: "text",
                            required: true,
                        },
                        {
                            name: "value",
                            type: "text",
                            required: true,
                        },
                    ],
                },
            ],
        },

        {
            name: "customFields",
            type: "array",
            admin: {
                position: "sidebar",
                description:
                    "Add additional product info such as care instructions, materials, or sizing notes.",
            },
            fields: [
                {
                    name: "name",
                    type: "text",
                    required: true,
                },
                {
                    name: "value",
                    type: "text",
                },
            ],
        },
    ],
};
