import type { Block, CollectionConfig } from "payload";

import { admins, anyone } from "@/access/roles";
import { RichTextEditor } from "@/fields/RichTextEditor/RichTextEditor";
import { HandleField } from "@/fields/handle";

import { groups } from "../groups";
import { deleteMedia } from "./hooks/delete-media";
import { SeoField } from "@/fields/seo";
import { createRevalidateHook } from "@/utils/revalidate-shop";
import { CacheTags } from "@vyadove/types/cache";
import { ManualProvider } from "@/collections/Payments";
import { PricingTierArrayField } from "@/collections/Products/fields/pricing-tier";
import { syncHandleWithTitle } from "@/collections/Products/hooks";
import currencyCodes from "currency-codes";

// All available currencies from ISO 4217 standard
const allCurrencyOptions = currencyCodes.codes().map((code) => ({
    label: `${currencyCodes.code(code)?.currency} (${code})`,
    value: code,
}));

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
            name: "visible",
            type: "checkbox",
            admin: {
                position: "sidebar",
            },
            defaultValue: true,
            label: "Visibility",
        },
        {
            name: "currency",
            type: "select",
            defaultValue: "USD",
            admin: {
                position: "sidebar",
                description: "Base currency for product pricing",
            },
            options: allCurrencyOptions,
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
            name: "validity",
            type: "date",
            admin: {
                position: "sidebar",
                description:
                    "Expiration date for this gift experience. Leave empty for lifetime validity.",
                date: {
                    pickerAppearance: "dayOnly",
                    displayFormat: "MMM d, yyyy",
                },
            },
            label: "Validity / Expiration",
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
                    hidden: true,
                    defaultValue: () => {
                        return `SKU-${crypto.randomUUID().slice(0, 8)}`;
                    },
                    label: "SKU",
                },
                {
                    type: "row",
                    fields: [
                        {
                            name: "description",
                            type: "text",
                            label: "Description",
                        },
                        {
                            name: "available",
                            label: "Available",
                            type: "checkbox",
                            defaultValue: true,
                            admin: {
                                style: {
                                    maxWidth: "20%",
                                    alignSelf: "center",
                                    justifySelf: "center",
                                },
                            },
                        },
                    ],
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
                    name: "price",
                    label: "Price",
                    type: "group",
                    fields: [
                        {
                            type: "row",
                            fields: [
                                {
                                    name: "amount",
                                    type: "number",
                                    required: true,
                                    defaultValue: 0,
                                    min: 0,
                                },
                                {
                                    name: "currency",
                                    type: "select",
                                    defaultValue: "USD",
                                    options: allCurrencyOptions,
                                },
                            ],
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
                    name: "participants",
                    type: "group",
                    label: "Participants",
                    admin: {
                        description:
                            "Configure participant count for this experience",
                    },
                    fields: [
                        {
                            name: "default",
                            type: "number",
                            defaultValue: 1,
                            min: 1,
                            max: 100,
                            required: true,
                            label: "Default Participants",
                            admin: {
                                description:
                                    "Initial participant count shown to customers",
                            },
                        },
                        {
                            name: "customizeRange",
                            type: "checkbox",
                            defaultValue: false,
                            virtual: true,
                            label: "Customize range",
                            admin: {
                                description: "Set custom min/max limits",
                            },
                        },
                        {
                            type: "row",
                            admin: {
                                // Show if checkbox checked OR if min/max have non-default values
                                condition: (_, siblingData) =>
                                    siblingData?.customizeRange ||
                                    (siblingData?.min !== undefined &&
                                        siblingData.min !== 1) ||
                                    (siblingData?.max !== undefined &&
                                        siblingData.max !== 20),
                            },
                            fields: [
                                {
                                    name: "min",
                                    type: "number",
                                    defaultValue: 1,
                                    min: 1,
                                    max: 100,
                                    label: "Min",
                                    admin: { width: "50%" },
                                    validate: (
                                        value: number | undefined | null,
                                        {
                                            siblingData,
                                        }: {
                                            siblingData: Record<
                                                string,
                                                unknown
                                            >;
                                        }
                                    ) => {
                                        const max =
                                            (siblingData?.max as number) ?? 20;
                                        if (value && value > max) {
                                            return "Min must be less than or equal to max";
                                        }
                                        return true;
                                    },
                                },
                                {
                                    name: "max",
                                    type: "number",
                                    defaultValue: 20,
                                    min: 1,
                                    max: 100,
                                    label: "Max",
                                    admin: { width: "50%" },
                                    validate: (
                                        value: number | undefined | null,
                                        {
                                            siblingData,
                                        }: {
                                            siblingData: Record<
                                                string,
                                                unknown
                                            >;
                                        }
                                    ) => {
                                        const min =
                                            (siblingData?.min as number) ?? 1;
                                        if (value && value < min) {
                                            return "Max must be greater than or equal to min";
                                        }
                                        return true;
                                    },
                                },
                            ],
                        },
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
                            hidden: true,
                        },
                        {
                            name: "map_url",
                            label: "Map URL",
                            type: "text",
                            required: true,
                        },
                        {
                            name: "address",
                            label: "Address",
                            type: "text",
                        },
                    ],
                },

                {
                    name: "additionalInfo",
                    type: "array",
                    required: true,
                    minRows: 4,
                    maxRows: 10,
                    labels: {
                        singular: "Info Section",
                        plural: "Info Sections",
                    },
                    admin: {
                        initCollapsed: true,
                        description:
                            "Experience info sections. First 4 are required: About this experience, What's included, Participant guidelines, How it works.",
                        components: {
                            RowLabel:
                                "@/collections/Products/components/AdditionalInfoRowLabel#AdditionalInfoRowLabel",
                        },
                    },
                    defaultValue: [
                        { name: "About this experience", value: "" },
                        { name: "What's included", value: "" },
                        { name: "Participant guidelines", value: "" },
                        { name: "How it works", value: "" },
                    ],
                    fields: [
                        {
                            name: "name",
                            type: "text",
                            required: true,
                        },
                        RichTextEditor({
                            name: "value",
                            label: "Content",
                            required: true,
                        }),
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
            maxRows: 10,
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
        afterChange: [createRevalidateHook({ tag: CacheTags.PRODUCTS })],
        beforeChange: [syncHandleWithTitle],
    },
};
