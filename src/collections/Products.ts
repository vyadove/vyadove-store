import type { CollectionConfig, FilterOptionsProps } from "payload";

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
    // hooks: {
    //     beforeRead: [
    //         async (context) => {
    //             for (const variant of context.doc.variants) {
    //                 if (!variant.imageUrl && variant.gallery?.[0]) {
    //                     try {
    //                         console.log("variant.gallery[0]", variant.gallery[0]);
    //                         const imageDoc = await context.req.payload.findByID(
    //                             {
    //                                 collection: "media",
    //                                 id: variant.gallery[0], // Ensure it's defined
    //                             }
    //                         );

    //                         if (imageDoc) {
    //                             variant.imageUrl = imageDoc.url;
    //                         }
    //                     } catch (error) {
    //                         console.error("Error fetching image:", error);
    //                     }
    //                 }
    //             }
    //         },
    //     ],
    // },
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
                    name: "price",
                    type: "number",
                    required: true,
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
