import type { CollectionConfig, FilterOptionsProps } from "payload";

import { admins, anyone } from "@/access/roles";
import { handleField } from "@/fields/slug";
import { description } from "@/fields/description";
import { groups } from "./groups";
import { fetchExchangeRates } from "@/utilities/fetch-exchange-rates";
import decimal from "decimal.js";

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
                const exchangeRates = await fetchExchangeRates();
                const storeSettings = await req.payload.findGlobal({
                    slug: "store-settings",
                });
                const rate =
                    exchangeRates.rates[storeSettings.currency || "USD"];
                for (const variant of doc.variants) {
                    variant.originalPrice =
                        variant.originalPrice &&
                        new decimal(variant.originalPrice)
                            .mul(rate)
                            .toNumber()
                            .toFixed(2);

                    variant.price = new decimal(variant.price)
                        .mul(rate)
                        .toNumber()
                        .toFixed(2);
                }
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
            name: "variants",
            type: "array",
            minRows: 1,
            required: true,
            fields: [
                {
                    name: "gallery",
                    type: "upload",
                    relationTo: "media",
                    hasMany: true,
                    admin: {
                        isSortable: false,
                        components: {
                            Cell: "@/custom/custom-image-cell",
                        },
                    },
                },
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
                    ],
                },
                {
                    name: "options",
                    label: "Attributes",
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
    ],
};
