import { CollectionConfig, deepMergeWithCombinedArrays } from "payload";

export const PuckPages = ({
    overrides = {},
}: {
    overrides?: Partial<CollectionConfig>;
}): CollectionConfig => {
    const baseConfig: CollectionConfig = {
        slug: "puck-pages",
        admin: {
            group: "Plugins",
            useAsTitle: "title",
            defaultColumns: ["title", "handle", "createdAt", "updatedAt"],
        },
        fields: [
            {
                type: "row",
                fields: [
                    {
                        name: "title",
                        type: "text",
                        required: true,
                        defaultValue: "New Page",
                    },
                    {
                        name: "handle",
                        type: "text",
                        required: true,
                        defaultValue: "new-page",
                    },
                ],
            },
            {
                name: "page",
                type: "json",
                required: true,
                admin: {
                    components: {
                        Field: "@shopnex/puck-editor-plugin/client#PuckEditor",
                    },
                },
            },
        ],
    };
    return deepMergeWithCombinedArrays(baseConfig, overrides);
};
