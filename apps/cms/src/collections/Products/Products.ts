import type { Block, CollectionConfig } from "payload";

import { admins, anyone } from "@/access/roles";
import { RichTextEditor } from "@/fields/RichTextEditor/RichTextEditor";
import { HandleField } from "@/fields/handle";

import { groups } from "../groups";
import { deleteMedia } from "./hooks/delete-media";
import { SeoField } from "@/fields/seo";
import { revalidateShop } from "@/collections/Products/hooks/revalidate-shop";
import { ManualProvider } from "@/collections/Payments";
import { PricingTierArrayField } from "@/collections/Products/fields/pricing-tier";
import { syncHandleWithTitle } from "@/collections/Products/hooks";

export const Products: CollectionConfig = {
    slug: "products",
    access: {
        create: admins,
        delete: admins,
        read: anyone,
        update: admins,
    },
    admin: {
        defaultColumns: ["title", "image", "variants", "collections"],
        group: groups.catalog,
        useAsTitle: "title",
    },
    fields: [
        {
            name: "image",
            type: "ui",
            admin: {
                components: {
                    Cell: "@/collections/Products/fields/ImageCell",
                },
            },
        },
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
            name: "visible",
            type: "checkbox",
            admin: {
                position: "sidebar",
            },
            defaultValue: true,
            label: "Visibility",
        },
        {
            name: "salesChannels",
            type: "select",
            admin: {
                description:
                    "Choose where this product should be available to customers.",
                disabled: true,
                position: "sidebar",
            },
            defaultValue: "all",
            hasMany: true,
            label: "Sales Channels",
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
        },
        {
            name: "source",
            type: "select",
            admin: {
                disabled: true,
                position: "sidebar",
            },
            defaultValue: "manual",
            options: [{ label: "Manual", value: "manual" }],
        },
        {
            name: "description",
            type: "textarea",
            required: true,
        },

        {
            name: "gallery",
            type: "upload",
            required: true,
            admin: {
                isSortable: true,
            },
            hasMany: true,
            label: "Gallery",
            relationTo: "media",
        },

        {
            name: "collections",
            type: "relationship",
            admin: {
                position: "sidebar",
            },
            hasMany: true,
            label: "Collections",
            relationTo: "collections",
        },
        {
            name: "category",
            relationTo: "category",
            type: "relationship",
            admin: {
                position: "sidebar",
            },
            hasMany: true,
            label: "Category",
        },
        HandleField(),

        {
            name: "variants",
            type: "array",
            admin: {
                components: {
                    RowLabel: "@/collections/Products/fields/VariantRowLabel",
                },
                initCollapsed: true,
            },
            fields: [
                {
                    name: "vid",
                    type: "text",
                    admin: {
                        disabled: true,
                    },
                    label: "Variant ID",
                },
                {
                    name: "sku",
                    type: "text",
                    defaultValue: () => {
                        return `SKU-${crypto.randomUUID().slice(0, 8)}`;
                    },
                    label: "SKU",
                },
                {
                    name: "imageUrl",
                    type: "text",
                    admin: {
                        disabled: false,
                    },
                    label: "Image-URL",
                },
                {
                    name: "gallery",
                    type: "upload",
                    admin: {
                        isSortable: true,
                    },
                    hasMany: true,
                    label: "Gallery",
                    relationTo: "media",
                },
                {
                    type: "row",
                    fields: [
                        {
                            name: "price",
                            type: "number",
                            required: true,
                        },
                        {
                            name: "originalPrice",
                            type: "number",
                        },
                        {
                            name: "available",
                            label: "Available",
                            type: "checkbox",
                            defaultValue: true,
                        },
                    ],
                },
                {
                    name: "pricingTier",
                    type: "select",
                    admin: {
                        description: "Price tier for this variant.",
                    },
                    defaultValue: "basic",
                    label: "Pricing Tier",
                    required: true,
                    options: [
                        {
                            label: "Basic (default)",
                            value: "basic",
                        },
                        {
                            label: "Premium",
                            value: "premium",
                        },
                        { label: "Luxury", value: "luxury" },
                    ],
                },

                {
                    name: "additionalInfo",
                    type: "array",
                    // minRows: 1,
                    maxRows: 10,
                    // required: true,
                    admin: {
                        description:
                            "Add additional product variant info such as care instructions, materials, or sizing notes.",
                        // position: "sidebar",
                    },
                    fields: [
                        {
                            name: "name",
                            type: "text",
                            required: true,
                        },
                        RichTextEditor({
                            name: "value",
                            label: "Rich Text",
                            required: true,
                        }),
                    ],
                },

                {
                    name: "locations",
                    type: "array",
                    maxRows: 100,
                    fields: [
                        {
                            name: "coordinates",
                            type: "point",
                            label: "Coordinates",
                        },
                        {
                            name: "map_url",
                            label: "Map URL",
                            type: "text",
                        },
                        {
                            name: "address",
                            label: "Address",
                            type: "text",
                        },
                    ],
                },

                {
                    name: "options",
                    type: "array",
                    admin: {
                        components: {
                            RowLabel:
                                "@/collections/Products/fields/OptionRowLabel",
                        },
                    },
                    fields: [
                        {
                            type: "row",
                            fields: [
                                {
                                    name: "option",
                                    type: "text",
                                    label: "Name",
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
                    label: "Options",
                },
            ],
            maxRows: 5,
            minRows: 1,
            required: true,
        },

        {
            name: "customFields",
            type: "array",
            minRows: 1,
            maxRows: 10,
            required: true,
            admin: {
                description:
                    "Add additional product info such as care instructions, materials, or sizing notes.",
                // position: "sidebar",
            },
            fields: [
                {
                    name: "name",
                    type: "text",
                    required: true,
                },
                RichTextEditor({
                    name: "value",
                    label: "Rich Text",
                    required: true,
                }),
            ],
        },

        SeoField(),
    ],
    hooks: {
        afterDelete: [deleteMedia],
        afterChange: [revalidateShop],
        beforeChange: [syncHandleWithTitle],
    },
};
