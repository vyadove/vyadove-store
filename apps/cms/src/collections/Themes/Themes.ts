import { CollectionConfig } from "payload";
import { groups } from "../groups";
import { CustomStorefrontBlock } from "./blocks/custom-storefront-block";

export const Themes: CollectionConfig = {
    slug: "themes",
    access: {},
    admin: {
        group: groups.design,
        useAsTitle: "title",
    },
    fields: [
        {
            name: "title",
            type: "text",
            defaultValue: "Themes",
            admin: {
                disabled: true,
            },
        },
        {
            type: "blocks",
            name: "editorMode",
            blocks: [CustomStorefrontBlock],
            admin: {
                components: {
                    Description: "@/collections/Themes/components/Description",
                },
            },
            maxRows: 1,
            minRows: 1,
            required: true,
        },
        {
            name: "customStorefrontThemes",
            label: "Most Popular and Free",
            type: "group",
            admin: {
                description:
                    "Explore top-rated free themes loved by store owners—designed to help you launch quickly and look great.",
                condition: (data, peerData) => {
                    if (!data?.editorMode?.length) {
                        return false;
                    }
                    const isCustomStorefrontBlock = !!data?.editorMode?.some(
                        (type: any) =>
                            type.blockType === "custom-storefront-block"
                    );
                    return isCustomStorefrontBlock;
                },
            },
            fields: [
                {
                    name: "themeList",
                    type: "ui",
                    admin: {
                        components: {
                            Field: "@/collections/Themes/components/ThemeList",
                        },
                    },
                },
            ],
        },
    ],
};
